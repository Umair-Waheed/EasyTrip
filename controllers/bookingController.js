import bookingModel from "../models/bookingModel.js";
import hotelModel from "../models/hotelServiceListingsModel.js";                  
import transportModel from "../models/transportServiceListingsModel.js";                  
import guideModel from "../models/guideServiceListingsModel.js"; 
import notificationModel from "../models/notificationModel.js";
import {getAdminId} from "../utils/getAdminId.js"
const createbooking=async(req,res)=>{
try{
    const {fullName, email, contactNumber, arrivalDate, departureDate,pricingType,hours,
        serviceType,additionalDetails = ""}=req.body;
    const {listingId} = req.params;
    // console.log("arrivaldate"+typeof(arrivalDate)+"deoarture datee" +typeof(departureDate) );
    // console.log("hours type is"+typeof(hours));

    if (Number(hours) > 8) {
      // console.log("hours is"+ hours)
      return res.json({
        success: false,
        message: "Hourly bookings cannot be more than 8 hours!"
      });
    }

    let startDate = new Date(arrivalDate);
    let endDate = new Date(departureDate);
   
    // console.log('Start Date:', typeof(startDate), 'End Date:', typeof(endDate));

    if (startDate >= endDate) {
        return res.json({ success: false, message: "Invalid or incorrect date" });
    }

      if(pricingType === "per_hour"){
        let totalDay = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        // console.log("total days is "+totalDay);
        if (totalDay>1) {
          return res.json({ success: false, message: "Invalid or incorrect date:Please select one Day for Hourly Booking!" });
        }
      }
      
    let serviceListingModel;
        switch (serviceType) {
            case 'hotel':
                serviceListingModel = hotelModel;
                break;
            case 'transport':
                serviceListingModel = transportModel;
                break;
            case 'guide':
                serviceListingModel = guideModel;
                break;
            default:
                return res.json({ success: false, message: 'Invalid service type' });
        }

        // Fetch the listing to get the serviceProviderId
        const listing = await serviceListingModel.findById(listingId);
        if(!listing) {
            return res.json({ success: false, message: 'service not found' });
        }
        // console.log("listinf contact info is"+listing.contactInfo);

        const serviceProviderId = listing.providerId;
        // console.log(serviceProviderId);
        let basePrice;    
        let discountPercentage ;

        if (serviceType === "hotel") {
            basePrice = listing.pricing?.originalPrice;
            // discountPercentage = listing.pricing?.discountedPrice;  
            discountPercentage = 0;  
          }
          
          // for checking Transport or Guide price
          else {
            if (pricingType === "per_day") {
              basePrice = listing.pricing?.perDay;
              discountPercentage = listing.pricing?.discountPercentage;
            } else { // per_hour
              basePrice = listing.pricing?.perHour;
              discountPercentage = listing.pricing?.discountPercentage;
            }
          }

        console.log('Listing ID:', listingId);

    const overlappingBooking=await bookingModel.findOne({
        
        listingId,
        serviceType,
        $or: [
            {
                startDate: { $lt: endDate },
                endDate: { $gt: startDate },
            },
            {
                startDate: { $lte: startDate },
                endDate: { $gte: endDate },
            },
        ],
        
});


    if(overlappingBooking){
        // console.log('Overlapping Booking:', overlappingBooking);
        return res.json({ success: false, message: "This service is already booked for the selected dates." });
        
    }

    const userBookingExist = await bookingModel.findOne({
        user: req.user.id, // Replace with req.user.id or appropriate user identification
        listingId,
        $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        ]
    });

    if (userBookingExist) {
        return res.json({ success: false, message: "You have already booked this service on same dates." });
    }

    let totalDays = 0;
    let totalPrice = 0;

    if (pricingType === "per_day") {
      totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (serviceType === "hotel" && listing.pricing?.discountedPrice) {
        totalPrice = listing.pricing.discountedPrice * totalDays;
      } else {
        totalPrice = basePrice * totalDays;
      }
    } else if (pricingType === "per_hour") {
      totalPrice = basePrice * hours;
    }
    else {
      return res.json({ success: false, message: "Invalid pricing type." });
    }

    if (discountPercentage > 0) {
      totalPrice = totalPrice - (totalPrice * discountPercentage) / 100;
    }

    //create booking
    const newBooking=new bookingModel({
        user:req.user.id,
        serviceProvider: serviceProviderId,
        serviceType,
        listingId,
        fullName,
        email,
        contactNumber,
         providerContactInfo: {
             phone: listing.contactInfo?.phone,
              email: listing.contactInfo?.email,
                },
        pricingType,
        startDate,
        endDate,
      totalDays:pricingType === "per_day" ? totalDays : undefined,
      totalHours:pricingType === "per_hour" ? hours : undefined,
      basePrice,
      discountPercentage,
      totalPrice:Number(totalPrice),
      status:"confirmed", //update booking functionlaity by adding this 
      additionalDetails,

    });
    console.log(newBooking)
    
    //For notification
    await notificationModel.insertMany([
      {
        userId: req.user.id,
        userRole: 'user',
        message: `Booking confirmed! Please complete your payment from the dashboard.`,
      },
      {
        userId: serviceProviderId,
        userRole: "providers",
        message: `A new booking has been made for your service by user ID:${req.user.id}.`,
      },
      {
        userId: await getAdminId(), // ensure this returns admin _id
        userRole: "admin",
        message: ` new booking has been created on the platform by user ID:${req.user.id}.`,
      }
    ]); 

    await newBooking.save();
    
    res.json({ success: true, message: "Service booking successfully!", newBooking });

}catch(error){
    res.json({ success: false, message: "Create booking error",message:error.message });

}
};

