import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./ProviderSetupForm.css";
import { assets } from '../../assets/assets.js';
import { StoreContext } from '../../context/StoreContext.jsx';
import { toast } from 'react-toastify';
const ProviderSetupForm = ({setIsSetup,setShowSetupForm}) => {
  const [providerInfo, setProviderInfo] = useState({
    serviceType: "",
    location: "",
    country: "",
    image: null,
    contactNumber: "",
    facebookLink: "",
    instagramLink: "",
    linkedinLink: "",
  });
  const[img,setImg]=useState(null);
  const {url,token}=useContext(StoreContext);
  const navigate=useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setProviderInfo((prev) => ({ ...prev, [name]: value }));
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files && e.target.files[0];
      setProviderInfo((prev) => ({ ...prev, image: file }));
  };

 
  const submitHandler = async (e) => {
    e.preventDefault();
  try {
    const formData = new FormData();

    // Append all fields (including the image)
    Object.entries(providerInfo).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Log FormData (for debugging)
    for (const [key, val] of formData.entries()) {
      console.log(key, val);
    }

    const response = await axios.post(`${url}api/serviceprovider/setup`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}` 
      }
    });

      // Handle success...
      if(response.data.success){
        // console.log(response.data);
        setIsSetup(true);
        setShowSetupForm(false);
        setProviderInfo(providerInfo);
        toast.success("Profile created successfully!")
        navigate('/serviceprovider/dashboard');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="provider-setup-container">
       
      <form className="provider-setup-form" onSubmit={submitHandler} noValidate>
      {/* <div onClick={()=>navigate("/")} className="back-btn">
          <img src={assets.back_icon} alt="" />
          <p>back</p>
        </div> */}
        <p className='ml flex items-center cursor-pointer text-[#1EBEB1]' onClick={()=>navigate(-1)}><img className='w-4 h-4 mr-1' src={assets.back_icon}></img>back</p>
        <h2 >Setup Your Service</h2>
        <img src={img} alt="" />
        <label>
          Service Type:
          <select name="serviceType" value={providerInfo.serviceType} onChange={onChangeHandler} required>
            <option value="">Select Service Type</option>
            <option value="hotel">Hotel</option>
            <option value="transport">Transport</option>
            <option value="guide">Guide</option>
          </select>
        </label>

        <label>
          City:
          <input
            type="text"
            name="location"
            value={providerInfo.location}
            onChange={onChangeHandler}
            placeholder="Enter city"
            required
          />
        </label>

        <label>
          Country:
          <input
            type="text"
            name="country"
            value={providerInfo.country}
            onChange={onChangeHandler}
            placeholder="Enter country"
            required
          />
        </label>

        <label>
          Contact Number:
          <input
            type="text"
            name="contactNumber"
            value={providerInfo.contactNumber}
            onChange={onChangeHandler}
            placeholder="Enter contact number"
            required
          />
        </label>

        <label>
          Profile/Cover Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={fileChangeHandler}
            // required
          />
        </label>

        <label>
          Facebook Link (optional):
          <input
            type="url"
            name="facebookLink"
            value={providerInfo.facebookLink}
            onChange={onChangeHandler}
            placeholder="https://facebook.com/"
          />
        </label>

        <label>
          Instagram Link (optional):
          <input
            type="url"
            name="instagramLink"
            value={providerInfo.instagramLink}
            onChange={onChangeHandler}
            placeholder="https://instagram.com/"
          />
        </label>

        <label>
          LinkedIn Link (optional):
          <input
            type="url"
            name="linkedinLink"
            value={providerInfo.linkedinLink}
            onChange={onChangeHandler}
            placeholder="https://linkedin.com/in/"
          />
        </label>

        <button type="submit">Save & Continue</button>
      </form>
    </div>
  );
};

export default ProviderSetupForm
