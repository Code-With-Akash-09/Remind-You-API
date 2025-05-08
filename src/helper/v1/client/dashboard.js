import { todocoll } from "../../../db/mongo.js"
import {
	getSearchQuery,
	getTaskStateQuery,
} from "../../../queries/v1/client/dashboard.js"

const taskState = async (uid, statusId, page, limit) => {
	return new Promise(async (resolve, reject) => {
		let todo_coll = await todocoll()
		const pipeline = await getTaskStateQuery(uid, statusId, page, limit)
		const totalCount = await todo_coll.countDocuments({ uid: uid })

		todo_coll
			.aggregate(pipeline)
			.toArray()
			.then(async result => {
				if (result.length > 0) {
					let max = Math.ceil(totalCount / limit)
					let pagination = {
						previous: page === 1 ? null : page - 1,
						next: page === max ? null : page + 1,
					}
					if (totalCount === 0)
						pagination = {
							previous: null,
							next: null,
						}
					let resp = {
						code: 200,
						error: false,
						message: "Todo list",
						result: result.map(data => ({
							_id: data._id,
							uid: data.uid,
							todoId: data.todoId,
							label: data.label,
							content: data.content,
							type: data.type,
							parentId: data.parentId,
							status: data.status,
							createdAt: data.createdAt,
							updatedAt: data.updatedAt,
							startDate: data.startDate,
							endDate: data.endDate,
						})),
						pagination: pagination,
					}
					resolve(resp)
				} else {
					let resp = {
						code: 200,
						error: false,
						message: "Todo list Empty",
						result: [],
						pagination: {
							previous: null,
							next: null,
						},
					}
					resolve(resp)
				}
			})
			.catch(err => {
				let resp = {
					code: 500,
					error: true,
					message: "Error in getting todo list",
				}
				reject(resp)
			})
	})
}

const search = async (uid, query) => {
	return new Promise(async (resolve, reject) => {
		let todo_coll = await todocoll()
		const pipeline = await getSearchQuery(uid, query)

		todo_coll
			.aggregate(pipeline)
			.toArray()
			.then(async result => {
				if (result.length > 0) {
					let resp = {
						code: 200,
						error: false,
						message: "Todo list get successfully",
						result: result.map(data => ({
							_id: data._id,
							uid: data.uid,
							todoId: data.todoId,
							label: data.label,
							content: data.content,
							type: data.type,
							parentId: data.parentId,
							status: data.status,
							createdAt: data.createdAt,
							updatedAt: data.updatedAt,
							startDate: data.startDate,
							endDate: data.endDate,
						})),
					}
					resolve(resp)
				} else {
					let resp = {
						code: 200,
						error: false,
						message: "Todo list Empty",
						result: [],
					}
					resolve(resp)
				}
			})
			.catch(err => {
				let resp = {
					code: 500,
					error: true,
					message: "Error in getting todo list",
				}
				reject(resp)
			})
	})
}

export { search as getSearchHelper, taskState as getTaskStateHelper }
