import { getSearchHelper, getTaskStateHelper } from "../../../helper/v1/client/dashboard.js"

const getTaskState = async (req, res) => {
    let uid = req.user.id
    let statusId = req.params.statusId
    let page = req.query.page || 1
    let limit = req.query.limit || 10

    getTaskStateHelper(uid, statusId, page, limit)
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
                message: "Error in getting today's tasks",
                error: err.error || true,
                code: err.code || 500,
                results: {
                    data: {
                        error: err.message,
                    },
                },
            })
        })
}

const search = async (req, res) => {
    let uid = req.user.id
    let query = req.query.query

    getSearchHelper(uid, query)
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
                message: "Error in searching todo",
                error: err.error || true,
                code: err.code || 500,
                results: {
                    data: {
                        error: err.message,
                    },
                },
            })
        })
}

export {
    getTaskState,
    search
}
