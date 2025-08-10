import adminModel from "../models/adminModel.js"

const getAdminId=async()=>{
    const admin=await adminModel.findOne();
    return admin?._id;

}
export {getAdminId}