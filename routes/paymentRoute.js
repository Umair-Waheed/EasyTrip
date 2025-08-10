import express from "express";
import { createPayment,getProviderPayments,getUserPayments,getAllPayments,releasePayment } from "../controllers/paymentController.js"
import {verifyToken,isAdmin, verifyProvider} from "../middlewares/authMiddleware.js"

const paymentRouter = express.Router();
paymentRouter.post('/create', verifyToken, createPayment);
paymentRouter.get('/provider/:providerId', verifyToken,verifyProvider, getProviderPayments);
paymentRouter.get('/user/:userId', verifyToken, getUserPayments);
paymentRouter.get('/paymentdetails', verifyToken, isAdmin, getAllPayments);
paymentRouter.put('/release/:paymentId', verifyToken,isAdmin, releasePayment);

export default paymentRouter;