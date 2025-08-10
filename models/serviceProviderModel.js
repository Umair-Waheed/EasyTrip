import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const serviceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["hotel", "transport", "guide"],
      // required: true
    },

    location: {
      type: String,
      // required: true
    },
    country: {
      type: String,
      required: true,
      default: "Pakistan",
    },
    contactNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    image: {
      url: String,
      filename: String,
    },
    facebookLink: {
      type: String,
      unique: true,
    },
    instagramLink: {
      type: String,
      unique: true,
    },
    twitterLink: {
      type: String,
      unique: true,
    },
    linkedinLink: {
      type: String,
      unique: true,
    },
    isSetupComplete: {
      type: Boolean,
      default: false,
    },
    totalEarning: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//hash the password
serviceProviderSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const saltPass = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltPass);
    next();
  } catch (error) {
    next(error);
  }
});
serviceProviderSchema.methods.comparePassword = async function (
  enteredPassword
) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const serviceProviderModel =
  mongoose.model.providers ||
  mongoose.model("providers", serviceProviderSchema);
export default serviceProviderModel;
