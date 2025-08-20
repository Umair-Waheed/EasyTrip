import adminModel from "../models/adminModel.js";
import userModel from "../models/userModel.js";
import serviceProviderModel from "../models/serviceProviderModel.js";
import bookingModel from "../models/bookingModel.js";
import reviewModel from "../models/reviewsModel.js";
import hotelListings from "../models/hotelServiceListingsModel.js";
import transportListings from "../models/transportServiceListingsModel.js";
import guideListings from "../models/guideServiceListingsModel.js";
import paymentModel from "../models/paymentModel.js";
import { generateToken } from "../utils/generateToken.js";
import notificationModel from "../models/notificationModel.js";

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await adminModel.findOne({ email });
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please enter email or password!",
      });
    }
    if (!admin) {
      return res.json({ success: false, message: "Wrong Credentials!" });
    }

    //check password
    const isPassword = await admin.comparePassword(password);
    if (!isPassword) {
      return res.json({ success: false, message: "Wrong Credentials" });
    }

    //generate token
    const token = generateToken(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      "3h"
    );

    return res.json({
      success: true,
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Login error" });
  }
};

const getAdminData = async (req, res) => {
  try {
    const isAdmin = await adminModel.findOne({});
    if (isAdmin) {
      res.json({ success: false, message: "Admin not found!" });
    }
    res.json({ success: true, message: isAdmin });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Admin not found!" });
  }
};

const adminSignOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Admin Logout" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

const getUsersList = async (req, res) => {
  try {
    const users = await userModel.find({});
    if (!users.length) {
      return res.json({ success: false, message: "No Users found" });
    }
    return res.json({ success: true, message: { users } });
  } catch (error) {
    res.json({ success: false, message: "Fetching Users Error", error });
  }
};

const getuserDetail = async (req, res) => {
  const userId = req.params;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const bookings = await bookingModel
      .find({ userId })
      .populate("serviceId", "name location price");
    const reviews = await reviewModel
      .findById({ userId })
      .populate("serviceId", "name location");
    const payments = await paymentModel.findById({ userId });

    res.json({
      success: true,
      message: {
        user: {
          name: user.name,
          email: user.email,
          location: user.location,
          contactNumber: user.contactNumber,
          createdAt: user.createdAt,
        },
        bookings,
        reviews,
        payments,
      },
    });
  } catch (error) {
    res.json({ success: false, message: "User details fetching error", error });
  }
};

const deleteUser = async (req, res) => {
  let userId = req.params;
  try {
    const user = await userModel.findById({ userId });
    if (!user) {
      res.json({ success: false, message: "User not found" });
    }
    //delete user
    await bookingModel.deleteMany({ userId });
    await reviewModel.deleteMany({ userId });

    await user.deleteOne();
    res.json({ success: true, message: "User successfully deleted" });
  } catch (error) {
    res.json({ success: false, message: "Failed to delete" });
  }
};

const getServiceProvider = async (req, res) => {
  try {
    const providers = await serviceProviderModel.find({});
    // console.log(providers);

    if (!providers.length) {
      res.json({ success: false, message: "No serviceprovider found" });
return }
    res.json({ success: true, providers });
  } catch (error) {
    res.json({
      success: false,
      message: "Serviceprovider fetching error",
      error,
    });
  }
};

const updateProviderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    console.log("Status:", status);
    console.log("Provider ID:", id);

    const provider = await serviceProviderModel.findById(id);
    console.log("Provider found:", provider);

    if (!provider) {
      return res.json({ success: false, message: "Provider not found!" });
    }

    provider.status = status;

    if (status === "approved") {
      provider.isSetupComplete = true;

      await notificationModel.create({
        userId: id,
        userRole: "providers",
        message: `Your account has been approved! You can now access your dashboard.`,
      });

    } else if (status === "rejected") {
      provider.isSetupComplete = false;
    }

    await provider.save();

    return res.json({
      success: true,
      message: `Provider status updated to ${status}`,
    });

  } catch (error) {
    console.error("Error updating provider status:", error);
    return res.json({
      success: false,
      message: "Error updating status",
      error,
    });
  }
};


export {
  adminLogin,
  getAdminData,
  adminSignOut,
  getUsersList,
  getuserDetail,
  deleteUser,
  getServiceProvider,
  updateProviderStatus
};
