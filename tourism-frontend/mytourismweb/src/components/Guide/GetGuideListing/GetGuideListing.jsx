import React, { useState, useContext, useEffect ,useRef} from "react";
import axios from "axios";
import "./GetGuideListing.css";
import { StoreContext } from "../../../context/StoreContext.jsx";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { toast } from "react-toastify";
import { assets } from "../../../assets/assets.js";
import compressImage from "../../../utils/compressImage.js";

const GetGuideListing = () => {
  const { url, token } = useContext(StoreContext);
  const [guideListings, setGuideListings] = useState([]);
  const [expanded, setExpanded] = useState({});
   const [editingId, setEditingId] = useState(null);

   const imageRef=useRef(null);
   const [images, setImages] = useState([]);
    const [editGuideListing, setEditGuideListing] = useState({
      guideName: '',
      expertise: '',
      location: '',
      availability: false,
      phone: '',
      email: '',
      website: '',
      languages: '',
      description: '',
      pricing: {
        perHour: '',
        perDay: '',
        discountPercentage: '',
        pricingUnit: 'perHour',
      },
      guideImage: null,
    });

     const handleEditClick = (listing) => {
    setEditingId(listing._id);
    setEditGuideListing({
       guideName: listing.guideName || "",
      expertise: listing.expertise || '',
      location: listing.location ||'',
      availability: listing.availability || true,
       phone: listing.contactInfo?.phone || '',
      email: listing.contactInfo?.email || '',
      website: listing.contactInfo?.website || '',
      languages: listing.languages || [],
      description:listing.description || '',
      pricing: {
        perHour: listing.pricing?.perHour || "",
        perDay: listing.pricing?.perDay || "",
        discountPercentage: listing.pricing?.discountPercentage || "",
        pricingUnit: listing.pricing?.pricingUnit || "perHour"
      },
      
      guideImage: listing.guideImage?.url || null,
    })
     }
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
        // console.log(id);
        try {
          const response=await axios.delete(`${url}api/guide/listings/${id}`,{
            headers:{
              authorization:`Bearer ${token}`,
            },
          });
    
          if(response.data.success){
            console.log(response.data.message);
            toast("Listing delete successfully!");
            setGuideListings(prev => prev.filter(guideListings => guideListings._id !== id));
    
          }
          
        } catch (error) {
        toast.error("Something went wrong");
        }
      }
      
      useEffect(() => {
        const fetchListings = async () => {
          try {
            const response = await axios.get(`${url}api/guide/listings`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            });
            if (response.data.success) {
              console.log(response.data);
              setGuideListings(response.data.listing);
            }
          } catch (error) {
        toast.error("Something went wrong", error.message);
          }
        };
        fetchListings();
      }, [url, token,setGuideListings]);


//edit logic
 const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name in editGuideListing.pricing) {
      setEditGuideListing(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [name]: value,
        },
      }));
    } else if (name === 'availability') {
      setEditGuideListing(prev => ({ ...prev, availability: value === "true" }));
    } else {
      setEditGuideListing(prev => ({ ...prev, [name]: value }));
    }
  };

   const handleImageChange = (e) => {
        setImages([...e.target.files]);
      };


    
