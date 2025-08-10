import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userRole",
    },
    userRole: {
      type: String,
      required: true,
      enum: ["user", "providers"],
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    adminResponse: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "replied", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
