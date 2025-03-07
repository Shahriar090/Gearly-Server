import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

// cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// disk storage configuration

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
