import transportListingModel from "../models/transportServiceListingsModel.js";
import reviewModel from "../models/reviewsModel.js"

//add new hotel listing
const addListing = async (req, res) => {
  try {
    const {
      vehicleType,
      description,
      location,
      country,
      fuelIncluded,
      phone,
      email,
      website,
    } = req.body;
    console.log(vehicleType,
      description,
      location,
      country,
      fuelIncluded,
      phone,
      email,
      website)
    // Parse nested objects sent as strings
    const vehicleDetail = JSON.parse(req.body.vehicleDetail || "{}");
    const pricing = JSON.parse(req.body.pricing || "{}");
    const availability = JSON.parse(req.body.availability || "[]");
    const features = JSON.parse(req.body.features || "[]");
    console.log(vehicleDetail,pricing,availability,features);
    const providerId = req.user.id;
   let imageUrl = '';
let imageName = '';

if (req.uploadedImages && req.uploadedImages.length > 0) {
  imageUrl = String(req.uploadedImages[0].url);       // First image's URL as string
  imageName = String(req.uploadedImages[0].filename); // First image's filename as string

  console.log("Image URL:", imageUrl);
  console.log("Image Filename:", imageName);
}

    const newTransportListing = new transportListingModel({
      providerId,
      vehicleType,

      vehicleDetail: {
        name: vehicleDetail.name,
        model: vehicleDetail.model,
        capacity: vehicleDetail.capacity,
        fuelType: vehicleDetail.fuelType,
        transmission: vehicleDetail.transmission,
      },

      vehicleImage: {
        url: imageUrl,
        filename: imageName,
      },
      description,
      location,
      country,
      fuelIncluded,
      pricing: {
        perHour: pricing.perHour,
        perDay: pricing.perDay,
        discountPercentage: pricing.discountPercentage,
        pricingUnit: pricing.pricingUnit,
      },
      availability,
      features,
      contactInfo: {
        phone,
        email,
        website,
      },
    });
    console.log(newTransportListing);

    await newTransportListing.save();
    res.json({ success: true, message: "Transport listing created!" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Listing add error" });
  }
};

//edit or update hotel listing
const updateListing = async (req, res) => {
   console.log("working")
        console.log("Body:", req.body);
        // const body = Object.assign({}, req.body);
        try {
          
         const {
      vehicleType,
      description,
      location,
      country,
      fuelIncluded,
      phone,
      email,
      website,
    } = req.body;
          console.log(vehicleType,
            description,
            location,
            country,
            fuelIncluded,
            phone,
            email,
            website)
         const vehicleDetail = JSON.parse(req.body.vehicleDetail || "{}");
    const pricing = JSON.parse(req.body.pricing || "{}");
    const availability = JSON.parse(req.body.availability || "[]");
    const features = JSON.parse(req.body.features || "[]");
    console.log(vehicleDetail,pricing,availability,features);
            
       const { id } = req.params;

    const listing = await transportListingModel.findById(id);

    const getProviderId = req.user.id; // get from frontend

    if (!listing) {
      return res.json({ success: false, message: "Listing not found" });
    }
    if (listing.providerId.toString() !== getProviderId) {
      //compare with model provider id
      return res.json({
        success: false,
        message: "Unauthorized to update listing",
      });
    }

 let imageUrl = '';
  let imageName = '';

if (req.uploadedImages && req.uploadedImages.length > 0) {
  imageUrl = String(req.uploadedImages[0].url);       // First image's URL as string
  imageName = String(req.uploadedImages[0].filename); // First image's filename as string

  console.log("Image URL:", imageUrl);
  console.log("Image Filename:", imageName);
}


       listing.vehicleType = vehicleType;
    listing.vehicleDetail = {
      name: vehicleDetail.name,
      model: vehicleDetail.model,
      capacity: vehicleDetail.capacity,
      fuelType: vehicleDetail.fuelType,
      transmission: vehicleDetail.transmission,
    };
    listing.vehicleImage = {
      url: imageUrl,
      filename: imageName, // Optional: if you're storing filenames separately
    };
    listing.description = description;
    listing.location = location;
    listing.country = country;
    listing.fuelIncluded = fuelIncluded;
    listing.pricing = {
      perHour: pricing.perHour,
      perDay: pricing.perDay,
      discountPercentage: pricing.discountPercentage,
      pricingUnit: pricing.pricingUnit,
    };
    listing.availability = availability;
    listing.features = features;
    listing.contactInfo = {
      phone,
      email,
      website,
    };

            await listing.save();
    res.json({ success: true, message: "Listing updated successfully!" });
  } catch (error) {
    res.json({ success: false, message: "Listing update error" });
  }
};

//delete hotel listing
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await transportListingModel.findById(id);
    console.log(listing._id);

    if (!listing) {
      res.json({ success: false, message: "Listing not found" });
    }

    const getProviderId = req.user.id.toString();

    if (listing.providerId.toString() !== getProviderId) {
      return res.json({
        success: false,
        message: "Unauthorized to delete Listing",
      });
    }
    await reviewModel.findOneAndDelete(listing.reviewOwner);
    await transportListingModel.deleteOne({ _id: id });
    res.json({ success: true, message: "Listing delete successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Listing delete error" });
  }
};

//get all listings
const getAllListings = async (req, res) => {
  try {
    const getProviderId = req.user.id; // get from frontend

    const listing = await transportListingModel.find({
      providerId: getProviderId,
    });

    if (listing.length === 0) {
      return res.json({ success: false, message: "No listing found" });
    }

    res.json({ success: true, listing });
  } catch (error) {
    res.json({ success: false, message: "Error in getting listings" });
  }
};

//getlisting details
const getListingDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await transportListingModel
      .findById(id)
      .populate("providerId", "name email contactNumber");

    if (!listing) {
      return res.json({ success: false, message: "listing not found" });
    }

    res.json({ success: true, listing });
  } catch (error) {
    res.json({ success: false, message: "Error in fetching details" });
  }
};

export {
  addListing,
  updateListing,
  deleteListing,
  getAllListings,
  getListingDetail,
};
