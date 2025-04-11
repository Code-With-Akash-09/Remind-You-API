import { checkUserHelper, getUserHelper } from "../../../helper/v1/auth/auth.js"

const signUp = async (req, res) => {
    let body = req.body
    checkUserHelper(body)
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
                message: "Error in creating user",
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

const logIn = async (req, res) => {
    let body = req.body
    getUserHelper(body)
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
                message: "Error in login",
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

export { logIn, signUp }

