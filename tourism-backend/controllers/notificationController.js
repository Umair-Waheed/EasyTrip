import notificationModel from "../models/notificationModel.js";

const getNotification=async(req,res)=>{
    try {
    const userId = req.user.id;
    // console.log(req.user.id) // Assuming you're using a middleware to decode JWT
    const notifications = await notificationModel.find({ userId }).sort({ createdAt: -1 }).limit(10);
    // console.log(notifications);
   return res.json({ success: true, notifications });
  } catch (err) {
   return res.json({ success: false, message: "Failed to fetch notifications." });
  }
}

const unreadNotification=async(req,res)=>{
    try {
     const userId=req.user.id;
    const count=await notificationModel.countDocuments({userId,read:false});

   return res.json({ success: true, count });

  } catch (err) {
   return res.json({ success: false, message: "Failed to fetch unread notifications." });
  }
  
}
const readNotification=async(req,res)=>{
    try {
     const userId=req.user.id;
     console.log(userId);
    await notificationModel.updateMany({userId,read:false},{read:true, readAt: new Date()});

   return res.json({ success: true, message: "Notifications marked as read." });

  } catch (err) {
   return res.json({ success: false, message: "Failed to marked notifications as read." });
  }
  
}
export {getNotification,unreadNotification,readNotification}