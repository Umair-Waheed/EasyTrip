import destListing from "../models/destinationListings.js";
import review from "../models/reviewsModel.js";

const validateReview =async (req, res, next) => {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }

    if (!review || review.length < 5) {
        return res.json({ success: false, message: "Review must be at least 5 characters long." });
    }

    next(); // Proceed if validation passes
};

const isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await review.findById(reviewId);
    console.log("this is check " + review)
    if(!review.author.equals(res.locals.currUser._id)){
        res.json({success:false,message:"error, You are not the author of this review"});
        return res.redirect(`/destination/${id}`);
    }
    next();

}  
export {validateReview,isReviewAuthor}
