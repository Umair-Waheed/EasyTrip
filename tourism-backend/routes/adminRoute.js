import express from "express"
import {adminLogin,getAdminData,adminSignOut,getUsersList,getuserDetail,deleteUser,getServiceProvider,updateProviderStatus} from "../controllers/adminController.js"
import { verifyToken,isAdmin } from "../middlewares/authMiddleware.js";
const adminRouter=express.Router();

adminRouter.post("/login",adminLogin);
adminRouter.get("/admindata",verifyToken,isAdmin,getAdminData);
adminRouter.post("/signout",verifyToken,isAdmin,adminSignOut);

adminRouter.get("/users",verifyToken,isAdmin,getUsersList);
adminRouter.get("/users/:userId/details",verifyToken,isAdmin,getuserDetail);
// adminRouter.get('/:userId/bookings', verifyAdmin, getUserBookingHistory);
adminRouter.delete("/users/:userId",verifyToken,isAdmin,deleteUser);

adminRouter.get("/serviceproviders",verifyToken,isAdmin,getServiceProvider);
adminRouter.put("/serviceproviders/:id",verifyToken,isAdmin,updateProviderStatus);
// adminRouter.get("/service-providers/:providerId/details",getServiceProviderDetail);
// adminRouter.get("/service-providers/:providerId",deleteServiceProvider);

// adminRouter.get("/bookings",getAllBookings); //all Booking details (dates, status, user info, provider info).
// adminRouter.get("/bookings/current",currentBookings); //current Booking details (dates, status, user info, provider info).
// adminRouter.get("/bookings/history",pastBookings);//past Booking details, user data, and provider data

// adminRouter.get("/notifications",notifications); // List of notifications with timestamps and categories (e.g., booking-related, platform updates).

// adminRouter.get("/reviews",review);
// adminRouter.get("/reviews/:reviewId",deleteReview);


export default adminRouter;