import express from "express"
import multer from "multer"
import {cloudinary, storage} from "../utils/cloudinary.js"
const upload =multer({storage})
import { addListing,updateListing,deleteListing,getAllListings,getListingDetail } from "../controllers/hotelController.js"
import { verifyProvider,verifyToken } from "../middlewares/authMiddleware.js";
import { hotelImage } from "../middlewares/cloudinaryImgUpload.js"

const hotelRouter = express.Router();

hotelRouter.post("/listings",verifyToken,upload.array('roomImage', 5), // Use array() instead of any()
async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No images provided" 
      });
    }

    // Verify files are properly uploaded
    console.log('Uploaded files:', req.files.map(f => ({
      originalname: f.originalname,
      path: f.path,
      size: f.size
    })));

    // Upload to Cloudinary
    const uploadPromises = req.files.map(file => 
      cloudinary.uploader.upload(file.path, {
        folder: 'hotel',
        public_id: `hotel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        resource_type: 'auto'
      })
    );

    const results = await Promise.allSettled(uploadPromises);
    const successfulUploads = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value.secure_url);

    if (successfulUploads.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All image uploads failed"
      });
    }

    req.uploadedImages = successfulUploads;
    next();
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Image upload failed",
      error: error.message
    });
  }
}, verifyProvider,addListing);
hotelRouter.put("/listings/:id",verifyToken,upload.array('roomImage', 5),hotelImage,verifyProvider, updateListing);
hotelRouter.delete("/listings/:id",verifyToken,verifyProvider, deleteListing);
hotelRouter.get("/listings",verifyToken,verifyProvider, getAllListings);
hotelRouter.get("/listings/:id",verifyToken,verifyProvider, getListingDetail);

export default hotelRouter;