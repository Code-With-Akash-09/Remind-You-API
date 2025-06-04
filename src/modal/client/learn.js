import { uuid } from "uuidv4"
import { general } from "../general.js"

const createLearn = async (body, uid) => {
	let generic = await general(uid)
	let data = {
		...generic,
		learnId: body?.learnId || uuid(),
		parentId: body?.parentId || null,
		type: body?.type || null,
		label: body?.label || null,
		videoUrl: body?.videoUrl || null,
		access: body?.access || null,
	}
	return data
}

export { createLearn as createLearnSchema }
