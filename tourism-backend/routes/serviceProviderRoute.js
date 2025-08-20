import serviceProviderModel from "../models/serviceProviderModel.js"
import express from "express"
import multer from "multer"
import {storage} from "../utils/cloudinary.js"
import { providerImageUpload } from "../middlewares/cloudinaryImgUpload.js"
const upload =multer({storage})
import {serviceProviderRegister,verifyEmail,serviceProviderLogin,serviceProviderSignout,forgotPassword,resetPassword,getServiceProviderData,completeSetup,addUpdateProviderInfo,deleteProvider} from "../controllers/serviceProviderController.js"
import{verifyToken,verifyProvider} from "../middlewares/authMiddleware.js";
const providerRouter=express.Router();
providerRouter.post("/register",serviceProviderRegister);
providerRouter.get("/verify-email/:token",verifyEmail);

// providerRouter.get("/verify-email/:token", async (req, res) => {
//   const { token } = req.query;
//   try {
//     const { id } = jwt.verify(token, process.env.JWT_SECRET);
//     const provider = await serviceProviderModel.findById(id);
//     if (!provider) throw new Error("Invalid link");
//     if (provider.verified) return res.send("Already verified");
//     provider.verified = true;
//     await provider.save();
//     res.send("Email verified! You may now log in.");
//   } catch (err) {
//     res.status(400).send("Verification failed: " + err.message);
//   }
// }
//   );
  
providerRouter.post("/login",serviceProviderLogin);
providerRouter.post("/signout",verifyToken,serviceProviderSignout);
providerRouter.post("/forgot-password", forgotPassword);
providerRouter.post("/reset-password/:token", resetPassword);
providerRouter.get("/:id",getServiceProviderData);
// providerRouter.post("/setup", verifyToken, upload.single("image"), verifyProvider, completeSetup);
providerRouter.post(
  "/setup",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "governmentId", maxCount: 1 },
    { name: "guideCertificate", maxCount: 1 },
    { name: "driverLicense", maxCount: 1 },
    { name: "hotelLicense", maxCount: 1 },
  ]),
  providerImageUpload,
  verifyToken,
  verifyProvider,
  completeSetup
);
providerRouter.put("/profile/:id",upload.single("image"),verifyToken,verifyProvider,addUpdateProviderInfo);
providerRouter.delete("/profile",verifyToken,verifyProvider,deleteProvider);


export default providerRouter;