import reportModel from "../models/reportModel.js";
import notificationModel from "../models/notificationModel.js";
import { getAdminId } from "../utils/getAdminId.js";
 const sendReport = async (req, res) => {
  try {
    const { subject, message } = req.body;
    console.log("reporticon call",subject,message)
    const userId=req.user.id;
    console.log(userId)
    let userRole=req.user.role;
    if(userRole =='serviceProvider'){
      userRole ='providers'
    }
    const newReport = new reportModel({
      userId: userId,
      userRole: userRole,  // assume you store role in JWT
      subject,
      message,
    });
    console.log(newReport)
    await notificationModel.create({
      userId: await getAdminId(),
      userRole: "admin",
      message: `One new user query: "${subject}".`,
    });

    await newReport.save();
   return res.json({ success: true, message: "Query sent successfully!" });

  } catch (err) {
   return res.json({ success: false, message: "Failed to send query." });
  }
};
const userReports=async(req,res)=>{
  try{
    console.log("this is call")
    const id=req.params.userId;
    console.log(id);
    const reports = await reportModel.find({ userId: id })
    if (!reports) {
      return res.json({ success: false, message: "Report not found." });
    }
    console.log(reports)
    return res.json({success:true,reports})

  }catch(error){
    res.json({ success: false, message: "Failed to fetch reports." });

  }
}

 const replyToReport = async (req, res) => {
  try {
    const {reportId }= req.params;
    console.log(reportId);
    const { message,userId,reportSubject } = req.body;
    console.log(message,userId);

    const report = await reportModel.findById(reportId);
    if (!report) {
      return res.json({ success: false, message: "Report not found." });
    }
    if(report.status == "replied" ){
        return res.json({ success: false, message: "Already replied on this report." });

    }

    report.adminResponse = message;
    report.status = "replied";
    await report.save();

    // Notify the user/provider
    await notificationModel.create(

      {
      userId: userId,
      userRole: req.user.role,
      message: `Reply your query from EasyTrip: "${reportSubject}".`,
    },
    //  {
    //   userId: userId,
    //   userRole: "providers",
    //   message: `Reply your query from EasyTrip: "${reportSubject}".`,
    // }
  );
   return res.json({ success: true, message: "Reply sent successfully." });

  } catch (err) {
   return res.json({ success: false, message: "Failed to send reply." });
  }
};

 const getAllReports = async (req, res) => {
  try {
    const reports = await reportModel.find();
    // console.log(reports)
   return res.json({ success: true, reports });
  } catch (err) {
   return res.json({ success: false, message: "Could not fetch reports." });
  }
};

export{sendReport,replyToReport,userReports,getAllReports}