import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transportListingSchema = new Schema({
  providerId: {
    type: Schema.Types.ObjectId,
    ref: "providers",
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ["Sedan", "SUV", "Van", "Bus", "Jeep"],
    required: true,
  },
  vehicleDetail: {
    name: { type: String, required: true },
    model: { type: String, required: true },
    capacity: { type: Number, required: true },
    fuelType: { type: String, default: "Petrol" },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      default: "Manual",
    },
  },
  vehicleImage: {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "Pakistan",
  },

  fuelIncluded: {
    type: Boolean,
    default: true,
    required: true,
  },
  pricing: {
    perHour: { type: Number, default: 0 },
    perDay: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    pricingUnit: { type: String, enum: ["perHour", "perDay"], required: true },
  },

  availability: {
    status: { type: Boolean, default: true },
    availableFrom: { type: String, default: "08:00 AM" },
    availableTo: { type: String, default: "08:00 PM" },
  },

  features: {
    type: [String], // e.g., ["AC", "Driver Included", "Luggage Rack"]
    default: [],
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

const transportListingModel =
  mongoose.model.transportListing ||
  mongoose.model("transportListing", transportListingSchema);
export default transportListingModel;
