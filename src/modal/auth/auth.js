import { general } from "../general.js"

const addUser = async body => {
	let generic = await general()
	let data = {
		...generic,
		isAdmin: false,
		name: body?.name,
		email: body?.email,
		mobile: body?.mobile,
		password: body?.password,
		description: body?.description,
		designation: body?.designation,
	}
	return data
}

export { addUser as addUserSchema }
