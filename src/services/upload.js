import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { v2 as cloudinary } from "cloudinary"
import "dotenv/config"

const REGION = process.env.AWS_REGION
const s3Client = new S3Client({ region: REGION })

const upload = async (bucketName, path, fileName, file) => {
	return new Promise(async (resolve, reject) => {
		try {
			const params = {
				Bucket: bucketName,
				Key: `${path}${fileName}`,
				Body: file,
			}
			const results = await s3Client.send(new PutObjectCommand(params))
			resolve(results)
		} catch (err) {
			reject(err)
		}
	})
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadFile = async (filePath, isVideo = false) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await cloudinary.uploader.upload(filePath, {
				resource_type: isVideo ? "video" : "image",
				folder: isVideo ? "Remindyou/videos" : "Remindyou/images",
			})

			if (!result) {
				return reject({
					code: 400,
					error: true,
					message: "Failed to upload file",
				})
			}

			const url = isVideo
				? result.secure_url
				: cloudinary.url(result.public_id, {
						resource_type: "image",
						transformation: [
							{ quality: "auto", fetch_format: "auto" },
							{ width: 1200, crop: "thumb", gravity: "auto" },
						],
				  })

			let resp = {
				code: 200,
				error: false,
				message: "File uploaded successfully",
				data: url,
			}
			resolve(resp)
		} catch (err) {
			let resp = {
				code: 500,
				error: true,
				message: err.message,
			}
			reject(resp)
		}
	})
}

export { upload, uploadFile as uploadFileCloudinary }
