import React, { useState, useContext,useRef } from "react";
import axios from "axios";
import compressImage from "../../../utils/compressImage.js";
import { StoreContext } from "../../../context/StoreContext";
import { toast } from "react-toastify";

const vehicleTypes = ["Sedan", "SUV", "Van", "Bus", "Jeep"];
const fuelTypes = ["Petrol", "Diesel", "Electric"];
const featuresOptions = ["AC", "Driver Included", "Luggage Rack", "WiFi", "GPS"];

const AddTransportListing=()=> {
  const { url, token } = useContext(StoreContext);
  const imageRef=useRef(null);
  const [data, setData] = useState({
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // nested vehicleDetail or contactInfo or availability
    if (name.includes(".")) {
      const [group, key] = name.split(".");
      setData(data => ({
        ...data,
        [group]: {
          ...data[group],
          [key]: type === "checkbox" ? checked : value
        }
      }));
      return;
    }

    // pricing nested
    if (name.startsWith("pricing.")) {
      const key = name.split(".")[1];
      setData(data => ({
        ...data,
        pricing: {
          ...data.pricing,
          [key]: value
        }
      }));
      return;
    }

    // features multi-select
    if (name === "features") {
      const next = [...data.features];
      const idx = next.indexOf(value);
      if (idx > -1) next.splice(idx, 1);
      else next.push(value);
      setData(data => ({ ...data, features: next }));
      return;
    }

    // image
    if (type === "file") {
      setData(data => ({ ...data, vehicleImage: files[0] }));
      return;
    }

    //handle boolean for fuel 
    if (name === "fuelIncluded") {
      setData(data => ({ ...data, [name]: value === "true" }));
      return;
    }

    // checkbox for availability.status
    if (type === "checkbox") {
      setData(data => ({
        ...data,
        [name]: checked
      }));
      return;
    }

    // simple text/number
    setData(data => ({ ...data, [name]: value }));
  };

  // special handler for pricingUnit toggle
  const handlePricingUnitChange = (e) => {
    const unit = e.target.value;
    setData(data => ({
      ...data,
      pricing: {
        perHour: unit === "perHour" ? data.pricing.perHour : "",
        perDay: unit === "perDay" ? data.pricing.perDay : "",
        discountPercentage: data.pricing.discountPercentage,
        pricingUnit: unit
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validations
    if (!data.vehicleImage) return alert("Please upload a vehicle image.");
    if (Number(data.pricing.discountPercentage) >= Number(data.pricing[data.pricing.pricingUnit])) {
      return toast.warning("Discount must be less than the selected base price.");
    }

    // compress image
    const compressed = await compressImage(data.vehicleImage);

    // build FormData
    const form = new FormData();
    form.append("vehicleType", data.vehicleType);
    form.append("vehicleDetail", JSON.stringify(data.vehicleDetail));
    form.append("description", data.description);
    form.append("location", data.location);
    form.append("country", data.country);
    form.append("fuelIncluded", data.fuelIncluded);
    form.append("pricing", JSON.stringify(data.pricing));
    form.append("availability", JSON.stringify(data.availability));
    form.append("features", JSON.stringify(data.features));
    form.append("phone", data.contactInfo.phone);
    form.append("email", data.contactInfo.email);
    form.append("website", data.contactInfo.website);
    form.append("vehicleImage", compressed);

    try {
      const response = await axios.post(`${url}api/transport/listings`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
      toast.success("Transport listing created!");

      setData({
        vehicleType: "",
        vehicleDetail: { name: "", model: "", capacity: "", fuelType: "Petrol", transmission: "Manual" },
        fuelIncluded:false,
        description: "",
        location: "",
        country: "Pakistan",
        pricing: { perHour: "", perDay: "", discountPercentage: "", pricingUnit: "perHour" },
        availability: { status: true, availableFrom: "08:00 AM", availableTo: "08:00 PM" },
        features: [],
        contactInfo: { phone: "", email: "", website: "" },
        vehicleImage: null,
      })
        //for clear image 
      if (imageRef.current) {
        imageRef.current.value = '';
      }

      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add listing");
    }
  };

  return (
    <div className="add-transport-listing-container max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl text-[#1EBEB1] font-bold mb-4 text-center">Add Transport Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Info */}
        <div>
          <label className="font-semibold">Vehicle Type</label>
          <select name="vehicleType" value={data.vehicleType} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value="">Select…</option>
            {vehicleTypes.map(v => (<option key={v} value={v}>{v}</option>))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Name</label>
            <input name="vehicleDetail.name" value={data.vehicleDetail.name} onChange={handleChange}
             required className="w-full px-4 py-2 border rounded" placeholder="E.g. Toyota Hiace" />
          </div>
          <div>
            <label className="font-semibold">Model</label>
            <input name="vehicleDetail.model" value={data.vehicleDetail.model} onChange={handleChange}
             required className="w-full px-4 py-2 border rounded" placeholder="E.g. 2022" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-semibold">Capacity</label>
            <input type="number" name="vehicleDetail.capacity" value={data.vehicleDetail.capacity}
              onChange={handleChange} className="w-full px-4 py-2 border rounded" required placeholder="Seats" />
          </div>
          <div>
            <label className="font-semibold">Fuel Type</label>
            <select name="vehicleDetail.fuelType" value={data.vehicleDetail.fuelType} required onChange={handleChange}
              className="w-full px-4 py-2 border rounded">
              {fuelTypes.map(f => (<option key={f} value={f}>{f}</option>))}
            </select>
          </div>
          <div>
          <label className="font-semibold">Fuel Included</label>
          <select name="fuelIncluded" value={data.fuelIncluded} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        </div>
          <div>
          <label className="font-semibold">Vehicle Image</label>
          <input type="file" accept="image/*" onChange={handleChange} ref={imageRef}
            name="vehicleImage" required className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Transmission</label>
          <select name="vehicleDetail.transmission" value={data.vehicleDetail.transmission} onChange={handleChange}
            required className="w-full px-4 py-2 border rounded">
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        {/* Pricing Unit Toggle */}
        {/* <div>
          <label className="font-semibold">Pricing Unit</label>
          <select value={data.pricing.pricingUnit} onChange={handlePricingUnitChange}
            required className="w-full px-4 py-2 border rounded">
            <option value="perHour" >Per Hour</option>
            <option value="perDay" >Per Day</option>
          </select>
        </div> */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Price Per Hour</label>
            <input type="number" name="pricing.perHour" placeholder="0" value={data.pricing.perHour}
                onChange={handleChange}
              // disabled={data.pricing.pricingUnit !== "perHour"}
              className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
          </div>
          <div>
            <label className="font-semibold">Price Per Day</label>
            <input type="number" name="pricing.perDay" placeholder="0" value={data.pricing.perDay}
              onChange={handleChange}
            //  disabled={data.pricing.pricingUnit !== "perDay"}
              className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
          </div>
        </div>
        <div>
          <label className="font-semibold">Discount %</label>
          <input type="number" name="pricing.discountPercentage" placeholder="discount apply on orginal price during booking" value={data.pricing.discountPercentage}
            onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        </div>

        {/* Availability */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-semibold">Available</label><br/>
            <input type="checkbox" name="availability.status" required checked={data.availability.status}
              onChange={handleChange} /> Yes
          </div>
          <div>
            <label className="font-semibold">From</label>
            <input type="time" name="availability.availableFrom"  value={data.availability.availableFrom}
              onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="font-semibold">To</label>
            <input type="time" name="availability.availableTo" value={data.availability.availableTo}
              onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="font-semibold block mb-1">Features</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gapx-4 py-2">
            {featuresOptions.map(item => (
              <label key={item} className="flex items-center gapx-4 py-2">
                <input type="checkbox" name="features" value={item}
                  checked={data.features.includes(item)}
                  onChange={handleChange} />
                &nbsp; {item }
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold">Description</label>
          <textarea name="description" value={data.description} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" rows="3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Location</label>
            <input name="location" value={data.location} onChange={handleChange}
             required className="w-full px-4 py-2 border rounded" placeholder="E.g. Islamabad g-11" />
          </div>
          <div>
            <label className="font-semibold">Country</label>
            <input type="text" name="country" value={data.country} onChange={handleChange}
             required className="w-full px-4 py-2 border rounded" placeholder="E.g. Pakistan" />
          </div>
        </div>

        {/* Contact Info */}
        <h3 className="mt-4 font-semibold text-2xl">Contact Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="contactInfo.phone" value={data.contactInfo.phone}
            onChange={handleChange} placeholder="Phone" required className="w-full px-4 py-2 border rounded" />
          <input type="email" name="contactInfo.email" value={data.contactInfo.email}
            onChange={handleChange} placeholder="Email" required className="w-full px-4 py-2 border rounded" />
        </div>
        <input type="text" name="contactInfo.website" value={data.contactInfo.website}
          onChange={handleChange} placeholder="Website (optional)"  className="w-full px-4 py-2 border rounded" />

        {/* Image Upload */}
       

        <button type="submit"
          className="w-full bg-[#1EBEB1] hover:bg-[#149d95] text-white py-3 rounded mt-4">
          Submit Transport Listing
        </button>
      </form>
    </div>
  );
}
export default AddTransportListing