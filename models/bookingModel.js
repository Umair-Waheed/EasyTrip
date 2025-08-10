import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "providers",
    required: true,
  },
  serviceType: {
    type: String,
    enum: ["hotel", "transport", "guide"],
    required: true,
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },

  providerContactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },

  pricingType: {
    type: String,
    enum: ["per_day", "per_hour"],
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },

  totalHours: {
    type: Number,
  },

  totalDays: {
    type: Number,
  },

  basePrice: {
    type: Number,
    required: true,
  },

  discountPercentage: {
    type: Number,
    default: 0,
  },

  totalPrice: {
    type: Number,
    required: true,
  },

  additionalDetails: {
    type: String,
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },

  paymentDetails: {
    id: { type: String }, // for transaction ID
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    amount: { type: Number },
    method: { type: String }, // like  "stripe" or other method
    paidAt: { type: Date }, // payment time
    currency: { type: String, default: "PK" },
    receiptEmail: { type: String }, // if email used in the payment optional!
    notes: { type: String },
  },

  listing: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    refPath: "listingModel",
  },

  listingModel: {
    type: String,
    // required: true,
    enum: ["hotelListing", "transportListing", "guideListing"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.index({ user: 1, listingId: 1, startDate: 1, endDate: 1 });

const bookingModel = mongoose.model("booking", bookingSchema);

export default bookingModel;
