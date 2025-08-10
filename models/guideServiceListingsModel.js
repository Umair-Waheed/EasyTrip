import mongoose from "mongoose";
const Schema = mongoose.Schema;
const guideListingSchema = new Schema({
  providerId: {
    type: Schema.Types.ObjectId,
    ref: "providers",
    required: true,
  },
  guideName: {
    type: String,
    required: true,
  },
  expertise: [
    {
      // e.g., "mountain trekking", "city tours"
      type: [String],
      required: true,
    },
  ],

  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "Pakistan",
  },
  availability: {
    type: Boolean,
    default: true,
  },
  languages: [
    {
      type: [String],
      required: true, // e.g., "English", "Spanish"
    },
  ],
  description: {
    type: String,
    required: true,
  },
  guideImage: {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
  pricing: {
    perHour: { type: Number, default: 0 },
    perDay: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    pricingUnit: { type: String, enum: ["perHour", "perDay"], required: true },
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String,
  },
  review: [
    {
      type: Schema.Types.ObjectId, //to store obj id
      ref: "Review",
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

const guideListingModel =
  mongoose.model.guideListing ||
  mongoose.model("guideListing", guideListingSchema);
export default guideListingModel;
