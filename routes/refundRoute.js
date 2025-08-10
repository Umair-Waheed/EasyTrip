import express from "express";
import {createRefundRequest,getUserRefunds,getAllRefunds,updateRefundStatus} from "../controllers/refundController.js";
import {verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
const refundRouter=express.Router();

refundRouter.post('/create',verifyToken, createRefundRequest);

refundRouter.get('/user/:userId',verifyToken, getUserRefunds);

refundRouter.get('/admin/all',verifyToken,isAdmin, getAllRefunds);

refundRouter.put('/admin/update/:id',verifyToken,isAdmin,updateRefundStatus);

export default refundRouter;