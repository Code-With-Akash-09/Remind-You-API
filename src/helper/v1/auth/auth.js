import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { usercoll } from "../../../db/mongo.js"
import { addUserSchema } from "../../../modal/auth/auth.js"

const createAccessandRefreshToken = async body => {
	return new Promise(async (resolve, reject) => {
		try {
			const accessToken = {
				id: body.id,
			}
			const jwtToken = jwt.sign(accessToken, process.env.PRIVATE_KEY, {
				algorithm: "HS256",
				expiresIn: "365d",
			})
			const userDataResfresh = {
				id: body.id,
			}
			resolve({
				jwt: jwtToken,
			})
		} catch (err) {
			reject(err)
		}
	})
}

const hashPassword = async password => {
	const saltround = 10
	return await bcrypt.hash(password, saltround)
}

const verifyPassword = async (inputPassword, storePassword) => {
	return await bcrypt.compare(inputPassword, storePassword)
}

const checkUser = async body => {
	return new Promise(async (resolve, reject) => {
		let user_coll = await usercoll()
		user_coll
			.findOne({ mobile: body.mobile })
			.then(async result => {
				if (result) {
					let resp = {
						code: 409,
						error: true,
						message: "Mobile no allready in use",
					}
					reject(resp)
				} else {
					const encryptedPassword = await hashPassword(body.password)
					let data = await addUserSchema({
						...body,
						password: encryptedPassword,
					})
					user_coll
						.insertOne(data)
						.then(async result => {
							let resp = {
								code: 201,
								error: false,
								message: "User created successfully",
							}
							resolve(resp)
						})
						.catch(err => {
							let resp = {
								code: 500,
								error: true,
								message: err.message,
							}
							reject(resp)
						})
				}
			})
			.catch(err => {
				let resp = {
					code: 500,
					error: true,
					message: err.message,
				}
				reject(resp)
			})
	})
}

const getUser = async body => {
	return new Promise(async (resolve, reject) => {
		const user_coll = await usercoll()
		user_coll
			.findOne({ mobile: body.mobile })
			.then(async result => {
				if (result) {
					const checkPassword = await verifyPassword(
						body.password,
						result.password
					)
					if (checkPassword) {
						const tokenData = await createAccessandRefreshToken({
							id: result.uid,
						})
						let resp = {
							code: 200,
							error: false,
							message: "User Login Successfully",
							data: {
								token: tokenData.jwt,
							},
						}
						resolve(resp)
					} else {
						let resp = {
							code: 401,
							error: true,
							message: "Invalid Password",
						}
						reject(resp)
					}
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
					message: err.message,
				}
				reject(resp)
			})
	})
}

export { checkUser as checkUserHelper, getUser as getUserHelper }
