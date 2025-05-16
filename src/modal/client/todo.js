import { uuid } from "uuidv4"
import { getUTCDate } from "../../helper/v1/general.js"
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
		startDate: body?.startDate
			? getUTCDate(body?.startDate, 1, 0, 0, 0)
			: null,
		endDate: body?.endDate ? getUTCDate(body?.endDate, 1, 0, 0, 0) : null,
	}
	return data
}

export { createTodo as createTodoSchema }
