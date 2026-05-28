import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY_PROVIDER = 'CLOUDINARY';

export const CloudinaryProvider = {
  provide: CLOUDINARY_PROVIDER,
  useFactory: () => {
    const url = process.env.CLOUDINARY_URL;

    if (!url) {
      throw new Error('CLOUDINARY_URL is not defined in .env');
    }

    cloudinary.config(url);
    return cloudinary;
  },
};