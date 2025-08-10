import hotelListingModel from "../models/hotelServiceListingsModel.js";
import reviewModel from "../models/reviewsModel.js"
//add new hotel listing
const addListing = async (req, res)=>{
    try{
        const {hotelName,hotelCategory,securityFeatures,
            bedType,roomAmenities,availability,description,breakfastIncluded,location,longitude,
            latitude,country,
            phone,email,website,originalPrice,discountedPrice}=req.body;
        // console.log(longitude+latitude);

        const serviceProviderId=req.user.id;
            // Parse fields that are sent as strings but are arrays or objects
            const parsedSecurityFeatures = JSON.parse(securityFeatures || "[]");
            const parsedRoomAmenities = JSON.parse(roomAmenities || "[]")
            
            if (!hotelName || !location || !description || !phone || !email) {
                return res.status(400).json({
                  success: false,
                  message: "Missing required fields",
                });
              }
        
              const imagesUrl = req.uploadedImages || [];
            //   console.log(imagesUrl);


        const newHotelListing=new hotelListingModel({
            providerId:serviceProviderId,
            hotelName,
            hotelCategory,
            securityFeatures: parsedSecurityFeatures,
            roomDetails:[
                {
                roomImage:imagesUrl,
                bedType,
                roomAmenities: parsedRoomAmenities,
                availability,
            },
            ],
            description,
            breakfastIncluded,
            location,
            coordinates: [Number(longitude), Number(latitude)],
            country,
            contactInfo:{
                phone,
                email,
                website,
            },
             pricing:{
                    originalPrice,
                    discountedPrice,
                  },

        });
        // console.log(newHotelListing);
            
            
    
        await newHotelListing.save();
        res.json({success:true,message:"Hotel listing created!"})

    }catch(error){
        console.log(error);
        return res.json({success:false,message:"Listing add error"});

    }
};

//edit or update hotel listing
const updateListing=async(req,res)=>{
    console.log("working")
        console.log("Body:", req.body);
        const body = Object.assign({}, req.body);


    try{
        const {hotelName,hotelCategory,securityFeatures,
            bedType,roomAmenities,availability,description,breakfastIncluded,location,longitude,
            latitude,country,
            phone,email,website,originalPrice,discountedPrice}=body;
            

        const {id}=req.params;
            // const id="676691dd560f096775713734";

    const listing=await hotelListingModel.findById(id);
        // console.log(listing);

    const getProviderId=req.user.id; // get from frontend
    // const getProviderId="675ed316009cccf6c9cc0f6a";
        // console.log(getProviderId);

    //  const parsedSecurityFeatures = JSON.parse(securityFeatures || "[]");
    //  const parsedRoomAmenities = JSON.parse(roomAmenities || "[]")
                    // console.log(parsedSecurityFeatures);
                    // console.log(parsedRoomAmenities);

    if(!listing){
       return res.json({success:false,message:"Listing not found"});
    }
    if(listing.providerId.toString() !== getProviderId){ //compare with model provider id
        return res.json({success:false,message:"Unauthorized to update listing"});
    }

    const parsedAvailability = availability === 'true';
        const parsedBreakfast = breakfastIncluded === 'true';
              const imagesUrl = req.uploadedImages || [req.body.roomImage];
console.log("image url is"+imagesUrl)

const failedDeletes = req.failedDeletes || [];
        console.log(failedDeletes);
     listing.hotelName = hotelName;
    listing.hotelCategory = hotelCategory;
    listing.securityFeatures = Array.isArray(securityFeatures) ? securityFeatures : [securityFeatures];
    listing.roomDetails = [
      {
        roomImage: imagesUrl,
        bedType,
        roomAmenities: Array.isArray(roomAmenities) ? roomAmenities : [roomAmenities],
        availability: parsedAvailability,
      }
    ];
    listing.description = description;
    listing.breakfastIncluded = parsedBreakfast;
    listing.location = location;
    listing.coordinates = [Number(longitude), Number(latitude)];
    listing.country = country;
    listing.contactInfo = { phone, email, website };
    listing.pricing = {
      originalPrice,
      discountedPrice,
    };
    await listing.save();
    res.json({success:true,message:"Listing updated successfully!"})

    }catch(error){
        res.json({success:false,message:"Listing update error"});
    }
};

//delete hotel listing
const deleteListing=async(req,res)=>{
    try{
        const {id}=req.params;
        
        const listing=await hotelListingModel.findById(id);
        // console.log(listing._id);
        
        if(!listing){
            res.json({success:false,message:"Listing not found"});
        }
        
        const getProviderId=req.user.id.toString();
        
        if(listing.providerId.toString() !== getProviderId){
           return res.json({success:false,message:"Unauthorized to delete Listing"});
        }
        await reviewModel.findOneAndDelete(listing.reviewOwner);
        await hotelListingModel.deleteOne({ _id: id });
        res.json({success:true,message:"Listing delete successfully!"})

    }catch(error){
        console.log(error);
        res.json({success:false,message:"Listing delete error"});
    }
}

//get all listings
const getAllListings = async (req, res) => {
    try {
        const getProviderId = req.user.id; // get from frontend

        const listing = await hotelListingModel.find({ providerId: getProviderId });
        
        if(listing.length === 0){
            return res.json({ success: false, message: "No listing found" });
        }

        res.json({ success: true, listing });

    } catch (error) {
        res.json({ success: false, message:"Error in getting listings" });
    }
};

//getlisting details
const getListingDetail = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);
        // const id="6766a54bc5c7a1efda957bb";
        const listing = await hotelListingModel.findById(id).populate("providerId", "name email contactNumber");

        if (!listing) {
            return res.json({ success: false, message: "listing not found" });
        }

        res.json({ success: true, listing });
    } catch (error) {
        res.json({ success: false, message:"Error in fetdhing details" });
    }
};



export {addListing,updateListing,deleteListing,getAllListings,getListingDetail}






