import { learncoll, usercoll } from "../../../db/mongo.js"
import { createLearnSchema } from "../../../modal/client/learn.js"
import {
	getAllLearnPrivateQuery,
	getAllLearnPublicQuery,
} from "../../../queries/v1/client/learn.js"

const create = async (body, uid) => {
	return new Promise(async (resolve, reject) => {
		let user_coll = await usercoll()
		let learn_coll = await learncoll()

		user_coll
			.findOne({ uid: uid })
			.then(async user => {
				let data = await createLearnSchema(body, uid)
				learn_coll
					.insertOne(data)
					.then(async result => {
						let resp = {
							code: 200,
							error: false,
							message: "Learn created successfully",
						}
						resolve(resp)
					})
					.catch(err => {
						let resp = {
							code: 400,
							error: true,
							message: "Failed to create learn",
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

const getAllPrivate = async (uid, query, page, limit) => {
	return new Promise(async (resolve, reject) => {
		let learn_coll = await learncoll()
		const pipeline = await getAllLearnPrivateQuery(page, limit, uid, query)
		const totalCount = await learn_coll?.countDocuments({ uid: uid })

		learn_coll
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
						message: "Learn list get successfully",
						result: result.map(data => ({
							_id: data._id,
							uid: data.uid,
							learnId: data.learnId,
							parentId: data.parentId,
							label: data.label,
							type: data.type,
							videoUrl: data.videoUrl,
							access: data.access,
							createdAt: data.createdAt,
							updatedAt: data.updatedAt,
							count: data.count,
						})),
						pagination: pagination,
					}
					resolve(resp)
				} else {
					let resp = {
						code: 200,
						error: false,
						message: "Learn list Empty",
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
				console.log(err)

				let resp = {
					code: 500,
					error: true,
					message: "Error in getting learn list",
				}
				reject(resp)
			})
	})
}

const getAllPublic = async (query, page, limit) => {
	return new Promise(async (resolve, reject) => {
		let learn_coll = await learncoll()
		const pipeline = await getAllLearnPublicQuery(page, limit, query)
		const totalCount = await learn_coll?.countDocuments({})

		learn_coll
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
						message: "Learn list get successfully",
						result: result.map(data => ({
							_id: data._id,
							uid: data.uid,
							learnId: data.learnId,
							parentId: data.parentId,
							label: data.label,
							type: data.type,
							videoUrl: data.videoUrl,
							access: data.access,
							createdAt: data.createdAt,
							updatedAt: data.updatedAt,
							count: data.count,
						})),
						pagination: pagination,
					}
					resolve(resp)
				} else {
					let resp = {
						code: 200,
						error: false,
						message: "Learn list Empty",
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
				console.log(err)

				let resp = {
					code: 500,
					error: true,
					message: "Error in getting learn list",
				}
				reject(resp)
			})
	})
}

const getLearnById = async learnId => {
	return new Promise(async (resolve, reject) => {
		let learn_coll = await learncoll()
		learn_coll
			.findOne({ learnId: learnId })
			.then(async result => {
				let resp = {
					code: 200,
					error: false,
					message: "Learn get successfully",
					result: result,
				}
				resolve(resp)
			})
			.catch(err => {
				let resp = {
					code: 404,
					error: true,
					message: "Learn not found",
				}
				reject(resp)
			})
	})
}

const update = async (uid, learnId, body) => {
	return new Promise(async (resolve, reject) => {
		let learn_coll = await learncoll()
		learn_coll
			.findOne({ uid: uid })
			.then(async result => {
				if (result) {
					learn_coll
						.updateOne(
							{ learnId: learnId },
							{
								$set: {
									updatedAt: new Date(),
									label: body?.label || result?.label,
									access: body?.access || result?.access,
									type: body?.type || result?.type,
									videoUrl:
										body?.videoUrl || result?.videoUrl,
								},
							}
						)
						.then(async result => {
							let resp = {
								code: 200,
								error: false,
								message: "Learn updated successfully",
							}
							resolve(resp)
						})
						.catch(err => {
							let resp = {
								code: 404,
								error: true,
								message: "Learn not found",
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
					message: "Failed to update learn",
				}
				reject(resp)
			})
	})
}

const deleteLearnById = async (uid, learnId) => {
	return new Promise(async (resolve, reject) => {
		let learn_coll = await learncoll()
		learn_coll
			.findOne({ uid: uid, learnId: learnId })
			.then(async result => {
				if (result === null) {
					let resp = {
						code: 404,
						error: true,
						message: "learn not found",
					}
					reject(resp)
				}
				learn_coll
					.deleteOne({ uid: uid, learnId: learnId })
					.then(async result => {
						let resp = {
							code: 200,
							error: false,
							message: "learn deleted successfully",
						}
						resolve(resp)
					})
					.catch(err => {
						let resp = {
							code: 404,
							error: true,
							message: "learn not found",
						}
						reject(resp)
					})
			})
			.catch(err => {
				let resp = {
					code: 404,
					error: true,
					message: "learn not found",
				}
				reject(resp)
			})
	})
}

export {
	create as createLearnHelper,
	deleteLearnById as deleteLearnByIdHelper,
	getAllPrivate as getAllLearnPrivateHelper,
	getAllPublic as getAllLearnPublicHelper,
	getLearnById as getLearnByIdHelper,
	update as getUpdateLearnHelper,
}
