const paginationQuery = async (page = 1, limit = 15) => {
	parseInt(page)
	parseInt(limit)
	let data = [
		{
			$limit: page * limit,
		},
		{
			$skip: parseInt((page - 1) * limit),
		},
	]
	return data
}

export { paginationQuery }
