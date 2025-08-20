import Payment from '../models/paymentModel.js';
import Booking from '../models/bookingModel.js';
import User from '../models/userModel.js'; // For fetching provider details
import Admin from "../models/adminModel.js";
import ServiceProvider from "../models/serviceProviderModel.js"
import { initiatePayFastPayment, sendTransferToProvider,refundToUser } from '../utils/paymentHelper.js'; // Refund helper added
import notificationModel from '../models/notificationModel.js';
import {getAdminId} from "../utils/getAdminId.js"

// Create a payment when the user pays
const createPayment = async (req, res) => {
  try {
    const {providerId, bookingId, amount, currency = "PKR"} = req.body;
    console.log(req.body);
    const userId = req.user.id;
    console.log(providerId,bookingId,amount);
    const booking = await Booking.findById(bookingId);
    // console.log("booking data "+ booking);
  
    if (!booking) {
      return res.json({success:false, message: 'Booking not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success:false, message:'user not found!' });
    }


    
    // Safely check status
    const isPay = await Payment.findOne({ booking: bookingId });
    console.log("Payment found for booking:", isPay);
      if (isPay && isPay.status === "held") {
        return res.json({ success: false, message: 'Payment already completed!' });
      }

    // Calculate amounts
    const adminAmount = (amount * 5) / 100;// 5% commission
    const providerAmount = amount - adminAmount;


    const payfastResponse = await initiatePayFastPayment(userId, amount);

    if (!payfastResponse.success) {
      return res.json({ success: false, message: 'PayFast payment failed!' });
    }

    // Create payment object and save with 'held' status
    const payment = new Payment({
      user: userId,
      provider: providerId,
      booking: bookingId,
      amount,
      adminAmount,
      providerAmount,
      commissionAmount: adminAmount,
      currency,
      status: "held", // Held until admin releases
      transferStatus: "pending",
      transactionId: payfastResponse.transactionId || "dummy_tx_id"
    });
    // console.log("booking status"+booking.status);
    booking.paymentDetails.status="paid";
    booking.status="completed";
    // console.log("booking status"+booking.status);
    user.spendings+=amount;

    await notificationModel.insertMany([
  {
    userId: req.user.id,
    userRole: 'user',
    message: `Congratulations, Booking successfully completed! See payment details from the dashboard.`,
  },
  {
    userId: providerId,
    userRole: "providers",
    message: "A new booking payment has been made for your service.",
  },
  {
    userId: await getAdminId(), // ensure this returns admin _id
    userRole: "admin",
    message: "A new booking payment has been made on the platform.",
  }
]); 

    await user.save();
    await booking.save();
    await payment.save(); 
    return res.json({ success:true, message: 'Payment successfull.', payment });
  } catch (error) {
    console.error(error);
    return res.json({ success:false, message: 'Error creating payment' });
  }
};
const getProviderPayments=async(req,res)=>{
  try{
    const {providerId}=req.params;
    // console.log(providerId);
  const isProvider=await ServiceProvider.findById(providerId);
  if(!isProvider){
    return res.json({success:false,message:"ServiceProvider not found!"});
  }
  // console.log(isProvider)

  const payments=await Payment.find({provider:providerId});
  if(!payments || payments.length===0){
   return res.json({success:false,message:"ServiceProvider Payment details not found!"});
  }
  return res.json({success:true,payments});
}catch(error){
  console.log(error);
    return res.json({success:false,message:error});

}}

// get user payments

const getUserPayments=async(req,res)=>{
  const {userId}=req.params;
  // console.log(userId);
  try{
  const isUser=await User.findById(userId);
  if(!isUser){
    return res.json({success:false,message:"User not found!"});
  }

  const payments=await Payment.find({user:userId});
  if(!payments){
    return res.json({success:false,message:"User Payment details not found!"});
  }

  return res.json({success:true,payments});
}catch(error){
  console.log(error);
    return res.json({success:false,message:error});

}

}

//get all payment
const getAllPayments=async(req,res)=>{
  try {
    const payments=await Payment.find({});
    
      if(!payments){
        return res.json({success:false,message:"payments not found!"})
        }
    
      return res.json({success:true,payments}); 
    
  } catch (error) {
    console.log(error);
    return res.json({success:false,message:error});

  }
}

// Admin processes the payment, sends commission to admin, and 95% to provider
const releasePayment = async (req, res) => {
  try {
    // console.log("backend call");
    const { paymentId } = req.params;

    // Find payment record
    const payment = await Payment.findById(paymentId);
    console.log(payment);
    if (!payment) {
      return res.json({ success:false, message: "Payment not found" });
    }

    // Check if the payment is on hold (held by admin)
    if (payment.status !== "held") {
      return res.json({ success:false, message: "Payment cannot be released" });
    }

    const transferResult = await sendTransferToProvider(payment.provider, payment.providerAmount);

    if (!transferResult.success) {
      return res.json({ success: false, message: "Transfer to provider failed" });
    }

    // send commission send to admin
    const isAdmin=await Admin.findOne({});
    if (isAdmin) {
      isAdmin.totalEarning += payment.commissionAmount;
      await isAdmin.save();
  }
    //Reamining cost send to provider
    const providerId=payment.provider;
    const isProvider=await ServiceProvider.findById(providerId);
    if(isProvider){
      isProvider.totalEarning += payment.providerAmount;
      await isProvider.save();
    }
    // Update status to 'commission_sent'

    payment.status = "completed";
    payment.transferStatus = "completed"; // Mark as sent
    payment.holdStatus = false; // Release the hold
    payment.updatedAt = new Date();

await notificationModel.insertMany([
      {
        userId: payment.provider,
        userRole: 'providers',
        message: `Dear Service Provider, the payment for booking ID: ${payment.booking} has been successfully transferred to your account. We appreciate your patience.`
      },
    ]);
    await payment.save();

    return res.json({success:true,
      message: "Payment transferred to provider successfully.",
      transferId: transferResult.transferId,
      payment,
    });
  } catch (error) {
    console.error(error);
    return res.json({ success:false, message: "Error releasing payment", error });
  }
};


export { createPayment,getProviderPayments,getUserPayments, getAllPayments, releasePayment };
