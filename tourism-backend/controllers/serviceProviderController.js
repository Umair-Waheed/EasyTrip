import serviceProviderModel from "../models/serviceProviderModel.js"
import hotelListingModel from "../models/hotelServiceListingsModel.js";
import transportListingModel from "../models/transportServiceListingsModel.js";
import guideListingModel from "../models/guideServiceListingsModel.js";
import {generateToken} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import notificationModel from "../models/notificationModel.js";
import {getAdminId} from "../utils/getAdminId.js"
// import sendEmail from "../utils/sendEmail.js";
// const serviceProviderRegister=async(req,res)=>{
//     // const {name,email,password,serviceType,location,contactNumber}=req.body;
//     const {name,email,password}=req.body;
//     const serviceProvider=await serviceProviderModel.findOne({email});
//     try{
//         if(serviceProvider){
//            return res.json({success:false,message:"serviceProvider already exists"});
//         }
//         const newServiceProvider=new serviceProviderModel({name,email,password});
//             await newServiceProvider.save();

//         const token = generateToken({ id: newServiceProvider._id, role: 'serviceProvider' }, process.env.JWT_SECRET, '1d');
//         return res.json({ success: true, message: "Service provider registered successfully", token });


//     }catch(error){
//         console.log(error);
//         return res.json({success:false,message:"Error in registration",message:error.message});

//     }
    
// }

const serviceProviderRegister=async(req,res)=>{
    // const {name,email,password,location,contactNumber}=req.body;
     const {name,email,password}=req.body;
    const serviceProvider=await serviceProviderModel.findOne({email});
       try{
          if(serviceProvider){
           return res.json({success:false,message:"serviceProvider already exists"});
        }
                
            const verifyToken = generateToken({ email, name, password }, process.env.JWT_SECRET, '10m');

        // Construct verification link
    const verificationLink = `https://easytrip-production.up.railway.app/api/serviceprovider/verify-email/${verifyToken}`;

    // Email content
    const emailContent = `
      <h2>Email Verification</h2>
      <p>Hello ${name},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await sendEmail(email, "verify your EasyTrip account", emailContent);
    return res.json({ success: true, message: "Verification email sent. Please check your inbox." });
   
   
       }catch(error){
           console.log(error);
           return res.json({success:false,message:"Error in registration",message:error.message});
   
       }
    
}


const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, password } = decoded;

    const existing = await serviceProviderModel.findOne({ email });
    // console.log("existing data" +existing);
    if (existing) {
      return res.json({ success: false, message: "serviceProviderModel already verified" });
    }

    // Now save user
    const newServiceProviderModel = new serviceProviderModel({ name, email, password,verified:true });
        // console.log("user data"+ newUser);

    await newServiceProviderModel.save();

    // Now generate actual login token with _id
    // const loginToken = generateToken({ id: newUser._id, role: 'user' }, process.env.JWT_SECRET, '1d');
    //         console.log("user data" +loginToken);

return res.send(`
  <html>
    <body>
      <p>Your email has been successfully verified. You will be redirected for login to the website shortly..., or close this window and login</p>
      <script>
        setTimeout(() => {
          window.location.href = 'https://easy-trip-frontend-01.vercel.app/serviceprovider/login';
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
    return res.json({ success: false, message: "Invalid or expired token" });
  }
};


const serviceProviderLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const serviceProvider=await serviceProviderModel.findOne({email});
        if(!serviceProvider){
            return res.json({success:false,message:"ServiceProvider not found"});
        }
       

        const isPassword=await serviceProvider.comparePassword(password);
        if(!isPassword){
          return res.json({success:false,message:"Wrong password"});
        }

        const token=generateToken({id: serviceProvider._id, role: "serviceProvider", serviceType: serviceProvider.serviceType},
            process.env.JWT_SECRET, "1d" );
        return res.json({success:true,message:"Logged in successfully",token});


    }catch(error){
        console.error(error);
        return res.json({success:false,message:"Login error"})

    }
}

// const serviceProviderRegister = async (req, res) => {
//     const { name, email, password } = req.body;
  
