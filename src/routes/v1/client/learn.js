import { Router } from "express"
import multer from "multer"
import {
	create,
	deleteLearnById,
	getAllPrivate,
	getAllPublic,
	getLearnById,
	update,
	uploadAssets,
} from "../../../controllers/v1/client/learn.js"
import { checkAuth } from "../../../middlewares/checkAuth.js"

const upload = multer({
	storage: multer.diskStorage({}),
	fileFilter: (req, file, cb) => {
		const allowedMimeTypes = [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/jpg",
			"video/mp4",
			"video/webm",
		]
		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true)
		} else {
			cb(new Error("Only image and video files are allowed"), false)
		}
	},
})

const learnRouter = Router()

learnRouter.post("/create", checkAuth, create)
learnRouter.get("/getAll/private", checkAuth, getAllPrivate)
learnRouter.get("/getAll/public", getAllPublic)
learnRouter.get("/getAll/:learnId", getLearnById)
learnRouter.put("/update/:learnId", checkAuth, update)
learnRouter.delete("/delete/:learnId", checkAuth, deleteLearnById)
learnRouter.post(
	"/upload/file",
	checkAuth,
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "video", maxCount: 1 },
	]),
	uploadAssets
)

export default learnRouter
