import express from 'express';
import { sendReport, replyToReport,userReports, getAllReports } from '../controllers/reportController.js';
import{verifyToken,isAdmin} from "../middlewares/authMiddleware.js"

const reportRouter = express.Router();

reportRouter.post("/send", verifyToken, sendReport);
reportRouter.get("/admin", verifyToken, isAdmin, getAllReports);
reportRouter.get("/user/:userId", verifyToken, userReports);
reportRouter.put("/reply/:reportId", verifyToken, isAdmin, replyToReport);

export default reportRouter;