//update status of pending bookings
const updateBookingStatus=async(req,res)=>{

    const {id} = req.params;
    const isBooking=await bookingModel.findById(id);
    if(!isBooking){
        return res.json({success:false,message:"Booking not found!"})
    }
    const {status}=req.body;
    console.log(status);
    if(!["confirmed", "cancelled"].includes(status)){
        return res.json({success:false,message:"Invalid status"});
    }
    if(status == "cancelled"){
      isBooking.paymentDetails.status="failed";
    }

    isBooking.status=status;
    await isBooking.save();
    return res.json({success:true,message:"Booking confirmed successfully!"});

    }

    // routes/bookings.js or wherever your booking routes are
const cancelBooking = async (req, res) => {
  try {
    const {id} = req.params;
    const booking = await bookingModel.findById(id);

    if (!booking){
      return res.json({ success: false, message: 'Booking not found' });
    }
    if (booking.status === 'cancelled') {
      return res.json({ success: false, message: 'Booking is already cancelled' });
    }
    booking.status = 'cancelled';

    await notificationModel.insertMany([
      {
        userId: booking.user,
        userRole: 'user',
        message: `Your booking ${booking._id} has been cancelled. We understand plans change — we hope to see you again soon!`
      },
      {
        userId: booking.serviceProvider,
        userRole: 'providers',
        message: `A user has cancelled their booking: ${booking._id}.`,
      },
      {
        userId: await getAdminId(), // your utility function to get admin _id
        userRole: 'admin',
        message: `Booking ${booking._id} was cancelled by the user.`,
      }
    ]);

    await booking.save();

    return res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    return res.json({ success: false, message: 'Error cancelling booking' });
  }
};


// admin Get All Bookings

const getAllBookings = async (req, res) => {
    try {
      console.log("model call");
    
        const bookings = await bookingModel.find({});
        if(bookings.length === 0){
            return res.json({ success: false, message: "No booking found" });
        }
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "Error in fetching bookings" });
    }
};

// get specific booking

const getSpecificBooking = async (req, res) => {
    try {
        const {bookingId}=req.params;
    console.log(bookingId);
        const booking = await bookingModel.findById(bookingId);
        console.log(booking);
        if(booking.length === 0){
            return res.json({ success: false, message: "No booking found" });
        }
        res.json({ success: true, booking });
    } catch (error) {
        res.json({ success: false, message: "Error in fetching booking" });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId=req.params.id;
        // console.log(userId)
    
        const bookings = await bookingModel
        .find({ user: userId })
        .populate("serviceProvider", "name")
        .populate({
          path: "listing", // assuming this refers to hotel/transport/guide listing
          select: "contactInfo", // adjust based on your model
        });
        
        if(bookings.length === 0){
            return res.json({ success: false, message: "No booking found" });
        }
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "Error in fetching bookings",message:error.message });
    }
};

// Get All Bookings for the ServiceProvider
const getProviderBookings = async (req, res) => {
    try {
         const providerId = req.params.id;
        // console.log(providerId);
        const bookings = await bookingModel.find({ serviceProvider: providerId });
        if(bookings.length === 0){
            return res.json({ success: false, message: "No booking found" });
        }
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


const createCheckoutSession = async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log(bookingId)
    const { amount } = req.body;
    console.log(amount)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "PK",
            product_data: {
              name: `Booking Payment #${bookingId}`,
            },
            unit_amount: amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/payment-success/${bookingId}`,
      cancel_url: `http://localhost:5173/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.json({ success: false, message: "Stripe session error", error: error.message });
  }
};

    
const updateBookingPayment = async (req, res) => {
    try {
      const { bookingId } = req.params;
      const {
        paymentId,
        amount,
        method,
        currency,
        receiptEmail,
        notes,
      } = req.body;
  
      const booking = await bookingModel.findById(bookingId);
  
      if (!booking) {
        return res.json({ success: false, message: "Booking not found" });
      }
  
      booking.paymentDetails = {
        id: paymentId,
        status: "paid",
        amount,
        method,
        paidAt: new Date(),
        currency,
        receiptEmail,
        notes,
      };
  
      booking.status = "completed";
  
      await booking.save();
  
      res.json({ success: true, message: "Payment recorded successfully", booking });
    } catch (error) {
      console.error("Error updating payment:", error);
      res.json({ success: false, message: "Server error", error: error.message });
    }
  };

const deleteBooking = async (req, res) => {
try{
    const bookingId="676a3e9cf68028d01b41c3e9";
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
        return res.json({ success: false, message: "Booking not found." });
    }
    await booking.deleteOne();
    res.json({ success: true, message: "Booking deleted successfully!" });
}catch(error){
    res.json({ success: false, message: "Error in deleting booking",message:error.message });

}
}
export {createbooking,updateBookingStatus,cancelBooking,getAllBookings,getSpecificBooking,getUserBookings,getProviderBookings,createCheckoutSession,updateBookingPayment,deleteBooking}