import React, { useState, useContext, useEffect,useRef} from "react";
import "./GetHotelListing.css";
import axios from "axios";
import { StoreContext } from "../../../context/StoreContext.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Map from "../../Map/Map.jsx";
import { toast } from "react-toastify";
import compressImage from "../../../utils/compressImage.js";
import { assets } from "../../../assets/assets.js";


const hotelCategories = ["Budget", "3-Star", "4-Star", "5-Star", "Luxury", "Boutique"];
const bedTypes = ["Single", "Double", "Queen", "King"];
const roomAmenitiesOptions = ["TV", "Free WiFi", "Air Conditioning", "Room Service", "Safe", "Balcony", "Coffee Machine"];
const securityFeatureOptions = ["24/7 Security", "CCTV", "Safe Deposit Box", "Fire Alarm"];


const GetHotelListing = () => {
  const { url, token } = useContext(StoreContext);
  const [hotelListings, setHotelListings] = useState([]);
  const [expanded, setExpanded] = useState({}); // keep track of expanded cards
  const [userLocation, setUserLocation] = useState(null)
    const imageRef=useRef(null);

  const [editingId, setEditingId] = useState(null); // Track which listing is being edited
  const [editHotelListing, setEditHotelListing] = useState({
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
    
    // Initialize edit form with listing data
  const handleEditClick = (listing) => {
    setEditingId(listing._id);
    setEditHotelListing({
      hotelName: listing.hotelName || "",
      hotelCategory: listing.hotelCategory || "",
      securityFeatures: listing.securityFeatures || [],
      bedType: listing.roomDetails?.[0]?.bedType || "",
      roomImage: listing.roomDetails?.[0]?.roomImage || [],
      roomAmenities: listing.roomDetails?.[0]?.roomAmenities || [],
      availability: listing.roomDetails?.[0]?.availability !== undefined ? listing.roomDetails[0].availability : true,
      description: listing.description || "",
      breakfastIncluded: listing.breakfastIncluded || false,
      longitude: listing.coordinates?.[0] || "",
      latitude: listing.coordinates?.[1] || "",
      location: listing.location || "",
      country: listing.country || "",
      phone: listing.contactInfo?.phone || "",
      email: listing.contactInfo?.email || "",
      website: listing.contactInfo?.website || "",
      originalPrice: listing.pricing?.originalPrice || "",
      discountedPrice: listing.pricing?.discountedPrice || "",
    });
  };


    const toggleExpand = (id) => {
      setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    
    const listingDeleteHandler = async (id) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this listing?"
      );
      if (!confirmed) return;
      // console.log(id);
      try {
        const response = await axios.delete(`${url}api/hotel/listings/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
    
        if (response.data.success) {
          // console.log(response.data.message);
          toast("Listing delete successfully!");
          setHotelListings((prev) =>
            prev.filter((hotelListings) => hotelListings._id !== id)
          );
        }
      } catch (error) {
        toast.error("Something went wrong");
      
      }
    };
    
   
    
    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false,
    };
    const formatPrice = (amount) => {
        return amount.toLocaleString("en-PK", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      };
    
    useEffect(() => {
      const fetchListings = async () => {
        // console.log(id);
        try {
          const response = await axios.get(`${url}api/hotel/listings`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            setHotelListings(response.data.listing);
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
        if (!navigator.geolocation) {
          toast.warning("Geolocation is not supported by your browser");
          return;
        }
    
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            toast.error("Error getting location", error);
            setUserLocation(null);
          }
        );
      };
    
      fetchListings();
    }, [url, token, setHotelListings]);
    
    console.log(hotelListings);
   
    
    const [longitude = 0, latitude = 0] = Array.isArray(hotelListings.coordinates)
      ? hotelListings.coordinates
      : [0, 0];
    const destination = { lat: latitude, lng: longitude };
    console.log(destination);

      // edit logic
     const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        if (type === "checkbox") {
          setEditHotelListing({ ...editHotelListing, [name]: checked });
        } else {
          setEditHotelListing({ ...editHotelListing, [name]: value });
        }
      };
    
      const handleImageChange = (e) => {
        setImages([...e.target.files]);
      };
    
      const handleMultiSelect = (name, value) => {
        setEditHotelListing((prev) => {
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
              
        try {
    
    
          //handle price error
          const { originalPrice, discountedPrice } = editHotelListing;
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
          
        editHotelListing.roomImage?.forEach((imageUrl) => {
  formData.append('imagesToDelete', imageUrl); 
});
 Object.entries({ ...editHotelListing }).forEach(([key, value]) => {
      // Handle array fields properly (for amenities, features etc.)
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    });
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}          const response = await axios.put(`${url}api/hotel/listings/${editingId}`, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`,
            },
          });
      
          if (response.data.success) {
            console.log(response.data);
            toast.success("Listing update successfully!");
    
            setEditHotelListing({
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
          
          } 
        } catch (error) {
console.error("Update error:", error.response?.data || error.message);
    toast.error(`Update failed: ${error.response?.data?.message || error.message}`);    
        }
      };

    const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="get-hotel-listing">
      <h2 className="text-2xl font-bold text-[#1EBEB1] text-center mb-8">
        All Listings
      </h2>
       {editingId &&  (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
       <div className="bg-white rounded-lg p-10 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      
      <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold text-[#1EBEB1]">Edit Hotel Listing</h2>
              <button 
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <img className="w-[16px]" src={assets.cross_icon} alt="" />
              </button>
            </div>
      <form onSubmit={handleSubmit} className=" add-hotel-listing-form grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        {/* Hotel Name */}
        <div>
          <label className="add-hotel-listing-form-label font-semibold">Hotel Name</label>
          <input type="text" placeholder="E.g. Serena Hotel" name="hotelName" value={editHotelListing.hotelName} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        {/* Hotel Category */}
        <div>
          <label className="add-hotel-listing-form-label font-semibold">Hotel Category</label>
          <select name="hotelCategory" value={editHotelListing.hotelCategory} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
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
                  checked={editHotelListing.securityFeatures.includes(item)}
                  onChange={() => handleMultiSelect("securityFeatures", item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>


        {/* Room Image */}
        <div>
        <img className="w-[150px]" src={editHotelListing.roomImage} alt="" />
          <label className="add-hotel-listing-form-label font-semibold">Room Images Max (5)</label>
          <input type="file" name="roomImage" multiple accept="image/*" ref={imageRef} onChange={handleImageChange} className="w-full px-4 py-2 border rounded"  />
          <small className="text-gray-500">*Supported formats: JPG, PNG, JPEG</small>
        
        </div>

        {/* Bed Type */}
        <div>
          <label className="add-hotel-listing-form-label w-full font-semibold">Bed Type</label>
          <select name="bedType" value={editHotelListing.bedType} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value="">Select Bed Type</option>
            {bedTypes.map((bed) => (
              <option key={bed} value={bed}>{bed}</option>
            ))}
          </select>
        </div>

         {/* Availability  */}
         <div>
          <label className="add-hotel-listing-form-label font-semibold block">Availability</label>
          <select name="availability" value={editHotelListing.availability} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
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
                  checked={editHotelListing.roomAmenities.includes(item)}
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
          <textarea name="description" value={editHotelListing.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border rounded" />
        </div>

        {/* Location and Contact */}
        <div>
          <label className="add-hotel-listing-form-label font-semibold">Location</label>
          <input type="text" placeholder="E.g. G-5, Islamabad" name="location" value={editHotelListing.location} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        <h2 className="add-hotel-listing-form-label text-[22px] mb-0 font-semibold md:col-span-2">Coordinates</h2>
        <div>
            <label className="add-hotel-listing-form-label font-semibold">Longitude</label>
            <input type="number" placeholder="E.g. 74.6500° E" name="longitude" 
              value={editHotelListing.longitude} onChange={handleChange} required 
              className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="add-hotel-listing-form-label font-semibold">Latitude</label>
            <input type="number" placeholder="E.g. 36.3167° N" name="latitude" 
              value={editHotelListing.latitude} onChange={handleChange} required 
              className="w-full px-4 py-2 border rounded" />
          </div>

        <div>
          <label className="add-hotel-listing-form-label font-semibold">Country</label>
          <input type="text" placeholder="E.g. Pakistan" name="country" value={editHotelListing.country} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        {/* Pricing */}
        <div>
          <label className="add-hotel-listing-form-label font-semibold">Original Price</label>
          <input type="number" placeholder="0" name="originalPrice" value={editHotelListing.originalPrice} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label className="add-hotel-listing-form-label font-semibold">Discounted Price</label>
          <input type="number" placeholder="0" name="discountedPrice" value={editHotelListing.discountedPrice} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        {/* Contact Info */}
        <h3 className=" md:col-span-2 mt-4 font-semibold text-2xl">Contact Info</h3>
          <input type="text" name="phone" value={editHotelListing.phone}
            onChange={handleChange} placeholder="Phone" required className="w-full px-4 py-2 border rounded" />
          <input type="email" name="email" value={editHotelListing.email}
            onChange={handleChange} placeholder="Email" required className=" w-full px-4 py-2 border rounded" />
          <input type="text" name="website" value={editHotelListing.website}
            onChange={handleChange} placeholder="Website (optional)"  className=" md:col-span-2 w-full px-4 py-2 border rounded" />


        

        {/* Breakfast */}
        <div className="md:col-span-2 flex items-center gap-2 mt-2">
          <input type="checkbox" name="breakfastIncluded" checked={editHotelListing.breakfastIncluded} onChange={handleChange} />
          <label className="add-hotel-listing-form-label font-semibold">Breakfast Included</label>
        </div>

        {/* Submit */}
       <div className="md:col-span-2 flex justify-end gap-4 mt-6">
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-[#1EBEB1] hover:bg-[#149d95] text-white rounded"
              >
                Update Listing
              </button>
            </div>
      </form>
      </div>
    </div>
  )}
      {hotelListings.length > 0 ? (
        <div className="listing-grid">
          {hotelListings.map((listing) => (
            <div key={listing._id} className="listing-card">
              {/* Image */}
              <div className="image-slider-container">
                <Slider {...sliderSettings}>
                  {listing.roomDetails &&
                    listing.roomDetails.map((item, index) => (
                      <div key={index} className="slider-image-wrapper">
                        {item.roomImage &&
                          item.roomImage.map((img, imgIndex) => (
                            <img
                              key={imgIndex}
                              className="listing-image"
                              src={img}
                              alt={`HOTEL ${imgIndex + 1}`}
                            />
                          ))}
                      </div>
                    ))}
                </Slider>
              </div>

              {/* Basic Info */}
              <div className="listing-basic">
                <h3 className="text-[#1EBEB1]">
                  {listing.hotelName?.length > 25
                    ? `${listing.hotelName.slice(0, 25)}...`
                    : listing.hotelName}
                </h3>
                <p>
                  {listing.hotelCategory} |{" "}
                  <LocationOnIcon sx={{ fontSize: "large" }} />
                  <span title={listing.hotelName}>
                    {listing.location?.length > 10? `${listing.hotelName.slice(0, 15)}...` : listing.location}, {listing.country}</span>
                </p>
                <p>Breakfast: {listing.breakfastIncluded ? "Yes" : "No"}</p>

                {/* Icons */}
                <div className="listing-actions">
                  <span onClick={() =>handleEditClick(listing)}>
                    <EditIcon className="icon" sx={{ color: "#1EBEB1" }} />
                  </span>
                  <span onClick={() => listingDeleteHandler(listing._id)}>
                    <DeleteIcon className="icon" sx={{ color: "red" }} />
                  </span>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => toggleExpand(listing._id)}
                  className="expand-btn"
                >
                  {expanded[listing._id] ? (
                    <>
                      Collapse <ExpandMoreIcon />
                    </>
                  ) : (
                    <>
                      Expand <KeyboardArrowUpIcon />
                    </>
                  )}
                </button>
              </div>

              {/* Expandable Section */}
              {expanded[listing._id] && (
                <div className="listing-expanded">
                  <p>
                    <strong>Description:</strong> {listing.description}
                  </p>
                  <p>
                    <strong>Security Features:</strong>{" "}
                    {listing.securityFeatures.join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Original Price:</strong>{" "}
                    <i className="line-through">
                      {" "}
                      Rs. {formatPrice(listing.pricing.originalPrice)}
                    </i>
                  </p>
                  <p>
                    <strong>Discounted Price:</strong> Rs.{" "}
                    {formatPrice(listing.pricing.discountedPrice)}
                  </p>
                  <hr />
                  <div>
                    <h1>
                      <strong>Rooms details:</strong>
                    </h1>
                    {listing.roomDetails.map((room, i) => (
                      <div key={i} className="room-detail">
                        <p>
                          <strong>Bed Type:</strong> {room.bedType}
                        </p>
                        <p>
                          <strong>Amenities:</strong>{" "}
                          {room.roomAmenities.join(", ")}
                        </p>
                        <p>
                          <strong>Availability:</strong>{" "}
                          {room.availability ? "Available" : "Not Available"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <h1>
                    <strong>Contact details:</strong>
                  </h1>
                  <div className="room-detail">
                    <p>
                      <strong>Email:</strong> {listing.contactInfo.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {listing.contactInfo.phone}
                    </p>
                    <p>
                      <strong>Website:</strong>{" "}
                      {listing.contactInfo.website || "N/A"}
                    </p>
                  </div>

                  {userLocation && destination.lat && destination.lng ? (
                    <Map
                      userLocation={userLocation}
                      destination={destination}
                    />
                  ) : (
                    <p>Loading map...</p>
                  )}

                  <hr />

                  <p className="text-sm mt-3">
                    <strong>Created At:</strong>{" "}
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No hotel listings available.</p>
      )}
    </div>
  );
};

export default GetHotelListing;
