import jwt from "jsonwebtoken"
import { error } from "../configs/response.js"

const checkAuth = (req, res, next) => {
	try {
		var token = req.headers.authorization.split(" ")[1]
		var decode = jwt.verify(token, process.env.PRIVATE_KEY)
		req.user = decode
		next()
	} catch (err) {
		return res
			.status(401)
			.json(error("Unauthorised Access", {}, res.statusCode))
	}
}

const checkRefresh = (req, res, next) => {
	try {
		var token = req.body.refresh
		var decode = jwt.verify(token, process.env.PRIVATE_KEY)
		req.user = decode
		next()
	} catch (err) {
		let isExpired = false
		if (e.message === "jwt expired") {
			isExpired = true
		}
		return res
			.status(401)
			.json(
				error(
					"Unauthorised Access",
					{ error: e.message, isExpired: isExpired },
					res.statusCode
				)
			)
	}
}

export { checkAuth, checkRefresh }
