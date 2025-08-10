import mongoose from "mongoose";
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  review: String,
  rating: {
    type: String,
    min: 1,
    max: 5,
  },
  sentiment: {
    type: String,
    enum: ["positive", "neutral", "negative"],
    default: "neutral",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
