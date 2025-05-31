import { uuid } from "uuidv4"
import { general } from "../general.js"

const createTodo = async (body, uid) => {
	let generic = await general(uid)
	let data = {
		...generic,
		todoId: body?.todoId || uuid(),
		label: body?.label || null,
		content: body?.content || null,
		type: body?.type || null,
		parentId: body?.parentId || null,
		status: body?.status || null,
		priority: body?.priority || null,
		startDate: new Date(body?.startDate) || null,
		endDate: new Date(body?.endDate) || null,
	}
	return data
}

export { createTodo as createTodoSchema }