//     try {
//       const serviceProvider = await serviceProviderModel.findOne({ email });
//       if (serviceProvider) {
//         return res.json({ success: false, message: "ServiceProvider already exists" });
//       }
  
//       const newProvider = await serviceProviderModel({ name, email, password });
      
//       await newProvider.save();
//       const token = generateToken({ id: newProvider._id }, process.env.JWT_SECRET, "10m");
//       console.log("token is "+token);
//       const link = `http://localhost:5173/verify-email/${token}`;

//       // Send the mail
//   await sendEmail(
//     email,
//     "🔒 Verify your EasyTrip account",
//     `<h3>Hi ${name}</h3>
//      <p>Please verify your email by clicking the link below:</p>
//      <a href="${link}">Verify Email</a>`
//   );
//   if(newProvider.verified){

//       return res.json({ success: true, message: "Verification email sent",token });
//   }
  
//     } catch (error) {
//       console.error(error);
//       res.json({ success: false, message: "Registration error", error: error.message });
//     }
//   };

const serviceProviderSignout=async(req,res)=>{
    try{
        res.clearCookie('token');
        return res.json({success:true,message:"Signout successfully"});
    }catch(error){
        console.log(error);
        return res.json({success:false,message:"Signout error"})
    }

}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const provider = await serviceProviderModel.findOne({ email });

    if (!provider){
       return res.json({success:false, message: "provider not found" });
    }
    // Generate token
    const resetToken = jwt.sign(
      { id: provider._id },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    const resetUrl = `https://easy-trip-frontend-01.vercel.app/reset-password/serviceprovider/${resetToken}`;

    await sendEmail(
      provider.email,
      "Password Reset",
      `<p>Click the link below to reset your password:</p>
       <a href="${resetUrl}">${resetUrl}</a>
       <p>This link will expire in 1 hour.</p>`
    );

    return res.json({success:true, message: "Password reset link sent to your email" });
  } catch (err) {
    return res.json({success:false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    console.log(password);
    // verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const provider = await serviceProviderModel.findById(decoded.id);
    console.log(provider);

    if (!provider){
       return res.json({success:false, message: "provider not found" });
    }
    // new password
provider.password = password;
await provider.save();
    console.log(provider);

    return res.json({success:true, message: "Password reset successful. Please go to website and login again" });
  } catch (err) {
    return res.json({success:false, message: "Invalid or expired token" });
  }
};

const getServiceProviderData = async (req, res) => {
    const providerId = req.params.id;
    // console.log(providerId);
    try {
        const isProvider = await serviceProviderModel.findById(providerId);
        if (!isProvider) {
            return res.json({ success: false, message: "ServiceProvider not found" });
        }

        return res.json({ success: true, isProvider });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error in fetching serviceprovider data", error: error.message });
    }
};
 const completeSetup = async (req, res) => {
  const {
    serviceType,
    businessName,
    location,
    country,
    contactNumber,
    registrationNumber,
    bankAccount,
    accountNumber,   
    facebookLink,
    instagramLink,
    linkedinLink,
  } = req.body;
  // console.log(serviceType)

  const providerId = req.user.id;
  // console.log(providerId);

  try {
    const isProvider = await serviceProviderModel.findById(providerId);
    if (!isProvider) {
      return res.json({ success: false, message: "ServiceProvider not found" });
    }
  // console.log(isProvider);


    const { image, governmentId, guideCertificate, driverLicense, hotelLicense } =
      req.uploadedImages || {};
        // console.log("images work");


      if(isProvider.status == "pending"){
         return res.json({
            success:false,
            message: "Your setup request is already pending team approval.",
        });
      }
        // console.log("first work");

      if(isProvider.status == "approved"){
         return res.json({
            success:false,
            message: "You are already approved.",
        });
      }
        // console.log("seond work");

    if (!image || !governmentId) {
      return res.json({
        success: false,
        message: "Profile image and government ID are required",
      });
    }
        // console.log("third work");


    if (serviceType === "transport" && !driverLicense) {
      return res.json({
        success: false,
        message: "Driver license copy is required",
      });
    }
        // console.log("fourth work");


    if (serviceType === "hotel" && !hotelLicense) {
      return res.json({
        success: false,
        message: "Hotel license document is required",
      });
    }
        // console.log("fift work");

    isProvider.serviceType = serviceType;
    isProvider.businessName = businessName;
    isProvider.location = location;
    isProvider.country = country;
    isProvider.contactNumber = contactNumber;
    isProvider.registrationNumber = registrationNumber;
    isProvider.bankAccount = bankAccount;
    isProvider.accountNumber = accountNumber;
    isProvider.facebookLink = facebookLink;
    isProvider.instagramLink = instagramLink;
    isProvider.linkedinLink = linkedinLink;
    isProvider.status = "pending";

    if (image) isProvider.image = image;
    if (governmentId) isProvider.governmentId = governmentId;
    if (guideCertificate) isProvider.guideCertificate = guideCertificate;
    if (driverLicense) isProvider.driverLicense = driverLicense;
    if (hotelLicense) isProvider.hotelLicense = hotelLicense;

    await isProvider.save();
     await notificationModel.insertMany([
  // {
  //   userId: providerId,
  //   userRole: "providers",
  //   message: `Your setup request has been submitted successfully and is pending team approval.`,
  // },
  {
    userId: await getAdminId(), // ensure this returns admin _id
    userRole: "admin",
    message: `A new provider setup request has been submitted by provider ID: ${providerId}.`,
  }
]);


    return res.json({ success: true, message: "Profile Setup Completed. Wait for team approval!" });
  } catch (error) {
    if (error.code === 11000) {
    return res.json({
      success: false,
      message: "Contact number already exists. Please use another one."
    });
  }
      return res.json({
      success: false,
      message: "Error in completing setup",
      error: error.message,
    });
  }
};

// const completeSetup=async(req,res)=>{
//     const{serviceType,businessName,location,country,contactNumber,registrationNumber,facebookLink,instagramLink,linkedinLink}=req.body;
//     const providerId = req.user.id;
//     console.log(serviceType,businessName,location,country,contactNumber,registrationNumber,facebookLink,instagramLink,linkedinLink);
//     try{
        
//         const isProvider = await serviceProviderModel.findById(providerId);
//         if(!isProvider){
//             return res.json({success:false,message:"ServiceProvider not found"})
//         }       

//         const providerImages = req.uploadedImages;

//         // const image = req.files?.image?.[0];
//         // const governmentId = req.files?.governmentId?.[0];
//         // const guideCertificate = req.files?.guideCertificate?.[0];
//         // const driverLicense = req.files?.driverLicense?.[0];
//         // const hotelLicense = req.files?.hotelLicense?.[0];
        
//         // console.log(image,governmentId,guideCertificate,driverLicense,hotelLicense);

//         // let imageUrl=isProvider.image?.url || " ";
//         // let imageName=isProvider.image?.filename || " ";
//         // if (req.file) {
//         //     imageUrl = req.file.path;
//         //     imageName=req.file.filename; 
//         //     console.log("image url is "+imageUrl+" image name is "+imageName);
//         //   }

//         if (!image || !governmentId) {
//       return res.json({ success:false,message: "Profile image and government ID are required" });
//     }
//     if (providerType === "transport" && !driverLicense) {
//       return res.status(400).json({ message: "Driver license copy is required" });
//     }

//     if (providerType === "hotel" && !hotelLicense) {
//       return res.status(400).json({ message: "Hotel license document is required" });
//     }
//         isProvider.serviceType = serviceType;
//     isProvider.businessName = businessName;
//     isProvider.location = location;
//     isProvider.country = country;
//     isProvider.contactNumber = contactNumber;
//     isProvider.registrationNumber = registrationNumber;
//     isProvider.facebookLink = facebookLink;
//     isProvider.instagramLink = instagramLink;
//     isProvider.linkedinLink = linkedinLink;

//     isProvider.image = image
//       ? { url: image.path, filename: image.filename }
//       : isProvider.image || "";

//     isProvider.governmentId = governmentId
//       ? { url: governmentId.path, filename: governmentId.filename }
//       : isProvider.governmentId;

//     if (guideCertificate) {
//       isProvider.guideCertificate = {
//         url: guideCertificate.path,
//         filename: guideCertificate.filename,
//       };
//     }

//     if (driverLicense) {
//       isProvider.driverLicense = {
//         url: driverLicense.path,
//         filename: driverLicense.filename,
//       };
//     }

//     if (hotelLicense) {
//       isProvider.hotelLicense = {
//         url: hotelLicense.path,
//         filename: hotelLicense.filename,
//       };
//     }
//         await isProvider.save();
    
//         return res.json({ success: true, message: "Dashboard Setup Completed!" });
//       } catch (error) {
//         console.log(error);
//         return res.json({ success: false, message: "Error in completing setup", error: error.message });
//       }
    
//     }
// const completeSetup=async(req,res)=>{
//     const{serviceType,location,country,contactNumber,facebookLink,instagramLink,linkedinLink}=req.body;
//     const providerId = req.user.id;
//     // console.log("provider id" + req.user.id);
//     try{
        
//         const isProvider = await serviceProviderModel.findById(providerId);
//         if(!isProvider){
//             return res.json({success:false,message:"ServiceProvider not found"})
//         }       
    
//         let imageUrl=isProvider.image?.url || " ";
//         let imageName=isProvider.image?.filename || " ";
//         if (req.file) {
//             imageUrl = req.file.path;
//             imageName=req.file.filename; 
//             console.log("image url is "+imageUrl+" image name is "+imageName);
//           }

//         isProvider.serviceType = serviceType;
//         isProvider.location = location;
//         isProvider.country = country;
//         isProvider.contactNumber = contactNumber;
//         isProvider.image = {url:imageUrl,filename:imageName};
//         isProvider.facebookLink = facebookLink;
//         isProvider.instagramLink = instagramLink;
//     //     // isProvider.twitterLink = twitterLink;
//         isProvider.linkedinLink = linkedinLink;
//         isProvider.isSetupComplete = true;
//         await isProvider.save();
    
//         return res.json({ success: true, message: "Dashboard Setup Completed!" });
//       } catch (error) {
//         console.log(error);
//         return res.json({ success: false, message: "Error in completing setup", error: error.message });
//       }
    
//     }


//add provider service info
const addUpdateProviderInfo = async (req, res) => {
    const {name,location,contactNumber,facebookLink,instagramLink,linkedinLink } = req.body;
    const image=req.file.path;
    const providerId = req.user.id; 

    try {
        const provider = await serviceProviderModel.findById(providerId);
        if (!provider) {
            return res.json({ success: false, message: "Service provider not found" });
        }

        provider.name = name || provider.name;
        provider.location = location || provider.location;
        provider.contactNumber = contactNumber || provider.contactNumber;
        provider.image = image || provider.image;
        provider.facebookLink = facebookLink || provider.facebookLink;
        provider.instagramLink = instagramLink || provider.instagramLink ;
        // provider.twitterLink = twitterLink || provider.twitterLink;
        provider.linkedinLink = linkedinLink || provider.linkedinLink;

        await provider.save();
        return res.json({ success: true, message: "Profile updated successfully", provider });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Error updating profile" });
    }
};

const deleteProvider = async (req, res) => {
    const providerId = req.user.id; 

    try {
        const provider = await serviceProviderModel.findById(providerId);
        if (!provider) {
            return res.status(404).json({ success: false, message: "Service provider not found" });
        }
        let serviceType=provider.serviceType;
        let listing;
        switch (serviceType) {
            case 'hotel':
                listing = hotelListingModel;
                break;
            case 'transport':
                listing = transportListingModel;
                break;
            case 'guide':
                listing = guideListingModel;
                break;
            default:
                return res.json({ success: false, message: 'Invalid service type' });
        }

        await listing.findByIdAndDelete(providerId);
        await provider.deleteOne();
        return res.json({ success: true, message: "Profile and their services deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error deleting profile" });
    }
};

export {serviceProviderRegister,verifyEmail,serviceProviderLogin,serviceProviderSignout,forgotPassword,resetPassword,getServiceProviderData,completeSetup,addUpdateProviderInfo,deleteProvider};
