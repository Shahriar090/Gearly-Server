import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';

// cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// Disk storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the upload path based on environment
    const uploadPath = path.join(process.cwd(), 'src/uploads');

    // Ensure that the directory exists, create it if not
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Set the destination folder dynamically
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix); // Set the filename
  },
});

// Cloudinary upload function
export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  try {
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });

    // Delete local file after upload
    await fs.promises.unlink(path);
    console.log('Upload Successful And Local File Deleted', uploadResult);
    return uploadResult;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Upload Failed', error);
    return { success: false, message: 'Upload Failed', error: error.message };
  }
};

// Function to handle multiple image uploads to Cloudinary
export const uploadImagesToCloudinary = async (
  images: Express.Multer.File[],
): Promise<string[]> => {
  const uploadResults: string[] = [];
  for (const image of images) {
    const uploadResult = await sendImageToCloudinary(
      image.originalname,
      image.path,
    );
    if (uploadResult && uploadResult.secure_url) {
      uploadResults.push(uploadResult.secure_url as string);
    } else {
      throw new Error('Failed to upload image to Cloudinary');
    }
  }
  return uploadResults;
};

// Handle image upload logic for both single and multiple images
export const handleImageUpload = async (req: Request) => {
  let images: Express.Multer.File[] = [];

  // Check if req.files exists
  if (!req.files) {
    return { success: false, message: 'No Images Uploaded' };
  }

  if (Array.isArray(req.files)) {
    images = req.files; // If it's an array, assign directly
  } else {
    // If it's an object, get the values (i.e., the array of files from the field)
    const fieldNames = Object.keys(req.files);
    if (fieldNames.length > 0) {
      images = req.files[fieldNames[0]] as Express.Multer.File[];
    }
  }

  if (images.length === 0) {
    return { success: false, message: 'No Images Uploaded' };
  }

  // Handle image upload (single or multiple)
  const uploadResults: string[] = [];
  for (const image of images) {
    const uploadResult = await sendImageToCloudinary(
      image.originalname,
      image.path,
    );

    if (uploadResult && uploadResult.secure_url) {
      uploadResults.push(uploadResult.secure_url as string);
    } else {
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  return uploadResults;
};

// Multer configuration to handle both single and multiple uploads
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(null, false); // Reject files that are not images
    }
    cb(null, true); // Accept image files
  },
});
