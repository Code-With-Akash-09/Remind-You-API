import { paginationQuery } from "../general.js"

const getAll = async (page, limit, uid, query) => {
	const { parentId } = query

	const matchStage = {
		uid: uid,
		...(parentId !== undefined && {
			parentId: parentId === null ? null : parentId,
		}),
	}

	const pipeline = [
		{ $match: matchStage },
		{ $sort: { createdAt: -1 } },
		{
			$lookup: {
				from: "todos",
				let: { currentTodoId: "$todoId" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$parentId", "$$currentTodoId"] },
						},
					},
					{
						$group: {
							_id: "$type",
							count: { $sum: 1 },
						},
					},
				],
				as: "childCounts",
			},
		},
		{
			$addFields: {
				count: {
					folder: {
						$let: {
							vars: {
								matched: {
									$filter: {
										input: "$childCounts",
										as: "item",
										cond: { $eq: ["$$item._id", "folder"] },
									},
								},
							},
							in: {
								$cond: [
									{ $gt: [{ $size: "$$matched" }, 0] },
									{ $arrayElemAt: ["$$matched.count", 0] },
									0,
								],
							},
						},
					},
					file: {
						$let: {
							vars: {
								matched: {
									$filter: {
										input: "$childCounts",
										as: "item",
										cond: { $eq: ["$$item._id", "file"] },
									},
								},
							},
							in: {
								$cond: [
									{ $gt: [{ $size: "$$matched" }, 0] },
									{ $arrayElemAt: ["$$matched.count", 0] },
									0,
								],
							},
						},
					},
				},
			},
		},
		{
			$project: {
				childCounts: 0,
			},
		},
		...(await paginationQuery(page, limit)),
	]

	return pipeline
}

export { getAll as getAllTodoQuery }
