import express from "express"
import {verifyToken} from "../middlewares/authMiddleware.js";
import {userRegister,verifyEmail,userLogin,userSignout,getUserData,addUpdateUserInfo,deleteUser} from "../controllers/userController.js"
const userRouter=express.Router();

userRouter.post("/register",userRegister);
userRouter.get("/verify-email/:token",verifyEmail);
userRouter.post("/login",userLogin);
userRouter.post("/signout",verifyToken,userSignout);
userRouter.get("/:id",verifyToken,getUserData);
userRouter.put("/profile",verifyToken,addUpdateUserInfo);
userRouter.delete("/profile",verifyToken,deleteUser);


export default userRouter;