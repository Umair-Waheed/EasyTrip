import reviewModel from "../models/reviewsModel.js";
import destinationModel from "../models/destinationListings.js"
import hotelModel from "../models/hotelServiceListingsModel.js"
import transportModel from "../models/transportServiceListingsModel.js"
import guideModel from "../models/guideServiceListingsModel.js"
const createReview=async(req,res)=>{

   try {
    const { id } = req.params;
    console.log("listing id " + id);
    const userId = req.user.id;
    console.log("user id "+ userId);

    const {rating, comment} = req.body;

    if (!rating || !comment) {
        return res.json({ success: false, message: "Rating and comment are required!" });
      }
    
    let listing=await destinationModel.findById(id) || await hotelModel.findById(id) || await transportModel.findById(id) || await guideModel.findById(id) ;
    
    if(!listing){
        return res.json({ success: false, message: "Listing not found!" });
    }

    const newReview = new reviewModel({
        rating,
        review:comment,
        author: userId,
    });
    console.log(newReview);
    await newReview.save();
    listing.reviewOwner=userId;
    listing.review.push(newReview);
    console.log(listing);

    await listing.save();

    return res.json({ success: true, message: "Review added successfully!",review:newReview });
    // res.redirect(`/destination/${id}`);  
    
   } catch (error) {
   return res.json({ success: false, message: "Server error, review not add!" });
    // res.redirect(`/destination/${id}`);  
   }   
}

const getReviews = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const listing =await destinationModel.findById(id).populate({path:"review",populate:{path:"author",select: "name"}})
       || await hotelModel.findById(id).populate({path:"review",populate:{path:"author",select: "name"}})
       || await transportModel.findById(id).populate({path:"review",populate:{path:"author",select: "name"}})
       || await guideModel.findById(id).populate({path:"review",populate:{path:"author",select: "name"}});
        console.log(listing)
        if (!listing) {
            return res.json({ success: false, message: "listing not found!" });
          }
      
          if (!listing.review || listing.review.length === 0) {
            return res.json({ success: false, message: "No reviews found for this listing!" });
          }
          console.log("review call");
       

       return res.json({ success: true, reviews:listing.review });
    } catch (error) {
        console.error(error);
       return res.json({ success: false, message: "Internal server error!" });
    }
};
const destroyReview = async (req, res) => {
  try {
    const { id: userId } = req.user; // Get user ID from token (using verifyToken middleware)
    const { id: reviewId } = req.params;

    console.log("User ID from token:", userId);
    console.log("Review ID from params:", reviewId);

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.json({ success: false, message: "Review not found!" });
    }

    // Check if the logged-in user is the author
    if (!review.author.equals(userId)) {
      return res.json({ success: false, message: "You are not the author of this review." });
    }

    await reviewModel.findByIdAndDelete(reviewId);

    return res.json({ success: true, message: "Review deleted successfully!" });

  } catch (error) {
    console.error("Delete review error:", error.message);
    return res.json({ success: false, message: "Server error. Review not deleted." });
  }
};

export{ createReview,getReviews,destroyReview};