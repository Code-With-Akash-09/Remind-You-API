import { paginationQuery } from "../general.js";


const getAll = async (page, limit, uid, query) => {

    const { parentId } = query

    let pipeline = [
        {
            $match: { uid: uid, parentId: parentId }
        },
        {
            $sort: { createdAt: -1 },
        },
        ...(await paginationQuery(page, limit)),
    ]
    return pipeline
}

export {
    getAll as getAllTodoQuery
};

