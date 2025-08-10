import refundModel from "../models/refundModel.js"
import paymentModel from "../models/paymentModel.js"
import bookingModel from "../models/bookingModel.js"
import notificationModel from "../models/notificationModel.js"
import {getAdminId} from "../utils/getAdminId.js"
const createRefundRequest=async (req,res)=>{

try {
    const { paymentId, userId, amount, reason } = req.body;
    const payment = await paymentModel.findById(paymentId);
    const providerId=payment.provider;
    const bookingId=payment.booking;
    // console.log("Payment createdAt:", new Date(payment.createdAt));

    if (!payment){
        return res.json({success:false, message: "Payment not found!" })
    };

    const hoursPassed = (Date.now() - new Date(payment.createdAt)) / (1000 * 60 * 60);
    // console.log(typeof(hoursPassed));
    
    if (Number(hoursPassed) > 48) {
      return res.json({success:false, message: "Sorry request failed:Refund time expired (48 hours)!" });
    }

    const existing = await refundModel.findOne( {paymentId} );
    // console.log("existing"+existing);
    if (existing){ 
      return res.json({success:false, message: "Refund already requested!" });
    }
    const refund = new refundModel({
      paymentId,
      bookingId,
      userId,
      amount,
      reason,
    });
console.log("refund is "+ refund)

await notificationModel.insertMany([
      {
        userId: userId,
        userRole: 'user',
        message: `Refund request sent! Please wait for our team to verify your request!.`,
      },
      {
        userId: providerId,
        userRole: "providers",
        message: `A new refund request created by a user booking ID:${payment.booking} for your service`,
      },
      {
        userId: await getAdminId(), // ensure this returns admin _id
        userRole: "admin",
        message: `A new refund has been created by a user booking ID:${payment.booking} on the platform.`,
      }
    ]); 
    await refund.save();
    return res.json({ success:true,message: "Request submitted: Please wait for our team to verify your request!", refund });


  } catch (error) {
    return res.json({ success:false,message: "Error requesting refund" });
  }
};

const getUserRefunds = async (req, res) => {
    const userId=req.user.id;
  try {
    const refunds = await refundModel.find({ userId});
    res.json({success:true,refunds});
  } catch (error) {
    res.json({ message: "Error fetching refunds", error });
  }
};

const getAllRefunds = async (req, res) => {
  try {
    const refunds = await refundModel.find().populate('userId').populate('paymentId');
    res.json({success:true,refunds});
  } catch (error) {
    res.json({ message: "Error fetching all refunds", error });
  }
};

const updateRefundStatus = async (req, res) => {
  try {
    const { status,message} = req.body;
    // console.log(status,message)

    const {id}=req.params;
    // console.log(id)

    const refund = await refundModel.findById(id);
    // console.log(refund.paymentId);

    if (!refund){
        return res.json({ success:false,message: "Refund not found!" });
    }
     const payment = await paymentModel.findById(refund.paymentId);
    //  console.log(payment.booking);

     if (!payment){
       return res.json({success:false, message: "Payment not found!" })
      };

      const userBooking = await bookingModel.findById(payment.booking);
      // console.log(userBooking);
      if(status == "approved"){
      userBooking.status="cancelled";
      userBooking.paymentDetails.status="refunded";
      payment.status="refunded";
      payment.transferStatus="refunded";
      payment.holdStatus=false;
      }
    refund.status = status;
    refund.respondedAt = Date.now();
    refund.adminResponse = message;

    await notificationModel.insertMany([
  {
    userId: userBooking.user,
    userRole: 'user',
    message: `Your refund request has been ${status}. Reason: "${message}".` + 
             (status === 'rejected'
               ? ' If you’re not satisfied, you may still cancel your booking manually.'
               : ' The refund will be processed shortly.'),
  },
  {
    userId: userBooking.serviceProvider,
    userRole: 'providers',
    message: `A refund request for booking ID ${userBooking._id} has been ${status} by the admin.`,
  },
  {
    userId: await getAdminId(), 
    userRole: "admin",
    message: `A refund for booking ID ${userBooking._id} and payment ID ${payment._id}has been transferred to user.`,
  }
]);


    await userBooking.save();
    await payment.save();
    await refund.save();

    return res.json({ success:true,message: "Refund status updated", refund });
  } catch (error) {
    return res.json({success:false, message: "Error updating refund", error });
  }
};

export {createRefundRequest,getUserRefunds,getAllRefunds,updateRefundStatus};