import express from "express"
import {isAdmin, verifyToken, verifyProvider} from "../middlewares/authMiddleware.js"
import {createbooking,cancelBooking,updateBookingStatus,getAllBookings,getSpecificBooking,getUserBookings,getProviderBookings,createCheckoutSession,updateBookingPayment,deleteBooking} from "../controllers/bookingController.js"

const bookingRouter=express.Router();

bookingRouter.post("/bookings/:listingId",verifyToken ,createbooking ); // add booking
bookingRouter.put("/bookings/:id/status",verifyToken,verifyProvider,updateBookingStatus ); // add booking
bookingRouter.put("/bookings/:id/cancel",verifyToken,cancelBooking ); // add booking
bookingRouter.get("/bookings",verifyToken,isAdmin,getAllBookings); //get all booking for admin
bookingRouter.get("/bookings/:bookingId",verifyToken, getSpecificBooking); // get specific booking
bookingRouter.get("/bookings/user/:id",verifyToken, getUserBookings); // for getting all booking for specific user
bookingRouter.get("/bookings/serviceprovider/:id",verifyToken,verifyProvider, getProviderBookings); // for getting all booking for specific provider
bookingRouter.post("/bookings/create-checkout-session/:id", verifyToken, createCheckoutSession);
bookingRouter.put("/bookings/:id/payment", verifyToken,updateBookingPayment); //update payment details for specific booking
bookingRouter.delete("/bookings/:bookingId",verifyToken,verifyProvider, deleteBooking); //delete booking

export default bookingRouter;