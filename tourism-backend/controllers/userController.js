import sendEmail from "../utils/sendEmail.js";
import userModel from "../models/userModel.js";
import {generateToken} from "../utils/generateToken.js";
import jwt from 'jsonwebtoken';

// const userRegister=async(req,res)=>{
//     // const {name,email,password,location,contactNumber}=req.body;
//      const {name,email,password}=req.body;
//        const user=await userModel.findOne({email});
//        try{
//            if(user){
//               return res.json({success:false,message:"user already exists"});
//            }
//            const newUser=new userModel({name,email,password});
//                await newUser.save();
   
//            const token = generateToken({ id: newUser._id, role: 'user' }, process.env.JWT_SECRET, '1d');
//            return res.json({ success: true, message: "Service provider registered successfully", token });
   
   
//        }catch(error){
//            console.log(error);
//            return res.json({success:false,message:"Error in registration",message:error.message});
   
//        }
    
// }
const userRegister=async(req,res)=>{
    // const {name,email,password,location,contactNumber}=req.body;
     const {name,email,password}=req.body;
       const user=await userModel.findOne({email});
       try{
           if(user){
              return res.json({success:false,message:"user already exists"});
           }
                  
            
            const verifyToken = generateToken({ email, name, password }, process.env.JWT_SECRET, '10m');

        // Construct verification link
    const verificationLink = `https://easytrip-production.up.railway.app/api/user/verify-email/${verifyToken}`;

    // Email content
    const emailContent = `
      <h2>Email Verification</h2>
      <p>Hello ${name},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await sendEmail(email, "verify your EasyTrip account", emailContent);
    res.json({ success: true, message: "Verification email sent. Please check your inbox." });
   
   
       }catch(error){
           console.log(error);
           return res.json({success:false,message:"Error in registration",message:error.message});
   
       }
    
}

// route: /api/auth/verify-email/:token

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, password } = decoded;

    const existing = await userModel.findOne({ email });
    // console.log("existing data" +existing);
    if (existing) {
      return res.json({ success: false, message: "User already verified" });
    }

    // Now save user
    const newUser = new userModel({ name, email, password,verified:true });
        // console.log("user data"+ newUser);

    await newUser.save();

    // Now generate actual login token with _id
    // const loginToken = generateToken({ id: newUser._id, role: 'user' }, process.env.JWT_SECRET, '1d');
    //         console.log("user data" +loginToken);

return res.send(`
  <html>
    <body>
      <p>Your email has been successfully verified. You will be redirected to the login page shortly... or close this window and login</p>
      <script>
        setTimeout(() => {
          window.location.href = 'http://localhost:5173/user/login';
        }, 4000);
      </script>
    </body>
  </html>
`);    // return res.redirect(`http://localhost:5173/`); 
    // return res.redirect(`http://localhost:4000/login-success?token=${loginToken}`); 

    // const user = await userModel.findOne({
    //   verificationToken: token,
    //   verificationTokenExpires: { $gt: Date.now() }
    // });

    // if (!user) {
    //   return res.status(400).json({ success: false, message: "Token is invalid or expired" });
    // }

    // user.verified = true;
    // user.verificationToken = undefined;
    // user.verificationTokenExpires = undefined;
    // await user.save();

    // res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Invalid or expired token" });
  }
};


const userLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return  res.json({success:false,message:"User not found"});
        }

        const isPassword=await user.comparePassword(password);
        if(!isPassword){
          return res.json({success:false,message:"Wrong password"});
        }
        const token=generateToken({id:user._id,role:'user'},process.env.JWT_SECRET,'1d');
        return res.json({success:true,message:"Welcome to EasyTrip!",token});


    }catch(error){
        console.error(error);
        return res.json({success:false,message:"Login error"})

    }
}

const userSignout=async(req,res)=>{
    try{
        res.clearCookie('token');
        res.json({success:true,message:"Signout successfully!"});
    }catch(error){
        res.json({success:false,message:"Signout error"})
    }

}

const getUserData = async (req, res) => {
    const userId = req.params.id;
    // console.log(userId);
    try {
        const isUser = await userModel.findById(userId);
        if (!isUser) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, isUser });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error in fetching User data", error: error.message });
    }
};

const addUpdateUserInfo = async (req, res) => {
    const {name } = req.body;
    const image=req.files(file.path);
    const userId = req.user.id; // Retrieved from JWT

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message:"User not found" });
        }

        // Update existing profile or add new details
        user.name = name;
        user.image =image;

        await user.save();
        return res.json({ success: true, message: "Profile updated successfully!", user });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Error updating profile" });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.user.id; 

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        await user.deleteOne();
        return res.json({ success: true, message: "Profile deleted successfully!" });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Error deleting profile" });
    }
};

export {userRegister,verifyEmail,userLogin,userSignout,getUserData,addUpdateUserInfo,deleteUser};
