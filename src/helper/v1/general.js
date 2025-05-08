export const getUTCDate = (
	dateString,
	hour = 0,
	minute = 0,
	second = 0,
	ms = 0
) => {
	const date = new Date(dateString)
	const year = date.getFullYear()
	const month = date.getMonth()
	const day = date.getDate()
	return new Date(Date.UTC(year, month, day, hour, minute, second, ms))
}
