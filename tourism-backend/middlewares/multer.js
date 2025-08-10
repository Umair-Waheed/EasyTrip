import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "easytrip", 
    allowed_formats: ["jpg", "png", "jpeg"],
    resource_type: "image",
  },
});
const upload=multer({dest:'uploads/'})
// const upload = multer({ storage });

export {upload}