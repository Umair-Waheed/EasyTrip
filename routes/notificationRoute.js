import express from "express"
import { getNotification,unreadNotification,readNotification } from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const notificationRouter=express.Router();

notificationRouter.get("/user",verifyToken,getNotification);
notificationRouter.put("/mark-as-read",verifyToken,readNotification);
notificationRouter.get("/unread-notify",verifyToken,unreadNotification);

export default notificationRouter;