import mongoose from "mongoose";
const Schema = mongoose.Schema;

const destListingSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "Pakistan",
  },

  images: {
    type: [String],
    default: [],
  },
  category: {
    type: [String],
    enum: [
      "Mountain",
      "Nature",
      "Adventure",
      "Waterspot",
      "Camping",
      "Hiking",
      "Beach",
      "Historical",
      "Religious",
      "Urban",
      "Cultural",
    ],
    required: true,
  },
  safetyLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  priceRange: {
    type: String,
    enum: ["Budget", "Mid-Range", "Luxury"],
    required: true,
  },
  bestVisitedIn: {
    type: [String],
    enum: ["Winter", "Spring", "Summer", "Autumn"],
    required: true,
  },

  climate: {
    type: String,
    enum: ["Tropical", "Arid", "Temperate", "Continental", "Polar"],
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },

  review: [
    {
      type: Schema.Types.ObjectId, //to store obj id for every listing to review on that listing
      ref: "Review", //our review model is made reference here
    },
  ],
  reviewOwner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const destlistingModel =
  mongoose.model.destListing ||
  mongoose.model("destListing", destListingSchema);

export default destlistingModel;
