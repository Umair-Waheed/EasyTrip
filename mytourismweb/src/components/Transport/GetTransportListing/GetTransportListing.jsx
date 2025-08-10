import React, { useState, useContext, useEffect,useRef } from "react";
import axios from "axios";
import "./GetTransportListing.css";
import { StoreContext } from "../../../context/StoreContext.jsx";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { toast } from "react-toastify";
import compressImage from "../../../utils/compressImage.js";
import { assets } from "../../../assets/assets.js";

const vehicleTypes = ["Sedan", "SUV", "Van", "Bus", "Jeep"];
const fuelTypes = ["Petrol", "Diesel", "Electric"];
const featuresOptions = ["AC", "Driver Included", "Luggage Rack", "WiFi", "GPS"];

const GetTransportListing = () => {
  const { url, token } = useContext(StoreContext);
  const [transportListings, setTransportListings] = useState([]);
  const [expanded, setExpanded] = useState({});
  const imageRef=useRef(null);
  
   const [editingId, setEditingId] = useState(null);
   const [editTransportListing, setEditTransportListing] = useState({
       vehicleType: "",
       vehicleDetail: { name: "", model: "", capacity: "", fuelType: "Petrol", transmission: "Manual" },
       fuelIncluded:false,
       description: "",
       location: "",
       country: "",
       pricing: { perHour: "", perDay: "", discountPercentage: "", pricingUnit: "perHour" },
       availability: { status: true, availableFrom: "08:00 AM", availableTo: "08:00 PM" },
       features: [],
       contactInfo: { phone: "", email: "", website: "" },
       vehicleImage: null,
     });

      const [images, setImages] = useState([]);

       const handleEditClick = (listing) => {
    setEditingId(listing._id);
    setEditTransportListing({
       vehicleType: listing.vehicleType || "",
    
    vehicleDetail: {
      name: listing.vehicleDetail?.name || "",
      model: listing.vehicleDetail?.model || "",
      capacity: listing.vehicleDetail?.capacity || "",
      fuelType: listing.vehicleDetail?.fuelType || "Petrol",
      transmission: listing.vehicleDetail?.transmission || "Manual"
    },

    fuelIncluded: listing.fuelIncluded ?? false,

    description: listing.description || "",
    location: listing.location || "",
    country: listing.country || "",

    pricing: {
      perHour: listing.pricing?.perHour || "",
      perDay: listing.pricing?.perDay || "",
      discountPercentage: listing.pricing?.discountPercentage || "",
      pricingUnit: listing.pricing?.pricingUnit || "perHour"
    },

    availability: {
      status: listing.availability?.status ?? true,
      availableFrom: listing.availability?.availableFrom || "08:00",
      availableTo: listing.availability?.availableTo || "20:00"
    },

    features: listing.features || [],

    contactInfo: {
      phone: listing.contactInfo?.phone || "",
      email: listing.contactInfo?.email || "",
      website: listing.contactInfo?.website || ""
    },

    vehicleImage: listing.vehicleImage?.url || null
    });
  };
     

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  
  const hourFormat = (time) => {
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const listingDeleteHandler=async (id)=>{
      const confirmed = window.confirm("Are you sure you want to delete this listing?");
      if (!confirmed) return;
      console.log(id);
      try {
        const response=await axios.delete(`${url}api/transport/listings/${id}`,{
          headers:{
            authorization:`Bearer ${token}`,
          },
        });
  
        if(response.data.success){
          // console.log(response.data.message);
          toast("Listing delete successfully!");
          setTransportListings(prev => prev.filter(transportListings => transportListings._id !== id));
  
        }
        
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`${url}api/transport/listings`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          console.log(response.data);
          setTransportListings(response.data.listing);
        }
      } catch (error) {
        toast.error("Something went wrong", error.message);
      }
    };
    fetchListings();
  }, [url, token,setTransportListings]);
  
  // edit logic
    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // nested vehicleDetail or contactInfo or availability
    if (name.includes(".")) {
      const [group, key] = name.split(".");
      setEditTransportListing(editTransportListing => ({
        ...editTransportListing,
        [group]: {
          ...editTransportListing[group],
          [key]: type === "checkbox" ? checked : value
        }
      }));
      return;
    }

    // pricing nested
    if (name.startsWith("pricing.")) {
      const key = name.split(".")[1];
      setEditTransportListing(editTransportListing => ({
        ...editTransportListing,
        pricing: {
          ...editTransportListing.pricing,
          [key]: value
        }
      }));
      return;
    }

    // features multi-select
    if (name === "features") {
      const next = [...editTransportListing.features];
      const idx = next.indexOf(value);
      if (idx > -1) next.splice(idx, 1);
      else next.push(value);
      setEditTransportListing(editTransportListing => ({ ...editTransportListing, features: next }));
      return;
    }

    //handle boolean for fuel 
    if (name === "fuelIncluded") {
      setEditTransportListing(editTransportListing => ({ ...editTransportListing, [name]: value === "true" }));
      return;
    }

    // checkbox for availability.status
    if (type === "checkbox") {
      setEditTransportListing(editTransportListing => ({
        ...editTransportListing,
        [name]: checked
      }));
      return;
    }

    // simple text/number
    setEditTransportListing(editTransportListing => ({ ...editTransportListing, [name]: value }));
  };

     const handleImageChange = (e) => {
        setImages([...e.target.files]);
      };
    
    
      const handleSubmit = async (e) => {
              e.preventDefault();
                    
              try {
          
          
                //handle price error
                if (!editTransportListing.vehicleImage) return alert("Please upload a vehicle image.");
                   if (Number(editTransportListing.pricing.discountPercentage) >= Number(editTransportListing.pricing[editTransportListing.pricing.pricingUnit])) {
                     return toast.warning("Discount must be less than the selected base price.");
                   }
                
                const formData = new FormData();
                
                 const compressedImages = [];
                           for(const image of images) {
                               const compressedImage = await compressImage(image);
                               compressedImages.push(compressedImage);
                           }
                          {images.map(img=>console.log("new image si "+img))}
                       compressedImages.forEach((image) => formData.append('vehicleImage', image));
                          {compressedImages.map(img=>console.log("new com image si "+img))}

if (images.length > 0 && editTransportListing.vehicleImage) {
  formData.append('imagesToDelete', editTransportListing.vehicleImage);
}              
      //  Object.entries({ ...editTransportListing }).forEach(([key, value]) => {
      //       // Handle array fields properly (for amenities, features etc.)
      //       if (Array.isArray(value)) {
      //         value.forEach((item) => formData.append(`${key}[]`, item));
      //       } else {
      //         formData.append(key, value);
      //       }
      //     });

      formData.append("vehicleType", editTransportListing.vehicleType);
    formData.append("vehicleDetail", JSON.stringify(editTransportListing.vehicleDetail));
    formData.append("description", editTransportListing.description);
    formData.append("location", editTransportListing.location);
    formData.append("country", editTransportListing.country);
    formData.append("fuelIncluded", editTransportListing.fuelIncluded);
    formData.append("pricing", JSON.stringify(editTransportListing.pricing));
    formData.append("availability", JSON.stringify(editTransportListing.availability));
    formData.append("features", JSON.stringify(editTransportListing.features));
    formData.append("phone", editTransportListing.contactInfo.phone);
    formData.append("email", editTransportListing.contactInfo.email);
    formData.append("website", editTransportListing.contactInfo.website);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }          
      const response = await axios.put(`${url}api/transport/listings/${editingId}`, formData, {
                  headers: {
                     "Content-Type": "multipart/form-data",
                    authorization: `Bearer ${token}`,
                  },
                });
            
                if (response.data.success) {
                  console.log(response.data);
                  toast.success("Listing update successfully!");
          
               setEditTransportListing({
                 vehicleType: "",
       vehicleDetail: { name: "", model: "", capacity: "", fuelType: "Petrol", transmission: "Manual" },
       fuelIncluded:false,
       description: "",
       location: "",
       country: "",
       pricing: { perHour: "", perDay: "", discountPercentage: "", pricingUnit: "perHour" },
       availability: { status: true, availableFrom: "08:00 AM", availableTo: "08:00 PM" },
       features: [],
       contactInfo: { phone: "", email: "", website: "" },
       vehicleImage: null,
               })
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
    <div className='get-transport-listing'>
          <h2 className='text-2xl font-bold text-[#1EBEB1] text-center mb-8'>All Listings</h2>
          {editingId &&  (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-lg p-10 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                
                <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-2xl font-bold text-[#1EBEB1]">Edit Transport Listing</h2>
                        <button 
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <img className="w-[16px]" src={assets.cross_icon} alt="" />
                        </button>
                      </div>
                <form onSubmit={handleSubmit} className=" add-hotel-listing-form grid grid-cols-1  gap-6 mt-10">
          
                   <div>
          <label className="font-semibold">Vehicle Type</label>
          <select name="vehicleType" value={editTransportListing.vehicleType} onChange={handleChange}  className="w-full px-4 py-2 border rounded">
            <option value="">Select…</option>
            {vehicleTypes.map(v => (<option key={v} value={v}>{v}</option>))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Name</label>
            <input name="vehicleDetail.name" value={editTransportListing.vehicleDetail.name} onChange={handleChange}
              className="w-full px-4 py-2 border rounded" placeholder="E.g. Toyota Hiace" />
          </div>
          <div>
            <label className="font-semibold">Model</label>
            <input name="vehicleDetail.model" value={editTransportListing.vehicleDetail.model} onChange={handleChange}
              className="w-full px-4 py-2 border rounded" placeholder="E.g. 2022" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-semibold">Capacity</label>
            <input type="number" name="vehicleDetail.capacity" value={editTransportListing.vehicleDetail.capacity}
              onChange={handleChange} className="w-full px-4 py-2 border rounded"  placeholder="Seats" />
          </div>
          <div>
            <label className="font-semibold">Fuel Type</label>
            <select name="vehicleDetail.fuelType" value={editTransportListing.vehicleDetail.fuelType}  onChange={handleChange}
              className="w-full px-4 py-2 border rounded">
              {fuelTypes.map(f => (<option key={f} value={f}>{f}</option>))}
            </select>
          </div>
          <div>
          <label className="font-semibold">Fuel Included</label>
          <select name="fuelIncluded" value={editTransportListing.fuelIncluded} onChange={handleChange}  className="w-full px-4 py-2 border rounded">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        </div>
          <div>
          <img className="w-[150px]" src={editTransportListing.vehicleImage} alt="" />

          <label className="font-semibold">Vehicle Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} ref={imageRef}
            name="vehicleImage"  className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Transmission</label>
          <select name="vehicleDetail.transmission" value={editTransportListing.vehicleDetail.transmission} onChange={handleChange}
             className="w-full px-4 py-2 border rounded">
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        {/* Pricing Unit Toggle */}
        {/* <div>
          <label className="font-semibold">Pricing Unit</label>
          <select value={editTransportListing.pricing.pricingUnit} onChange={handlePricingUnitChange}
             className="w-full px-4 py-2 border rounded">
            <option value="perHour" >Per Hour</option>
            <option value="perDay" >Per Day</option>
          </select>
        </div> */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Price Per Hour</label>
            <input type="number" name="pricing.perHour" placeholder="0" value={editTransportListing.pricing.perHour}
                onChange={handleChange}
              // disabled={editTransportListing.pricing.pricingUnit !== "perHour"}
              className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
          </div>
          <div>
            <label className="font-semibold">Price Per Day</label>
            <input type="number" name="pricing.perDay" placeholder="0" value={editTransportListing.pricing.perDay}
              onChange={handleChange}
            //  disabled={editTransportListing.pricing.pricingUnit !== "perDay"}
              className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
          </div>
        </div>
        <div>
          <label className="font-semibold">Discount %</label>
          <input type="number" name="pricing.discountPercentage" placeholder="discount apply on orginal price during booking" value={editTransportListing.pricing.discountPercentage}
            onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        </div>

        {/* Availability */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-semibold">Available</label><br/>
            <input type="checkbox" name="availability.status"  checked={editTransportListing.availability.status}
              onChange={handleChange} /> Yes
          </div>
          <div>
            <label className="font-semibold">From</label>
            <input type="time" name="availability.availableFrom"  value={editTransportListing.availability.availableFrom}
              onChange={handleChange}  className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="font-semibold">To</label>
            <input type="time" name="availability.availableTo" value={editTransportListing.availability.availableTo}
              onChange={handleChange}  className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="font-semibold block mb-1">Features</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gapx-4 py-2">
            {featuresOptions.map(item => (
              <label key={item} className="flex items-center gapx-4 py-2">
                <input type="checkbox" name="features" value={item}
                  checked={editTransportListing.features.includes(item)}
                  onChange={handleChange} />
                &nbsp; {item }
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold">Description</label>
          <textarea name="description" value={editTransportListing.description} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" rows="3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Location</label>
            <input name="location" value={editTransportListing.location} onChange={handleChange}
              className="w-full px-4 py-2 border rounded" placeholder="E.g. Islamabad g-11" />
          </div>
          <div>
            <label className="font-semibold">Country</label>
            <input type="text" name="country" value={editTransportListing.country} onChange={handleChange}
              className="w-full px-4 py-2 border rounded" placeholder="E.g. Pakistan" />
          </div>
        </div>

        {/* Contact Info */}
        <h3 className="mt-4 font-semibold text-2xl">Contact Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="contactInfo.phone" value={editTransportListing.contactInfo.phone}
            onChange={handleChange} placeholder="Phone"  className="w-full px-4 py-2 border rounded" />
          <input type="email" name="contactInfo.email" value={editTransportListing.contactInfo.email}
            onChange={handleChange} placeholder="Email"  className="w-full px-4 py-2 border rounded" />
        </div>
        <input type="text" name="contactInfo.website" value={editTransportListing.contactInfo.website}
          onChange={handleChange} placeholder="Website (optional)"  className="w-full px-4 py-2 border rounded" />

 <div className="md:col-span-1 flex justify-end gap-4 mt-6">
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

          {transportListings.length  > 0 ? (
            <div className="listing-grid">
              {transportListings.map((listing) => (
                <div key={listing._id} className="listing-card">
                  {/* Image */}
                  {listing.vehicleImage?.url && (
                    <img
                      className="listing-image"
                      src={listing.vehicleImage.url}
                      alt={listing.vehicleDetail?.name || "Vehicle"}
                    />
                  )}
    
                  {/* Basic Info */}
                  <div className="listing-basic">
                    <h3 className='text-[#1EBEB1]'>
                    {listing.vehicleDetail?.name?.length > 25
                      ? `${listing.vehicleDetail.name.slice(0, 25).toUpperCase()}...`
                      : listing.vehicleDetail?.name?.toUpperCase()}
                  </h3>
                    <p>{listing.vehicleType?.toUpperCase()} | <LocationOnIcon sx={{fontSize:"large"}}/>{listing.location}, {listing.country}</p>
                    <p className="font-[500]">Model: <i className="font-normal">{listing.vehicleDetail?.model}</i></p>
    
                    {/* Icons */}
                    <div className="listing-actions">
                  <span onClick={() =>handleEditClick(listing)}>
                    <EditIcon className="icon" sx={{ color: "#1EBEB1" }} />
                  </span>                  
                  <span onClick={()=>listingDeleteHandler(listing._id)}><DeleteIcon  className="icon" sx={{ color: "red"}}/></span>
                    </div>
    
                    {/* Expand Button */}
                    <button onClick={() => toggleExpand(listing._id)} className="expand-btn">
                      {expanded[listing._id] ? (
                        <>Collapse <ExpandMoreIcon /></>
                      ) : (
                        <>Expand <KeyboardArrowUpIcon /></>
                      )}
                    </button>
                  </div>
    
                  {/* Expandable Section */}
                  {expanded[listing._id] && (
                    <div className="listing-expanded">
                      <p><strong>Description:</strong> {listing.description}</p>
                      <p><strong>Status:</strong> {listing.availability?.status ? "Available" : "Not Available"}</p>
                      <p><strong>Available Time:</strong> {hourFormat(listing.availability?.availableFrom)} - {hourFormat(listing.availability?.availableTo)}</p>
                      <p><strong>Fuel Included:</strong> {listing.fuelIncluded ? "Yes" : "No"}</p>                      
                      {/* <p ><strong>Original Price:</strong>  <i className='line-through'> Rs.{listing.pricing.originalPrice}</i></p> */}
                      {/* <p><strong>Discounted Price:</strong> Rs. {listing.pricing.discountedPrice}</p> */}
                      <hr/>
                      <div>
                        <h1 ><strong>Vehicle details:</strong></h1>
                        <div className="vehicle-detail">
                          <p><strong>Fuel Type:</strong> {listing.vehicleDetail?.fuelType}</p>
                          <p><strong>Transmission:</strong> {listing.vehicleDetail?.transmission}</p>
                          <p><strong>Capacity:</strong> {listing.vehicleDetail?.capacity}</p>
                          <p><strong>Features:</strong> {listing.features?.join(", ")}</p>
                        </div >
                      </div>
                      
                      <hr/>

                      <div>
                        <h1 ><strong>Pricing:</strong></h1>
                        <div className="pricing-detail">
                          {listing.pricing?.perDay && (
                            <p><strong>Per Day:</strong> Rs. {listing.pricing.perDay}</p>
                          )}

                          {listing.pricing?.perHour && (
                            <p><strong>Per Hour:</strong> Rs. {listing.pricing.perHour}</p>
                          )}
                
                          <p><strong>Discount:</strong> {listing.pricing?.discountPercentage}% <i className="text-[#8080804d]">&nbsp; // apply during booking</i></p>
                        </div >
                      </div>
    
                      <hr/>
    
                      <h1 ><strong>Contact details:</strong></h1>
                      <div className="contact-detail">
                      <p><strong>Email:</strong> {listing.contactInfo?.email}</p>
                      <p><strong>Phone:</strong> {listing.contactInfo?.phone}</p>
                      <p><strong>Website:</strong> {listing.contactInfo?.website || 'N/A'}</p>
                      </div>
    
                      
                      <p className="text-sm mt-3"><strong>Created At:</strong> {new Date(listing.createdAt).toLocaleDateString()}</p>
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

export default GetTransportListing;
