import express from "express"
import multer from "multer"
import {storage} from "../utils/cloudinary.js"
const upload =multer({storage})
import { addListing,updateListing,deleteListing,getAllListings,getListingDetail } from "../controllers/transportController.js";
import{verifyProvider,verifyToken} from "../middlewares/authMiddleware.js";
import { transportImage } from "../middlewares/cloudinaryImgUpload.js";
const transportRouter = express.Router();
transportRouter.post("/listings",verifyToken, upload.array("vehicleImage",5),transportImage,verifyProvider,addListing);
transportRouter.put("/listings/:id",verifyToken,upload.array('vehicleImage', 5),transportImage,verifyProvider, updateListing);
transportRouter.delete("/listings/:id",verifyToken,verifyProvider, deleteListing);
transportRouter.get("/listings",verifyToken,verifyProvider, getAllListings);
transportRouter.get("/listings/:id",verifyToken,verifyProvider, getListingDetail);

export default transportRouter;