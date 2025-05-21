import { todocoll, usercoll } from "../../../db/mongo.js"
import { createTodoSchema } from "../../../modal/client/todo.js"
import { getAllTodoQuery } from "../../../queries/v1/client/todo.js"
import { getUTCDate } from "../general.js"

const create = async (body, uid) => {
	return new Promise(async (resolve, reject) => {
		let user_coll = await usercoll()
		let todo_coll = await todocoll()

		user_coll
			.findOne({ uid: uid })
			.then(async user => {
				let data = await createTodoSchema(body, uid)
				todo_coll
					.insertOne(data)
					.then(async result => {
						let resp = {
							code: 200,
							error: false,
							message: "Todo created successfully",
						}
						resolve(resp)
					})
					.catch(err => {
						let resp = {
							code: 400,
							error: true,
							message: "Failed to create todo",
						}
						reject(resp)
					})
			})
			.catch(err => {
				let resp = {
					code: 404,
					error: true,
					message: "User not found",
				}
				reject(resp)
			})
	})
}

const getAll = async (uid, query, page, limit) => {
	return new Promise(async (resolve, reject) => {
		let todo_coll = await todocoll()
		const pipeline = await getAllTodoQuery(page, limit, uid, query)
		const totalCount = await todo_coll?.countDocuments({ uid: uid })

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
							count: data.count,
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

const getTodoById = async (uid, todoId) => {
	return new Promise(async (resolve, reject) => {
		let todo_coll = await todocoll()
		todo_coll
			.findOne({ uid: uid, todoId: todoId })
			.then(async result => {
				let resp = {
					code: 200,
					error: false,
					message: "Todo get successfully",
					result: result,
				}
				resolve(resp)
			})
			.catch(err => {
				let resp = {
					code: 404,
					error: true,
					message: "Todo not found",
				}
				reject(resp)
			})
	})
}

const update = async (uid, todoId, body) => {
	return new Promise(async (resolve, reject) => {
		let todo_coll = await todocoll()
		todo_coll
			.findOne({ uid: uid })
			.then(async result => {
				if (result) {
					todo_coll
						.updateOne(
							{ todoId: todoId },
							{
								$set: {
									updatedAt: new Date(),
									label: body?.label || result?.label,
									content: body?.content || result?.content,
									type: body?.type || result?.type,
									status: body?.status || result?.status,
									startDate: body?.startDate
										? getUTCDate(
												body?.startDate,
												2,
												0,
												0,
												0
										  )
										: result?.startDate || null,
									endDate: body?.endDate
										? getUTCDate(body?.endDate, 2, 0, 0, 0)
										: result?.endDate || null,
								},
							}
						)
						.then(async result => {
							let resp = {
								code: 200,
								error: false,
								message: "Todo updated successfully",
							}
							resolve(resp)
						})
						.catch(err => {
							let resp = {
								code: 404,
								error: true,
								message: "Todo not found",
							}
							reject(resp)
						})
				} else {
					let resp = {
						code: 404,
						error: true,
						message: "User not found",
					}
					reject(resp)
				}
			})
			.catch(err => {
				let resp = {
					code: 500,
					error: true,
					message: "Failed to update todo",
				}
				reject(resp)
			})
	})
}

const deleteTodoById = async (uid, todoId) => {
	return new Promise(async (resolve, reject) => {
		let todo_coll = await todocoll()
		todo_coll
			.findOne({ uid: uid, todoId: todoId })
			.then(async result => {
				if (result === null) {
					let resp = {
						code: 404,
						error: true,
						message: "Todo not found",
					}
					reject(resp)
				}
				todo_coll
					.deleteOne({ uid: uid, todoId: todoId })
					.then(async result => {
						let resp = {
							code: 200,
							error: false,
							message: "Todo deleted successfully",
						}
						resolve(resp)
					})
					.catch(err => {
						let resp = {
							code: 404,
							error: true,
							message: "Todo not found",
						}
						reject(resp)
					})
			})
			.catch(err => {
				let resp = {
					code: 404,
					error: true,
					message: "Todo not found",
				}
				reject(resp)
			})
	})
}

export {
	create as createTodoHelper,
	deleteTodoById as deleteTodoByIdHelper,
	getAll as getAllTodoHelper,
	getTodoById as getTodoByIdHelper,
	update as getUpdateTodoHelper,
}
