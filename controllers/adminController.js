import adminModel from "../models/adminModel.js"; 
import userModel from "../models/userModel.js"
import serviceProviderModel from "../models/serviceProviderModel.js";
import bookingModel from "../models/bookingModel.js"
import reviewModel from "../models/reviewsModel.js"
import hotelListings from "../models/hotelServiceListingsModel.js"
import transportListings from "../models/transportServiceListingsModel.js"
import guideListings from "../models/guideServiceListingsModel.js";
import paymentModel from "../models/paymentModel.js"
import {generateToken} from "../utils/generateToken.js";

//login functionality for admin
const adminLogin=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const admin=await adminModel.findOne({email});
        if (!email || !password) {
            return res.json({success:false,message:"Please enter email or password!"});
            }
        if(!admin){
           return res.json({success:false,message:"Wrong Credentials!"});
        }

        //check password
        const isPassword = await admin.comparePassword(password);        
        if (!isPassword) {
            return res.json({success:false,message:"Wrong Credentials"});
            }

        //generate token
        const token=generateToken({id:admin._id,role:admin.role},
            process.env.JWT_SECRET,
        '3h');

        return res.json({success:true,message:"Logged in successfully",token});

    } catch (error) {

        console.log(error);
        return res.json({success:false,message:"Login error"});
        
    }

}
const getAdminData=async(req,res)=>{
    try{
        const isAdmin=await adminModel.findOne({});
        if(isAdmin){
            res.json({success:false,message:"Admin not found!"})
        }
        res.json({success:true, message:isAdmin})

    }catch(error){
        console.log(error)
        res.json({success:false,message:"Admin not found!"})

    }
}

const adminSignOut= async(req,res)=>{
   try{
    res.clearCookie('token');
    res.json({success:true,message:"Admin Logout"});
}catch(error){
    res.json({success:false,message:"Error"})
}}

const getUsersList=async(req,res)=>{
    try{
        const users=await userModel.find({});
        if(!users.length){
            return res.json({success:false,message:"No Users found"});
        }
        return res.json({success:true,message:{users}})
    }catch(error){
        res.json({success:false,message:"Fetching Users Error",error});
        
    }
}

const getuserDetail=async(req,res)=>{
    const userId=req.params;
    try{
        const user=await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        const bookings= await bookingModel.find({userId}).populate('serviceId','name location price');
        const reviews =await reviewModel.findById({userId}).populate('serviceId','name location')
        const payments = await paymentModel.findById({ userId });

        res.json({
            success:true,
            message:{
                user:{
                    name:user.name,
                    email:user.email,
                    location:user.location,
                    contactNumber:user.contactNumber,
                    createdAt:user.createdAt,
                },
                bookings,
                reviews,
                payments,
            }
        });

    }catch(error){
        res.json({success:false,message:"User details fetching error",error});
    }
}

const deleteUser=async(req,res)=>{
    let userId=req.params;
    try {
        const user=await userModel.findById({userId});
        if(!user){
            res.json({success:false,message:"User not found"});
        }
        //delete user
        await bookingModel.deleteMany({userId});
        await reviewModel.deleteMany({userId});

        await user.deleteOne();
        res.json({success:true,message:"User successfully deleted"})
        
    } catch (error) {
        res.json({success:false,message:"Failed to delete"});
        
    }
   
}

const getServiceProvider = async (req, res) => {
    try{
        const{type}=req.query;

        let provider;

        if (type === 'hotel') {
          provider = await serviceProviderModel.find({type});
        } else if (type === 'transport') {
          provider = await serviceProviderModel.find({type});
        } else if (type === 'guide') {
          provider = await serviceProviderModel.find({type});
        } else {
          // Aggregate all service providers
          provider = await serviceProviderModel.find({});

        }
        if(!provider.length){
            res.json({success:false,message:"No service provider found"});
        }
        res.json({success:true,message:{provider}});
    }catch(error){
        res.json({success:false,message:"Service provider fetching error",error});

    }

}

const getServiceProviderDetail=async(req,res)=>{
    const providerId=req.params;
    try{
    const provider=await serviceProviderModel.find({providerId});
    if(!provider){
        res.json({success:false,message:"service provider details not found"});
    }
    const bookings=await bookingModel.find({providerId});
    const reviews=await reviewModel.find({providerId});
    

    }catch(error){

    }
    
}




export {adminLogin,getAdminData,adminSignOut,getUsersList,getuserDetail,deleteUser,getServiceProvider}