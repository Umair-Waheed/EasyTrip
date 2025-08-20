import destListingModel from "../models/destinationListings.js";
import hotelListingModel from "../models/hotelServiceListingsModel.js";
import transportListingModel from "../models/transportServiceListingsModel.js";
import guideListingModel from "../models/guideServiceListingsModel.js";
// get destination listings
const getDestListings = async (req,res)=>{
    try {
        const destListings=await destListingModel.find({});

        if(!destListings){
           return res.json({success:false,message:"Destinations listings not found"})
        }

       return res.json({success:true,destListings});
        
    } catch (error) {
       return res.json({success:false,message:"Destinations not Fetching"});
        
    }

}
//getdestination by id
const getDestinationDetail = async (req, res) => {
    try {
        const { id } = req.params;
        // const id="6766a54bc5c7a1efda957bb";
        const listing = await destListingModel.findById(id);

        if (!listing) {
            return res.json({ success: false, message: "listing not found" });
        }

       return res.json({ success: true, listing });
    } catch (error) {
      return res.json({ success: false, message:"Error in fetdhing details" });
    }
};

//get hotel listings
const getHotelListings = async (req, res) => {
    try {
        
        const listing = await hotelListingModel.find({});
        
        if(listing.length === 0){
            return res.json({ success: false, message: "Hotel listings not found" });
        }

       return res.json({ success: true, listing });

    } catch (error) {
       return res.json({ success: false, message:"Error in getting listings" });
    }
};

//get hotel by id
const getHotelDetail=async(req,res)=>{
     try {
            const { id } = req.params;
            // console.log("hotel id "+ id);
            // const id="6766a54bc5c7a1efda957bb";
            const listing = await hotelListingModel.findById(id).populate("providerId", "name email contactNumber");
            // console.log(listing);
            if (!listing) {
                return res.json({ success: false, message: "listing not found" });
            }
    
           return res.json({ success: true, listing });
        } catch (error) {
           return res.json({ success: false, message:"Error in fetdhing details" });
        }
}

//get transport listing
const getTransportListings = async (req, res) => {
    try {
        const listing = await transportListingModel.find({});
        
        if(listing.length === 0){
            return res.json({ success: false, message: "Transport listings not found" });
        }

       return res.json({ success: true, listing });

    } catch (error) {
       return res.json({ success: false, message:"Error in getting listings" });
    }
};

//get tranport by id
const getTransportDetail = async (req, res) => {
    try {
        const { id } = req.params;
        
        const listing = await transportListingModel.findById(id).populate("providerId", "name email contactNumber");

        if (!listing) {
            return res.json({ success: false, message: "listing not found" });
        }

      return res.json({ success: true, listing });
    } catch (error) {
       return res.json({ success: false, message:"Error in fetching details" });
    }
};
//get guide listing
const getGuideListings = async (req, res) => {
    try {
        const listing = await guideListingModel.find({});
        
        if(listing.length === 0){
            return res.json({ success: false, message: "Guide listings not found" });
        }

       return res.json({ success: true, listing });

    } catch (error) {
       return res.json({ success: false, message:"Error in getting listings" });
    }
};

const getGuideDetail = async (req, res) => {
    try {
        const { id } = req.params;
        
        const listing = await guideListingModel.findById(id).populate("providerId", "name email contactNumber");

        if (!listing) {
            return res.json({ success: false, message: "listing not found" });
        }

       return res.json({ success: true, listing });
    } catch (error) {
       return res.json({ success: false, message:"Error in fetching details" });
    }
};


export {getDestListings,getDestinationDetail,getHotelListings,getHotelDetail,
    getTransportListings,getTransportDetail,getGuideListings,getGuideDetail}