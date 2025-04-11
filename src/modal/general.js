import { uuid } from "uuidv4"

const general = async uid => {
	let data = {
		uid: uid || uuid(),
		createdAt: new Date(),
		updatedAt: new Date(),
	}
	return data
}

const timestamp = async () => {
	let data = {
		createdAt: new Date(),
		updatedAt: new Date(),
	}
	return data
}

const updateTimestamp = async () => {
	let data = {
		updatedAt: new Date(),
	}
	return data
}

export { general, timestamp, updateTimestamp }
