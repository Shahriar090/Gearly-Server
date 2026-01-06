import { v2 as cloudinary } from 'cloudinary';
import type { Request } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import config from '../config';

// cloudinary configuration
cloudinary.config({
	cloud_name: config.cloudinary_cloud_name,
	api_key: config.cloudinary_api_key,
	api_secret: config.cloudinary_api_secret,
});

// Disk storage configuration for multer
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		// Define the upload path based on environment
		const uploadPath = path.join(process.cwd(), 'src/uploads');

		// Ensure that the directory exists, create it if not
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}

		cb(null, uploadPath); // Set the destination folder dynamically
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix); // Set the filename
	},
});

// Cloudinary upload function
export const sendImageToCloudinary = async (imageName: string, path: string): Promise<Record<string, unknown>> => {
	try {
		const uploadResult = await cloudinary.uploader.upload(path, {
			public_id: imageName,
		});

		// Delete local file after upload
		await fs.promises.unlink(path);
		console.log('Upload Successful And Local File Deleted', uploadResult);
		return uploadResult;
	} catch (error: unknown) {
		console.error('Upload Failed', error);
		const errorMessage = error instanceof Error ? error.message : 'An Unknown Error Occured';
		return { success: false, message: 'Upload Failed', error: errorMessage };
	}
};

// Handle image upload logic for both single and multiple images

export const handleImageUpload = async (req: Request) => {
	if (!req.file && !req.files) {
		return null; // No file uploaded
	}

	let images: Express.Multer.File[] = [];

	if (req.file) {
		images = [req.file]; // Single file
	} else if (Array.isArray(req.files)) {
		images = req.files; // Multiple files
	}

	if (images.length === 0) {
		return null;
	}

	// Upload to Cloudinary
	const uploadResults = [];
	for (const image of images) {
		const uploadResult = await sendImageToCloudinary(image.originalname, image.path);
		if (uploadResult?.secure_url) {
			uploadResults.push(uploadResult.secure_url);
		} else {
			return null;
		}
	}

	return images.length === 1 ? uploadResults[0] : uploadResults;
};

// Multer configuration to handle both single and multiple uploads
export const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
	fileFilter: (_req, file, cb) => {
		if (!file.mimetype.startsWith('image/')) {
			return cb(null, false); // Reject files that are not images
		}
		cb(null, true); // Accept image files
	},
});
