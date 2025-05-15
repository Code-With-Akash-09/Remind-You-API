import { usercoll } from "../../../db/mongo.js"

const getProfile = async uid => {
	return new Promise(async (resolve, reject) => {
		let user_coll = await usercoll()

		user_coll
			.findOne({ uid: uid })
			.then(async result => {
				let resp = {
					code: 200,
					error: false,
					message: "User profile get successfully",
					result: {
						uid: result.uid,
						name: result.name,
						email: result.email,
						mobile: result.mobile,
						description: result.description,
						designation: result.designation,
					},
				}
				resolve(resp)
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

const updateProfile = async (uid, body) => {
	return new Promise(async (resolve, reject) => {
		let user_coll = await usercoll()

		user_coll.findOne({ uid: uid }).then(async result => {
			if (result) {
				user_coll
					.updateOne(
						{ uid: uid },
						{
							$set: {
								updatedAt: new Date(),
								name: body?.name || result?.name,
								email: body?.email || result?.email,
								mobile: body?.mobile || result?.mobile,
								description:
									body?.description || result?.description,
								designation:
									body?.designation || result?.designation,
							},
						}
					)
					.then(async result => {
						let resp = {
							code: 200,
							error: false,
							message: "User updated successfully",
						}
						resolve(resp)
					})
					.catch(err => {
						let resp = {
							code: 404,
							error: true,
							message: "User not found",
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
	})
}

export { getProfile as getProfileHelper, updateProfile as updateProfileHelper }
