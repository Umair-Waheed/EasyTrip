import mongoose from "mongoose";

const Schema = mongoose.Schema;
const hotelListingSchema = new Schema({
  providerId: {
    type: Schema.Types.ObjectId,
    ref: "providers", // Reference to the specific service provider
    required: true,
  },
  hotelName: {
    type: String,
    required: true,
  },
  hotelCategory: {
    type: String,
    enum: ["Budget", "3-Star", "4-Star", "5-Star", "Luxury", "Boutique"],
    required: true,
  },
  roomDetails: [
    {
      roomImage: {
        type: [String],
        default: [],
      },
      bedType: {
        type: String,
        enum: ["Single", "Double", "Queen", "King"],
        required: true,
      },
      roomAmenities: [
        {
          type: String,
          enum: [
            "TV",
            "Free WiFi",
            "Air Conditioning",
            "Room Service",
            "Safe",
            "Balcony",
            "Coffee Machine",
          ],
        },
      ],

      availability: { type: Boolean, default: true },
    },
  ],

  securityFeatures: [
    {
      type: String,
      enum: ["24/7 Security", "CCTV", "Safe Deposit Box", "Fire Alarm"],
    },
  ],

  breakfastIncluded: { type: Boolean, default: false },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "Pakistan",
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String,
  },
  pricing: {
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, default: 0 },
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

const hotelListingModel =
  mongoose.model.hotelListing ||
  mongoose.model("hotelListing", hotelListingSchema);
export default hotelListingModel;
