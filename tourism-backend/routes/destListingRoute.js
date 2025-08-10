import express from "express"
import multer from "multer"
import {cloudinary, storage} from "../utils/cloudinary.js"
const upload =multer({storage})
import { getDestListings,addDestListing,getListingDetail,editDestListing,deleteDestListing } from "../controllers/destListingController.js";
import { verifyToken,isAdmin } from "../middlewares/authMiddleware.js";
const destRouter=express.Router();

destRouter.get("/destinations",getDestListings)
destRouter.get("/destinations/:id",getListingDetail)
destRouter.post("/destinations",verifyToken,upload.array('images', 5), // Use array() instead of any()
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
        folder: 'destinations',
        public_id: `dest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
},isAdmin,addDestListing)
destRouter.put("/destinations/:id",verifyToken,isAdmin,editDestListing)
destRouter.delete("/destinations/:id",verifyToken,isAdmin,deleteDestListing)



export default destRouter;