import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: {
        folder: "easytrip",
        allowerdFormats: ['png','jpg','jpeg'],
        resource_type: 'auto',
    public_id: (req, file) => {
      const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return file.originalname.split('.')[0] + '-' + uniqueId;
    }
    },
});




export {cloudinary,storage}