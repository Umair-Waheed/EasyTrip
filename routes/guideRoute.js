import express from "express"
import multer from "multer"
import {storage} from "../utils/cloudinary.js"
const upload =multer({storage})
import { addListing,updateListing,deleteListing,getAllListings,getListingDetail } from "../controllers/guideController.js"
import { verifyToken,verifyProvider } from "../middlewares/authMiddleware.js";
import { guideImage } from "../middlewares/cloudinaryImgUpload.js";

const guideRouter = express.Router();

guideRouter.post("/listings",verifyToken,upload.array("guideImage",5),guideImage,verifyProvider,addListing);
guideRouter.put("/listings/:id",verifyToken,upload.array("guideImage",5),guideImage,verifyProvider, updateListing);
guideRouter.delete("/listings/:id",verifyToken,verifyProvider, deleteListing);
guideRouter.get("/listings", verifyToken,verifyProvider,getAllListings);
guideRouter.get("/listings/:id",verifyToken,verifyProvider, getListingDetail);

export default guideRouter;