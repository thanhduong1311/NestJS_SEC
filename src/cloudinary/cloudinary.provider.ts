// cloudinary.provider.ts

import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: String(process.env.CLOUDINARY_NAME),
      api_key: String(process.env.CLOUDINARY_API_KEY),
      api_secret: String(process.env.CLOUDINARY_API_SECRET)
    });
  }
};
