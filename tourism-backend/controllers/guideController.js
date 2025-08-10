import guideListingModel from "../models/guideServiceListingsModel.js";
import reviewModel from "../models/reviewsModel.js";

//add new listing
const addListing = async (req, res) => {
  try {
    const {
      guideName,
      expertise,
      location,
      availability,
      phone,
      email,
      website,
      languages,
      description,
    } = req.body;
    // user info in req.user
    const serviceProviderId = req.user.id;

    const pricing = JSON.parse(req.body.pricing || "{}");

    let imageUrl = "";
    let imageName = "";

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      imageUrl = String(req.uploadedImages[0].url);
      imageName = String(req.uploadedImages[0].filename);

      console.log("Image URL:", imageUrl);
      console.log("Image Filename:", imageName);
    }

    const newGuideListing = new guideListingModel({
      providerId: serviceProviderId,
      guideName,
      expertise,
      location,
      availability,
      pricing: {
        perHour: pricing.perHour,
        perDay: pricing.perDay,
        discountPercentage: pricing.discountPercentage,
        pricingUnit: pricing.pricingUnit,
      },
      languages,
      description,
      guideImage: {
        url: imageUrl,
        filename: imageName,
      },
      contactInfo: {
        phone,
        email,
        website,
      },
    });
    await newGuideListing.save();
    res.json({ success: true, message: "Guide listing created!" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Listing add error" });
  }
};

//edit or update hotel listing
const updateListing = async (req, res) => {
  // console.log("controller call");
  // console.log(req.body);
  try {
    const {
      guideName,
      expertise,
      location,
      availability,
      phone,
      email,
      website,
      languages,
      description,
    } = req.body;
    console.log(
      guideName,
      expertise,
      location,
      availability,
      phone,
      email,
      website,
      languages,
      description
    );
    const pricing = JSON.parse(req.body.pricing || "{}");
    console.log(pricing);
    const { id } = req.params;

    const listing = await guideListingModel.findById(id);
    console.log("old listing " + listing);
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

    let imageUrl = "";
    let imageName = "";

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      const imageUrl = String(req.uploadedImages[0].url);
      const imageName = String(req.uploadedImages[0].filename);

      listing.guideImage = {
        url: imageUrl,
        filename: imageName,
      };
    }

    listing.guideName = guideName;
    listing.expertise = expertise;
    listing.location = location;
    listing.availability = availability;
    listing.pricing = {
      perHour: pricing.perHour,
      perDay: pricing.perDay,
      discountPercentage: pricing.discountPercentage,
      pricingUnit: pricing.pricingUnit,
    };
    listing.languages = languages;
    listing.description = description;
    listing.contactInfo = {
      phone,
      email,
      website,
    };
    console.log("listing save " + listing);

    await listing.save();
    res.json({ success: true, message: "Listing updated successfully!" });
  } catch (error) {
    res.json({
      success: false,
      message: "Error saving listing",
      error: error.message,
    });
  }
};

//delete hotel listing
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await guideListingModel.findById(id);
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
    await guideListingModel.deleteOne({ _id: id });
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

    const listing = await guideListingModel.find({ providerId: getProviderId });

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

    const listing = await guideListingModel
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
