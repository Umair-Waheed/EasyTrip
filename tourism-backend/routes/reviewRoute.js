import express from "express"
import {verifyToken} from "../middlewares/authMiddleware.js";
import { validateReview,isReviewAuthor } from "../middlewares/reviewMiddleware.js";
import { createReview,getReviews,destroyReview } from "../controllers/reviewController.js";

const reviewRouter=express.Router();

reviewRouter.get("/listing/:id", getReviews);
reviewRouter.post("/:id",verifyToken,createReview);
reviewRouter.delete("/:id",verifyToken,destroyReview);

export default reviewRouter;