import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    adminAmount: {
      type: Number,
      default: 0,
    },
    providerAmount: {
      type: Number,
      default: 0,
    },
    commissionAmount: {
      type: Number,
      default: 0, // 5% commission for admin
    },

    currency: {
      type: String,
      default: "PKR",
    },
    status: {
      type: String,
      enum: ["pending", "held", "completed", "failed", "refunded"],
      default: "pending",
    },
    transferStatus: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      required: false,
    },

    holdStatus: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const paymentModel =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default paymentModel;
