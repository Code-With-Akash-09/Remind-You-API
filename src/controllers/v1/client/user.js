import {
	getProfileHelper,
	updateProfileHelper,
} from "../../../helper/v1/client/user.js"

const profile = async (req, res) => {
	let uid = req.user.id

	getProfileHelper(uid)
		.then(async result => {
			res.status(result.code).json({
				message: result.message,
				error: result.error,
				code: result.code,
				results: {
					data: result,
				},
			})
		})
		.catch(err => {
			res.status(err?.code || 500).json({
				message: "Error in getting user profile",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

const update = async (req, res) => {
	let uid = req.user.id
	let body = req.body

	updateProfileHelper(uid, body)
		.then(async result => {
			res.status(result.code).json({
				message: result.message,
				error: result.error,
				code: result.code,
				results: {
					data: result,
				},
			})
		})
		.catch(err => {
			res.status(err?.code || 500).json({
				message: "Error in getting user profile",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

export { profile, update }
