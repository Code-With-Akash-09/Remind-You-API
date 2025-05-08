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

export { getSearch as getSearchQuery, getTaskState as getTaskStateQuery }