const handleSubmit = async (e) => {
    e.preventDefault();
    try {

    if (!editGuideListing.guideImage) return toast.warning("Please upload a guide image.");

    if (Number(editGuideListing.pricing.discountPercentage) >= Number(editGuideListing.pricing[editGuideListing.pricing.pricingUnit])) {
      return toast.warning("Discount must be less than the selected base price.");
    }

    const formData = new FormData();
    // compress image
 const compressedImages = [];
                           for(const image of images) {
                               const compressedImage = await compressImage(image);
                               compressedImages.push(compressedImage);
                           }
                       compressedImages.forEach((image) => formData.append('guideImage', image));

                       if (images.length > 0 && editGuideListing.guideImage) {
  formData.append('imagesToDelete', editGuideListing.guideImage);
}  
    formData.append("guideName", editGuideListing.guideName);
    formData.append("expertise", editGuideListing.expertise);
    formData.append("location", editGuideListing.location);
    formData.append("availability", JSON.stringify(editGuideListing.availability));
    formData.append("phone", editGuideListing.phone);
    formData.append("email", editGuideListing.email);
    formData.append("website", editGuideListing.website);
    formData.append("languages", editGuideListing.languages);
    formData.append("description", editGuideListing.description);
    formData.append("pricing", JSON.stringify(editGuideListing.pricing));

     for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      } 
      const response = await axios.put(`${url}api/guide/listings/${editingId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success("Listing update successfully!");
        setEditGuideListing({
          guideName: '',
          expertise: '',
          location: '',
          availability: false,
          phone: '',
          email: '',
          website: '',
          languages: '',
          description: '',
          pricing: {
            perHour: '',
            perDay: '',
            discountPercentage: '',
            pricingUnit: 'perHour',
          },
          guideImage: null,
        })
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
    <div className='get-guide-listing'>
      <h2 className='text-2xl font-bold text-[#1EBEB1] text-center mb-8'>All Listings</h2>
      
      {editingId &&  (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                       <div className="bg-white rounded-lg p-10 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                      
                      <div className="flex justify-between items-center p-4 border-b">
                              <h2 className="text-2xl font-bold text-[#1EBEB1]">Edit Guide Listing</h2>
                              <button 
                                onClick={handleCancelEdit}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <img className="w-[16px]" src={assets.cross_icon} alt="" />
                              </button>
                            </div>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className="font-semibold">Guide Name</label>
          <input name="guideName" value={editGuideListing.guideName} onChange={handleChange}
             className="w-full px-4 py-2 border rounded" placeholder="E.g. Muhammad" />
        </div>

        <div>
          <label className="font-semibold">Languages Spoken</label>
          <input name="languages" value={editGuideListing.languages} onChange={handleChange}
             className="w-full px-4 py-2 border rounded" placeholder="E.g. Urdu, English" />
        </div>
        </div>

        <div>
          <label className="font-semibold">Expertise</label>
          <input name="expertise" value={editGuideListing.expertise} onChange={handleChange}
             className="w-full px-4 py-2 border rounded" placeholder="E.g. Historical Tours, Adventure Guide" />
        </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className="font-semibold">Location</label>
          <input name="location" value={editGuideListing.location} onChange={handleChange}
             className="w-full px-4 py-2 border rounded" placeholder="E.g. Lahore, G-11" />
        </div>

        <div>
          <label className="font-semibold">Availability</label>
          <select name="availability" value={editGuideListing.availability} onChange={handleChange} 
            className="w-full px-4 py-2 border rounded">
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>
        <div>
          <img className="w-[150px]" src={editGuideListing.guideImage} alt="" />

          <label className="font-semibold">Guide Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange}
            ref={imageRef} name="guideImage"  className="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label className="font-semibold">Description</label>
          <textarea name="description" value={editGuideListing.description} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" rows="3" placeholder="Write a brief about your services..." />
        </div>

       

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Price Per Hour</label>
            <input type="number" name="perHour" placeholder="0" value={editGuideListing.pricing.perHour}
              onChange={handleChange}
              // disabled={editGuideListing.pricing.pricingUnit !== "perHour"}
              className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
          </div>
          <div>
            <label className="font-semibold">Price Per Day</label>
            <input type="number" name="perDay" placeholder="0" value={editGuideListing.pricing.perDay}
              onChange={handleChange}
              // disabled={editGuideListing.pricing.pricingUnit !== "perDay"}
              className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
          </div>
        </div>

        <div>
          <label className="font-semibold">Discount %</label>
          <input type="number" name="discountPercentage" placeholder="0" value={editGuideListing.pricing.discountPercentage}
            onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        </div>

        <h3 className="mt-4 font-semibold text-2xl">Contact Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="phone" value={editGuideListing.phone}
            onChange={handleChange} placeholder="Phone"  className="w-full px-4 py-2 border rounded" />
          <input type="email" name="email" value={editGuideListing.email}
            onChange={handleChange} placeholder="Email"  className="w-full px-4 py-2 border rounded" />
        </div>
        <input type="text" name="website" value={editGuideListing.website}
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
      
      
      {guideListings.length > 0 ? (
        <div className="listing-grid">
          {guideListings.map((listing) => (
            <div key={listing._id} className="listing-card">
              {/* Image */}
              {listing.guideImage?.url && (
                <img
                  className="listing-image"
                  src={listing.guideImage.url}
                  alt={listing.name || "Guide"}
                />
              )}

              {/* Basic Info */}
              <div className="listing-basic">
                <h3 className='text-[#1EBEB1]'>
                  {listing.guideName?.length > 25
                    ? `${listing.guideName.slice(0, 25).toUpperCase()}...`
                    : listing.guideName?.toUpperCase()}
                </h3>
                <p><LocationOnIcon sx={{ fontSize: "large" }} /> {listing.location}, {listing.country}</p>

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
                  <p><strong>Availability:</strong> {listing.availability? "Available" : "Not Available"}</p>
                  {/* <p><strong>Available Time:</strong> {hourFormat(listing.availability?.availableFrom)} - {hourFormat(listing.availability?.availableTo)}</p> */}
                  <p><strong>Languages:</strong> {listing.languages?.join(", ")}</p>
                  <p><strong>Expertise:</strong> {listing.expertise?.join(", ")}</p>

                  <hr />

                  <div>
                    <h1><strong>Pricing:</strong></h1>
                    <div className="pricing-detail">
                      {listing.pricing?.perDay && (
                        <p><strong>Per Day:</strong> Rs. {listing.pricing.perDay}</p>
                      )}
                      {listing.pricing?.perHour && (
                        <p><strong>Per Hour:</strong> Rs. {listing.pricing.perHour}</p>
                      )}
                      <p><strong>Discount:</strong> {listing.pricing?.discountPercentage}% <i className="text-[#8080804d]">&nbsp; // apply during booking</i></p>
                    </div>
                  </div>

                  <hr />

                  <h1><strong>Contact Details:</strong></h1>
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
        <p>No guide listings available.</p>
      )}
    </div>
  );
};

export default GetGuideListing;
