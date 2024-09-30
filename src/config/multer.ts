import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
});

export const multerUpload = multer({ storage });
