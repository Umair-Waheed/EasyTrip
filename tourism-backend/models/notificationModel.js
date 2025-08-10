// models/Notification.js
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    refPath: "userRole", // or your User model name
    required: true,
  },
  userRole: {
    type: String,
    enum: ["user", "admin", "providers"], // support multiple roles
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notification", notificationSchema);
