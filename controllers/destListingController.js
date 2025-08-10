import destListingModel from "../models/destinationListings.js";
import reviewModel from "../models/reviewsModel.js";
// get listings
const getDestListings = async (req,res)=>{
    try {
        const destListings=await destListingModel.find({});

        if(!destListings){
            res.json({success:false,message:"Destinations not found"})
        }

        res.json({success:true,destListings});
        
    } catch (error) {
        res.json({success:false,message:"Destinations not Fetching"});
        
    }

}

//add destinations
const addDestListing=async(req,res)=>{
    try{
        const { 
            name,
            description,
            location,
            longitude,
            latitude,
            country,
            category,
            safetyLevel,
            priceRange,
            bestVisitedIn,
            climate
        } = req.body;
        // console.log(longitude+latitude+"cat is"+category+"season is"+bestVisitedIn);
      


        const adminId = req.user.id;
        const imagesUrl = req.uploadedImages || [];

        if (!name || !description || !location || !category || !priceRange || !bestVisitedIn) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }


        const newDestination = new destListingModel({
            name,
            description,
            location,
            coordinates: [Number(longitude), Number(latitude)],
            country,
            images: imagesUrl,
            category: Array.isArray(category) ? category : [category],
            safetyLevel: safetyLevel || 'Medium', 
            priceRange,
            bestVisitedIn: Array.isArray(bestVisitedIn) ? bestVisitedIn : [bestVisitedIn],
            climate: climate || 'Temperate',
            addedBy: adminId
        });

        await newDestination.save();
        res.json({success:true,message:"Destination added successfully!"})

    }catch(error){
        res.json({success:false,message:"Error:Destination not added",message:error.message});
    }

}

//listing in details
const getListingDetail = async (req, res) => {
    try {
        const { id } = req.params;
        // const id="6766a54bc5c7a1efda957bb";
        const listing = await destListingModel.findById(id);

        if (!listing) {
            return res.json({ success: false, message: "listing not found" });
        }

        res.json({ success: true, listing });
    } catch (error) {
        res.json({ success: false, message:"Error in fetdhing details" });
    }
};

// edit listing

const editDestListing = async (req, res) => {
    const { id } = req.params; // Destination ID from URL
    const { name, description, location,country, images } = req.body;
  
    try {
      const destination = await destListingModel.findById(id);
  
      if (!destination) {
        return res.json({ success: false, message: "Destination not found!" });
      }
  
      // Update fields
      destination.name = name || destination.name;
      destination.description = description || destination.description;
      destination.location = location || destination.location;
      destination.country = country || destination.country;
      destination.images = images || destination.images;
  
      await destination.save();
      res.json({ success: true, message: "Destination updated successfully!", destination });
    } catch (error) {
      
      resjson({ success: false, message: "Error:Destination not updated" });
    }
  };

  const deleteDestListing = async (req, res) => {
    try{
            const {id}=req.params;
            // console.log(id)
            
            const listing=await destListingModel.findById(id);
            // console.log(listing._id);
            
            if(!listing){
                res.json({success:false,message:"Listing not found"});
            }
            // console.log("useris "+ req.user);
            const getProviderId=req.user.id.toString();
            // console.log("pro id is"+ getProviderId);
            
            if(listing.addedBy.toString() !== getProviderId){
               return res.json({success:false,message:"Unauthorized to delete Listing"});
            }
            await reviewModel.findOneAndDelete(listing.reviewOwner);
            await destListingModel.deleteOne({ _id: id });
            res.json({success:true,message:"Listing delete successfully!"})
    
        }catch(error){
            console.log(error);
            res.json({success:false,message:"Listing delete error"});
        }
    }

  export {getDestListings,addDestListing,getListingDetail,editDestListing,deleteDestListing}