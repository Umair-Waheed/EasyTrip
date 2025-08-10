import React, { useState, useContext,useRef } from 'react';
import axios from "axios";
import { StoreContext } from '../../../context/StoreContext.jsx';
import compressImage from '../../../utils/compressImage.js';
import { toast } from 'react-toastify';

const AddGuideListing = () => {
  const { url, token } = useContext(StoreContext);
  const imageRef=useRef(null);
  const [data, setData] = useState({
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name in data.pricing) {
      setData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [name]: value,
        },
      }));
    } else if (name === 'availability') {
      setData(prev => ({ ...prev, availability: value === "true" }));
    } else if (type === 'file') {
      setData(prev => ({ ...prev, guideImage: files[0] }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  // const handlePricingUnitChange = (e) => {
  //   const unit = e.target.value;
  //   setData(prev => ({
  //     ...prev,
  //     pricing: {
  //       perHour: unit === "perHour" ? prev.pricing.perHour : "",
  //       perDay: unit === "perDay" ? prev.pricing.perDay : "",
  //       discountPercentage: prev.pricing.discountPercentage,
  //       pricingUnit: unit
  //     }
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.guideImage) return toast.warning("Please upload a guide image.");

    if (Number(data.pricing.discountPercentage) >= Number(data.pricing[data.pricing.pricingUnit])) {
      return toast.warning("Discount must be less than the selected base price.");
    }

    // compress image
        const compressed = await compressImage(data.guideImage);

    const form = new FormData();
    form.append("guideName", data.guideName);
    form.append("expertise", data.expertise);
    form.append("location", data.location);
    form.append("availability", JSON.stringify(data.availability));
    form.append("phone", data.phone);
    form.append("email", data.email);
    form.append("website", data.website);
    form.append("languages", data.languages);
    form.append("description", data.description);
    form.append("pricing", JSON.stringify(data.pricing));
    form.append("guideImage", compressed);

    try {
      const response = await axios.post(`${url}api/guide/listings`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success("Guide listing created!");
        setData({
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
        if (imageRef.current) {
          imageRef.current.value = '';
        }

      }
    } catch (err) {
      // console.error(err);
      toast.error("Failed to submit listing");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl text-[#1EBEB1] font-bold mb-8 text-center">Add Guide Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className="font-semibold">Guide Name</label>
          <input name="guideName" value={data.guideName} onChange={handleChange}
            required className="w-full px-4 py-2 border rounded" placeholder="E.g. Muhammad" />
        </div>

        <div>
          <label className="font-semibold">Languages Spoken</label>
          <input name="languages" value={data.languages} onChange={handleChange}
            required className="w-full px-4 py-2 border rounded" placeholder="E.g. Urdu, English" />
        </div>
        </div>

        <div>
          <label className="font-semibold">Expertise</label>
          <input name="expertise" value={data.expertise} onChange={handleChange}
            required className="w-full px-4 py-2 border rounded" placeholder="E.g. Historical Tours, Adventure Guide" />
        </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className="font-semibold">Location</label>
          <input name="location" value={data.location} onChange={handleChange}
            required className="w-full px-4 py-2 border rounded" placeholder="E.g. Lahore, G-11" />
        </div>

        <div>
          <label className="font-semibold">Availability</label>
          <select name="availability" value={data.availability} onChange={handleChange} required
            className="w-full px-4 py-2 border rounded">
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>
        <div>
          <label className="font-semibold">Guide Image</label>
          <input type="file" accept="image/*" onChange={handleChange}
            ref={imageRef} name="guideImage" required className="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label className="font-semibold">Description</label>
          <textarea name="description" value={data.description} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" rows="3" placeholder="Write a brief about your services..." />
        </div>

        {/* <div>
          <label className="font-semibold">Pricing Unit</label>
          <select value={data.pricing.pricingUnit} onChange={handlePricingUnitChange}
            required className="w-full px-4 py-2 border rounded">
            <option value="perHour">Per Hour</option>
            <option value="perDay">Per Day</option>
          </select>
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Price Per Hour</label>
            <input type="number" name="perHour" placeholder="0" value={data.pricing.perHour}
              onChange={handleChange}
              // disabled={data.pricing.pricingUnit !== "perHour"}
              className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
          </div>
          <div>
            <label className="font-semibold">Price Per Day</label>
            <input type="number" name="perDay" placeholder="0" value={data.pricing.perDay}
              onChange={handleChange}
              // disabled={data.pricing.pricingUnit !== "perDay"}
              className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
          </div>
        </div>

        <div>
          <label className="font-semibold">Discount %</label>
          <input type="number" name="discountPercentage" placeholder="0" value={data.pricing.discountPercentage}
            onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        </div>

        <h3 className="mt-4 font-semibold text-2xl">Contact Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="phone" value={data.phone}
            onChange={handleChange} placeholder="Phone" required className="w-full px-4 py-2 border rounded" />
          <input type="email" name="email" value={data.email}
            onChange={handleChange} placeholder="Email" required className="w-full px-4 py-2 border rounded" />
        </div>
        <input type="text" name="website" value={data.website}
          onChange={handleChange} placeholder="Website (optional)"  className="w-full px-4 py-2 border rounded" />

       

        <button type="submit" className="w-full bg-[#1EBEB1] hover:bg-[#149d95] text-white py-3  rounded  mt-8">
          Submit Listing
        </button>
      </form>
    </div>
  );
};

export default AddGuideListing;

