import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';
import { Request } from 'express';

// cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// disk storage configuration
// multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/src/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  try {
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });

    // delete local file after upload
    await fs.promises.unlink(path);
    console.log('Upload Successful And Local File Deleted', uploadResult);
    return uploadResult;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Upload Failed', error);
    return { success: false, message: 'Upload Failed', error: error.message };
  }
};

// function to upload multiple images
export const uploadImagesToCloudinary = async (
  images: Express.Multer.File[],
): Promise<string[]> => {
  const uploadResults: string[] = [];
  for (const image of images) {
    const uploadResult = await sendImageToCloudinary(
      image.originalname,
      image.path,
    );
    uploadResults.push(uploadResult.secure_url as string);
  }
  return uploadResults;
};

// single or multiple upload logic
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

// multer configuration to handle both single and multiple uploads
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(null, false);
    }
    cb(null, true);
  },
});

// memory storage
// Function to send image to Cloudinary

// Function to send image to Cloudinary
// export const sendImageToCloudinary = async (
//   imageName: string,
//   buffer: Buffer,
// ): Promise<Record<string, unknown> | undefined> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           public_id: imageName,
//           resource_type: 'auto',
//         },
//         (error, result) => {
//           if (error) {
//             console.error('Upload Failed', error);
//             reject({
//               success: false,
//               message: 'Upload Failed',
//               error: error.message,
//             });
//           } else {
//             if (result) {
//               console.log('Upload Successful', result);
//               resolve(result);
//             } else {
//               console.error('Upload failed, no result returned');
//               resolve(undefined);
//             }
//           }
//         },
//       )
//       .end(buffer);
//   });
// };

// // Use multer's memory storage to store files in memory
// const storage = multer.memoryStorage(); // Use memory storage instead of diskStorage

// export const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith('image/')) {
//       return cb(null, false);
//     }
//     cb(null, true);
//   },
// });
