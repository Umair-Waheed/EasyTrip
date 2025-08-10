import React from 'react'
import { useState,useContext } from 'react';
import axios from "axios";
import "./EditProviderProfile.css"
import { StoreContext } from '../../../context/StoreContext.jsx';
const EditProviderProfile = () => {
    const { url, token } = useContext(StoreContext);
    const [transportData,setTransportData] = useState({
        vehicleType: "car",
        vehicleDetail: {
          name: "",
          model: "",
          capacity: "",
          originalPrice: "",
          discountedPrice: "",
          availability: true,
        },
        images: [],
        description: "",
        location: "",
        country:""
      });

      const onChangeHandler = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("vehicleDetail.")) {
          const key = name.split(".")[1];
          setTransportData({
            ...transportData,
            vehicleDetail: {
              ...transportData.vehicleDetail,
              [key]: value,
            },
          });
        } else {
          setTransportData({
            ...transportData,
            [name]: value,
          });
        }
      };

      const ImageChangeHandler = (e) => {
        const files = Array.from(e.target.files);
        setTransportData((prevData) => ({
            ...prevData,
            images: files,
          }));      
        };

      const submitHandler = async (e) => {
        e.preventDefault();
    
        const formData= new FormData();
        formData.append("vehicleType", transportData.vehicleType);
        formData.append("description", transportData.description);
        formData.append("location", transportData.location);
        formData.append("country", transportData.country);
    
        Object.keys(transportData.vehicleDetail).forEach((key) => {
          formData.append(`vehicleDetail[${key}]`, transportData.vehicleDetail[key]);
        });
    
        transportData.images.forEach((file) => {
          formData.append("images", file);
        });
    
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
          }

        try {
          const response = await axios.post(`${url}api/transport/listings`,formData, {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
          });

          if (response) {
            console.log('Response:', response.data);
            alert('Transport listing added successfully!');           
             setTransportData({
              providerId: "",
              vehicleType: "car",
              vehicleDetail: {
                name: "",
                model: "",
                capacity: "",
                originalPrice: "",
                discountedPrice: "",
                availability: true,
              },
              images: [],
              description: "",
              location: "",
              country:"",
            });
          }
        } catch (error) {
            console.error('Error in adding transport listing:', error.message);
            alert('Error in adding transport listing');
        }
      };

  return (
    <div className='transport-listing-container'>
        <form onSubmit={submitHandler} className='transport-listing-form'>
            <h2>Create Transport Listing</h2>
               

            <fieldset>
                {/* <legend>Vehicle Details:</legend>     */}

                <div className='transport-listing-content'>
                <label>Vehicle Name:</label>
                <input
                    type="text"
                    name="vehicleDetail.name"
                    value={transportData.vehicleDetail.name}
                    onChange={onChangeHandler}
                    required
                />
                </div>

                <div className='transport-listing-content'>
                <label>Vehicle Type:</label>
                <select name="vehicleType" value={transportData.vehicleType} onChange={onChangeHandler} required>
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                    <option value="jeep">Jeep</option>
                </select>
            </div>  

                <div className='transport-listing-content'>
                <label>Model:</label>
                <input
                    type="text"
                    name="vehicleDetail.model"
                    value={transportData.vehicleDetail.model}
                    onChange={onChangeHandler}
                    required
                />
                </div>

                <div className='transport-listing-content'>
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={transportData.description}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className='transport-listing-content'>
                <label>Capacity:</label>
                <input
                    type="number"
                    name="vehicleDetail.capacity"
                    value={transportData.vehicleDetail.capacity}
                    onChange={onChangeHandler}
                    required
                />
                </div>

                <div className='transport-listing-content'>
                  <label>Images:</label>
                  <input type="file" multiple onChange={ImageChangeHandler} required />
                </div>

                <div className='transport-listing-content'>
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={transportData.location}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className='transport-listing-content'>
                <label>Country:</label>
                <input
                  type="text"
                  name="Country"
                  value={transportData.country}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className='transport-listing-content'>
                <label>Availability:</label>
                <select
                    name="vehicleDetail.availability"
                    value={transportData.vehicleDetail.availability}
                    onChange={onChangeHandler}
                >
                    <option value={true}>Available</option>
                    <option value={false}>Not Available</option>
                </select>
                </div>

                <div className='transport-listing-content'>
                <label>Original Price:</label>
                <input
                    type="number"
                    name="vehicleDetail.originalPrice"
                    value={transportData.vehicleDetail.originalPrice}
                    onChange={onChangeHandler}
                    required
                />
                </div>

                <div className='transport-listing-content'>
                <label >Discounted Price:</label>
                <input
                    type="number"
                    name="vehicleDetail.discountedPrice"
                    value={transportData.vehicleDetail.discountedPrice}
                    onChange={onChangeHandler}
                />
                </div>

                
            </fieldset>

      <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default EditProviderProfile