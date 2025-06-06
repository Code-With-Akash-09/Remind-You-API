import {
	createLearnHelper,
	deleteLearnByIdHelper,
	getAllLearnPrivateHelper,
	getAllLearnPublicHelper,
	getLearnByIdHelper,
	getUpdateLearnHelper,
} from "../../../helper/v1/client/learn.js"
import { uploadFileCloudinary } from "../../../services/upload.js"

const create = async (req, res) => {
	let body = req.body
	let uid = req.user.id

	createLearnHelper(body, uid)
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
				message: "Error in Creating learn",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

const getAllPrivate = async (req, res) => {
	let uid = req.user?.id
	let parentId = req.query.parentId
	let page = req.query.page || 1
	let limit = req.query.limit || 10

	let query = {}
	if (parentId === "root") {
		query.parentId = null
	} else {
		query.parentId = parentId
	}

	getAllLearnPrivateHelper(uid, query, page, limit)
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
				message: "Error in getting learn list",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

const getAllPublic = async (req, res) => {
	let parentId = req.query.parentId
	let page = req.query.page || 1
	let limit = req.query.limit || 10

	let query = {}
	if (parentId === "root") {
		query.parentId = null
	} else {
		query.parentId = parentId
	}

	getAllLearnPublicHelper(query, page, limit)
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
				message: "Error in getting learn list",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

const getLearnById = async (req, res) => {
	let learnId = req.params.learnId

	getLearnByIdHelper(learnId)
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
				message: "Error in getting learn by id",
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
	let learnId = req.params.learnId
	let body = req.body

	getUpdateLearnHelper(uid, learnId, body)
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
				message: "Error in updating learn",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

const deleteLearnById = async (req, res) => {
	let uid = req.user.id
	let learnId = req.params.learnId

	deleteLearnByIdHelper(uid, learnId)
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
				message: "Error in deleting todo",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

const uploadAssets = async (req, res) => {
	const { image, video } = req.files || {}

	if (!image && !video) {
		return res.status(400).json({
			message: "No file provided",
			error: true,
			code: 400,
		})
	}

	try {
		const [imageResult, videoResult] = await Promise.all([
			image?.[0] ? uploadFileCloudinary(image[0].path) : null,
			video?.[0] ? uploadFileCloudinary(video[0].path, true) : null,
		])

		const results = {
			...(imageResult ? { image: imageResult.data } : {}),
			...(videoResult ? { video: videoResult.data } : {}),
		}

		res.status(200).json({
			message: "Files uploaded successfully",
			error: false,
			code: 200,
			results,
		})
	} catch (err) {
		res.status(err?.code || 500).json({
			message: "Error in uploading files",
			error: err?.error || true,
			code: err?.code || 500,
			results: {
				data: {
					error: err?.message || "Unknown error",
				},
			},
		})
	}
}

export {
	create,
	deleteLearnById,
	getAllPrivate,
	getAllPublic,
	getLearnById,
	update,
	uploadAssets,
}
