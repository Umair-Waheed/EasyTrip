import axios from "axios";
import "./AddHotelListing.css"
// import imageCompression from "browser-image-compression";
import React, { useState,useContext,useRef } from "react";
import { StoreContext } from "../../../context/StoreContext";
import compressImage from "../../../utils/compressImage.js";
import { toast } from "react-toastify";

const hotelCategories = ["Budget", "3-Star", "4-Star", "5-Star", "Luxury", "Boutique"];
const bedTypes = ["Single", "Double", "Queen", "King"];
const roomAmenitiesOptions = ["TV", "Free WiFi", "Air Conditioning", "Room Service", "Safe", "Balcony", "Coffee Machine"];
const securityFeatureOptions = ["24/7 Security", "CCTV", "Safe Deposit Box", "Fire Alarm"];

const AddHotelListing = () => {
  const {url,token}=useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef=useRef(null);
  const [hotelListingData, setHotelListingData] = useState({
    hotelName: "",
    hotelCategory: "",
    securityFeatures: [],
    roomImage: null,
    bedType: "",
    roomAmenities: [],
    availability: true,
    description: "",
    breakfastIncluded: false,
    longitude:"",
    latitude:"",
    location: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    originalPrice: "",
    discountedPrice: "",
  });
    const [images, setImages] = useState([]);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setHotelListingData({ ...hotelListingData, [name]: checked });
    } else {
      setHotelListingData({ ...hotelListingData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleMultiSelect = (name, value) => {
    setHotelListingData((prev) => {
      const values = prev[name];
      if (values.includes(value)) {
        return { ...prev, [name]: values.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...values, value] };
      }
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {


      //handle price error
      const { originalPrice, discountedPrice } = hotelListingData;
      if (parseFloat(discountedPrice) >= parseFloat(originalPrice)) {
        toast.warning("Discounted price must be less than the original price.");
        return;
      }
      
      const formData = new FormData();

      const compressedImages = [];
      for(const image of images) {
        const compressedImage = await compressImage(image);
        compressedImages.push(compressedImage);
      }
      compressedImages.forEach((image) => formData.append('roomImage', image));
     
  
      // Append simple fields
      formData.append("hotelName", hotelListingData.hotelName);
      formData.append("hotelCategory", hotelListingData.hotelCategory);
      formData.append("description", hotelListingData.description);
      formData.append("breakfastIncluded", hotelListingData.breakfastIncluded);
      formData.append("longitude", hotelListingData.longitude);
      formData.append("latitude", hotelListingData.latitude);
      formData.append("location", hotelListingData.location);
      formData.append("country", hotelListingData.country);
  
      // Contact info
      formData.append("phone", hotelListingData.phone);
      formData.append("email", hotelListingData.email);
      formData.append("website", hotelListingData.website);
  
      // Pricing
      formData.append("originalPrice", hotelListingData.originalPrice);
      formData.append("discountedPrice", hotelListingData.discountedPrice);
  
      // Room Details
      formData.append("bedType", hotelListingData.bedType);
      formData.append("availability", hotelListingData.availability);
  
      // Arrays or objects need to be stringified
      formData.append("roomAmenities", JSON.stringify(hotelListingData.roomAmenities));
      formData.append("securityFeatures", JSON.stringify(hotelListingData.securityFeatures));

  
      const response = await axios.post(`${url}api/hotel/listings`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.success) {
        console.log(response.data);
        toast.success("Listing created successfully!");

        setHotelListingData({
          hotelName: "",
          hotelCategory: "",
          securityFeatures: [],
          roomImage: null,
          bedType: "",
          roomAmenities: [],
          availability: true,
          description: "",
          breakfastIncluded: false,
          longitude:"",
          latitude:"",
          location: "",
          country: "",
          phone: "",
          email: "",
          website: "",
          originalPrice: "",
          discountedPrice: "",
        });
        //for clear image 
        setImages([]);
      if (imageRef.current) {
        imageRef.current.value = '';
      }
      setIsLoading(false);

      } 
    } catch (error) {
      toast.error("Submit error:", error);

    }
  };
  
  

  return (
    <div className=" add-hotel-listing-container max-w-4xl mx-auto p-8 mt-4 bg-white shadow-xl rounded">
      <h2 className=" text-3xl text-[#1EBEB1] font-bold mb-8 text-center">Add New Hotel Listing</h2>
      <form onSubmit={handleSubmit} className=" add-hotel-listing-form grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Hotel Name */}
        <div>
          <label className="add-hotel-listing-form-label font-semibold">Hotel Name</label>
          <input type="text" placeholder="E.g. Serena Hotel" name="hotelName" value={hotelListingData.hotelName} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        {/* Hotel Category */}
        <div>
          <label className="add-hotel-listing-form-label font-semibold">Hotel Category</label>
          <select name="hotelCategory" value={hotelListingData.hotelCategory} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value="">Select Category</option>
            {hotelCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Security Features */}
        <div>
          <label className="add-hotel-listing-form-label font-semibold block mb-1">Security Features</label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {securityFeatureOptions.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hotelListingData.securityFeatures.includes(item)}
                  onChange={() => handleMultiSelect("securityFeatures", item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>


        {/* Room Image */}
        <div>
          <label className="add-hotel-listing-form-label font-semibold">Room Images Max (5)</label>
          <input type="file" name="roomImage" multiple accept="image/*" ref={imageRef} onChange={handleImageChange} className="w-full px-4 py-2 border rounded"  />
          <small className="text-gray-500">*Supported formats: JPG, PNG, JPEG</small>
        
        </div>

        {/* Bed Type */}
        <div>
          <label className="add-hotel-listing-form-label w-full font-semibold">Bed Type</label>
          <select name="bedType" value={hotelListingData.bedType} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value="">Select Bed Type</option>
            {bedTypes.map((bed) => (
              <option key={bed} value={bed}>{bed}</option>
            ))}
          </select>
        </div>

         {/* Availability  */}
         <div>
          <label className="add-hotel-listing-form-label font-semibold block">Availability</label>
          <select name="availability" value={hotelListingData.availability} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value={true}>Available</option>
            <option value={false}>Unavailable</option>
          </select>
        </div>


        {/* Room Amenities */}
        <div className="md:col-span-2">
          <label className="add-hotel-listing-form-label font-semibold block mb-1">Room Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {roomAmenitiesOptions.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hotelListingData.roomAmenities.includes(item)}
                  onChange={() => handleMultiSelect("roomAmenities", item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="add-hotel-listing-form-label font-semibold">Description</label>
          <textarea name="description" value={hotelListingData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border rounded" />
        </div>

        {/* Location and Contact */}
        <div>
          <label className="add-hotel-listing-form-label font-semibold">Location</label>
          <input type="text" placeholder="E.g. G-5, Islamabad" name="location" value={hotelListingData.location} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        <h2 className="add-hotel-listing-form-label text-[22px] mb-0 font-semibold md:col-span-2">Coordinates</h2>
        <div>
            <label className="add-hotel-listing-form-label font-semibold">Longitude</label>
            <input type="number" placeholder="E.g. 74.6500° E" name="longitude" 
              value={hotelListingData.longitude} onChange={handleChange} required 
              className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="add-hotel-listing-form-label font-semibold">Latitude</label>
            <input type="number" placeholder="E.g. 36.3167° N" name="latitude" 
              value={hotelListingData.latitude} onChange={handleChange} required 
              className="w-full px-4 py-2 border rounded" />
          </div>

        <div>
          <label className="add-hotel-listing-form-label font-semibold">Country</label>
          <input type="text" placeholder="E.g. Pakistan" name="country" value={hotelListingData.country} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        {/* Pricing */}
        <div>
          <label className="add-hotel-listing-form-label font-semibold">Original Price</label>
          <input type="number" placeholder="0" name="originalPrice" value={hotelListingData.originalPrice} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label className="add-hotel-listing-form-label font-semibold">Discounted Price</label>
          <input type="number" placeholder="0" name="discountedPrice" value={hotelListingData.discountedPrice} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        {/* Contact Info */}
        <h3 className=" md:col-span-2 mt-4 font-semibold text-2xl">Contact Info</h3>
          <input type="text" name="phone" value={hotelListingData.phone}
            onChange={handleChange} placeholder="Phone" required className="w-full px-4 py-2 border rounded" />
          <input type="email" name="email" value={hotelListingData.email}
            onChange={handleChange} placeholder="Email" required className=" w-full px-4 py-2 border rounded" />
          <input type="text" name="website" value={hotelListingData.website}
            onChange={handleChange} placeholder="Website (optional)"  className=" md:col-span-2 w-full px-4 py-2 border rounded" />


        

        {/* Breakfast */}
        <div className="md:col-span-2 flex items-center gap-2 mt-2">
          <input type="checkbox" name="breakfastIncluded" checked={hotelListingData.breakfastIncluded} onChange={handleChange} />
          <label className="add-hotel-listing-form-label font-semibold">Breakfast Included</label>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-center mt-6">
          <button type="submit" className="w-full bg-[#1EBEB1] hover:bg-[#149d95] text-white py-3  rounded mt-4">
            Submit Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHotelListing;
