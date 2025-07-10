import {
	createTodoHelper,
	deleteTodoByIdHelper,
	deleteTodosByIdHelper,
	getAllTodoHelper,
	getTodoByIdHelper,
	getUpdateTodoHelper,
} from "../../../helper/v1/client/todo.js"

const create = async (req, res) => {
	let body = req.body
	let uid = req.user.id

	createTodoHelper(body, uid)
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
				message: "Error in creating todo",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

const getAll = async (req, res) => {
	let uid = req.user.id
	let parentId = req.query.parentId
	let page = req.query.page || 1
	let limit = req.query.limit || 10

	let query = {}
	if (parentId === "root") {
		query.parentId = null
	} else {
		query.parentId = parentId
	}

	getAllTodoHelper(uid, query, page, limit)
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
				message: "Error in getting todo list",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

const getTodoById = async (req, res) => {
	let uid = req.user.id
	let todoId = req.params.todoId

	getTodoByIdHelper(uid, todoId)
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
				message: "Error in getting todo by id",
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
	let todoId = req.params.todoId
	let body = req.body

	getUpdateTodoHelper(uid, todoId, body)
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
				message: "Error in updating todo",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

const deleteTodoById = async (req, res) => {
	let uid = req.user.id
	let todoId = req.params.todoId

	deleteTodoByIdHelper(uid, todoId)
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

const deleteTodosById = async (req, res) => {
	let uid = req.user.id
	let { todoIds } = req.body

	console.log(todoIds)

	deleteTodosByIdHelper(uid, todoIds)
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
				message: "Error in deleting todos",
				error: err.error || true,
				code: err.code || 500,
				results: {
					data: err,
				},
			})
		})
}

export { create, deleteTodoById, deleteTodosById, getAll, getTodoById, update }
