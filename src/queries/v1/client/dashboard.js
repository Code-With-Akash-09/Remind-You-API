import { paginationQuery } from "../general.js"

const getTaskState = async (uid, statusId, page, limit) => {
	let today = new Date()

	let tomorrow = new Date(today)
	tomorrow.setUTCDate(today.getUTCDate() + 1)

	let matchStage = {}

	if (statusId === "current") {
		matchStage = {
			startDate: {
				$gte: new Date(today.setUTCHours(0, 0, 0, 0)),
				$lt: new Date(today.setUTCHours(23, 59, 59, 99)),
			},
		}
	} else if (statusId === "upcoming") {
		matchStage = {
			startDate: {
				$gte: new Date(tomorrow.setUTCHours(0, 0, 0, 0)),
			},
		}
	} else if (statusId === "backlog") {
		matchStage = {
			startDate: {
				$lt: today,
			},
		}
	}

	let pipeline = [
		{
			$match: {
				uid: uid,
				type: "file",
				...matchStage,
			},
		},
		{
			$sort: { createdAt: -1 },
		},
		...(await paginationQuery(page, limit)),
	]
	return pipeline
}

const getSearch = async (uid, query) => {
	if (!query || query.trim() === "") {
		return [
			{
				$match: {
					uid: uid,
				},
			},
			{
				$sort: { createdAt: -1 },
			},
		]
	}

	let pipeline = [
		{
			$match: {
				uid: uid,
				label: { $regex: query, $options: "i" },
			},
		},
		{
			$sort: { createdAt: -1 },
		},
	]

	return pipeline
}

const getCount = async uid => {
	const matchStage = { uid }

	const pipeline = [
		{ $match: matchStage },
		{
			$group: {
				_id: "$status",
				count: { $sum: 1 },
			},
		},
		{
			$group: {
				_id: null,
				statusCounts: {
					$push: {
						k: "$_id",
						v: "$count",
					},
				},
				total: { $sum: "$count" },
			},
		},
		{
			$project: {
				_id: 0,
				total: 1,
				completed: {
					$ifNull: [
						{
							$arrayElemAt: [
								{
									$map: {
										input: {
											$filter: {
												input: "$statusCounts",
												as: "item",
												cond: {
													$eq: [
														"$$item.k",
														"completed",
													],
												},
											},
										},
										as: "matched",
										in: "$$matched.v",
									},
								},
								0,
							],
						},
						0,
					],
				},
				inProgress: {
					$ifNull: [
						{
							$arrayElemAt: [
								{
									$map: {
										input: {
											$filter: {
												input: "$statusCounts",
												as: "item",
												cond: {
													$eq: [
														"$$item.k",
														"in-progress",
													],
												},
											},
										},
										as: "matched",
										in: "$$matched.v",
									},
								},
								0,
							],
						},
						0,
					],
				},
				backlog: {
					$ifNull: [
						{
							$arrayElemAt: [
								{
									$map: {
										input: {
											$filter: {
												input: "$statusCounts",
												as: "item",
												cond: {
													$eq: [
														"$$item.k",
														"backlog",
													],
												},
											},
										},
										as: "matched",
										in: "$$matched.v",
									},
								},
								0,
							],
						},
						0,
					],
				},
				cancelled: {
					$ifNull: [
						{
							$arrayElemAt: [
								{
									$map: {
										input: {
											$filter: {
												input: "$statusCounts",
												as: "item",
												cond: {
													$eq: [
														"$$item.k",
														"cancelled",
													],
												},
											},
										},
										as: "matched",
										in: "$$matched.v",
									},
								},
								0,
							],
						},
						0,
					],
				},
				notStarted: {
					$ifNull: [
						{
							$arrayElemAt: [
								{
									$map: {
										input: {
											$filter: {
												input: "$statusCounts",
												as: "item",
												cond: {
													$eq: [
														"$$item.k",
														"not-started",
													],
												},
											},
										},
										as: "matched",
										in: "$$matched.v",
									},
								},
								0,
							],
						},
						0,
					],
				},
			},
		},
	]

	return pipeline
}

export {
	getCount as getCountQuery,
	getSearch as getSearchQuery,
	getTaskState as getTaskStateQuery,
}
