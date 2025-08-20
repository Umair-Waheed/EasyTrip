import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProviderSetupForm.css";
import { assets } from "../../assets/assets.js";
import { StoreContext } from "../../context/StoreContext.jsx";
import { toast } from "react-toastify";

const ProviderSetupForm = ({ setIsSetup, setShowSetupForm }) => {
  const [providerInfo, setProviderInfo] = useState({
    serviceType: "",
    location: "",
    country: "",
    contactNumber: "",
    businessName: "",
    registrationNumber: "",
    bankAccount:" ",
    accountNumber:" ",
    facebookLink: "",
    instagramLink: "",
    linkedinLink: "",
    image: null,
    hotelLicense: null,
    driverLicense: null,
    guideCertificate: null,
    governmentId: null,
  });

  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setProviderInfo((prev) => ({ ...prev, [name]: value }));
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files && e.target.files[0];
    setProviderInfo((prev) => ({ ...prev, [e.target.name]: file }));
  };

  // const multipleFilesHandler = (e) => {
  //   setProviderImages(e.target.files); // FileList object
  // };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // append single-value fields + files
      Object.entries(providerInfo).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      const response = await axios.post(
        `${url}api/serviceprovider/setup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShowSetupForm(false);
        toast.success(
          "Your setup request has been submitted! Please be patience for team approval!"
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="provider-setup-container">
      <form className="provider-setup-form" onSubmit={submitHandler} noValidate>
        <p
          className="ml flex items-center cursor-pointer text-[#1EBEB1]"
          onClick={() => navigate(-1)}
        >
          <img className="w-4 h-4 mr-1" src={assets.back_icon}></img>back
        </p>
        <h2>Setup Your Service</h2>

        {/* Service Type */}
        <label>
          Service Type:
          <select
            name="serviceType"
            value={providerInfo.serviceType}
            onChange={onChangeHandler}
            required
          >
            <option value="">Select Service Type</option>
            <option value="hotel">Hotel</option>
            <option value="transport">Transport</option>
            <option value="guide">Guide</option>
          </select>
        </label>

        {/* Common Fields */}
        <label>
          Business / Provider Name:
          <input
            type="text"
            name="businessName"
            value={providerInfo.businessName}
            onChange={onChangeHandler}
            required
          />
        </label>

        <label>
          City:
          <input
            type="text"
            name="location"
            value={providerInfo.location}
            onChange={onChangeHandler}
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
            required
          />
        </label>

        <label>
          Government ID (CNIC/Passport/Licence):
          <input
            type="file"
            name="governmentId"
            accept="image/*,application/pdf"
            onChange={fileChangeHandler}
            required
          />
        </label>

        <label>
          Business Registration / License No:
          <input
            type="text"
            name="registrationNumber"
            value={providerInfo.registrationNumber}
            onChange={onChangeHandler}
          />
        </label>

        <label>
          Bank Account Name:
          <input
            type="text"
            name="bankAccount"
            value={providerInfo.bankAccount}
            onChange={onChangeHandler}
            required
          />
        </label>
        <label>
          Bank Account Number:
          <input
            type="text"
            name="accountNumber"
            value={providerInfo.accountNumber}
            onChange={onChangeHandler}
            required
          />
        </label>

        {/* Conditional fields */}
        {providerInfo.serviceType === "hotel" && (
          <label>
            Hotel License:
            <input
              type="file"
              name="hotelLicense"
              accept="image/*,application/pdf"
              onChange={fileChangeHandler}
              required
            />
          </label>
        )}

        {providerInfo.serviceType === "transport" && (
          <label>
            Driver License Copy:
            <input
              type="file"
              name="driverLicense"
              accept="image/*,application/pdf"
              onChange={fileChangeHandler}
              required
            />
          </label>
        )}

        {providerInfo.serviceType === "guide" && (
          <label>
            Guide Certificate: (if applicable)
            <input
              type="file"
              name="guideCertificate"
              accept="image/*,application/pdf"
              onChange={fileChangeHandler}
            />
          </label>
        )}

        {/* Provider Images (Multiple) */}
        <label>
          Profile Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={fileChangeHandler}
            required
          />
        </label>

        {/* Social Links */}
        <label>
          Facebook Link:
          <input
            type="url"
            name="facebookLink"
            value={providerInfo.facebookLink}
            onChange={onChangeHandler}
          />
        </label>

        <label>
          Instagram Link:
          <input
            type="url"
            name="instagramLink"
            value={providerInfo.instagramLink}
            onChange={onChangeHandler}
          />
        </label>

        <label>
          LinkedIn Link:
          <input
            type="url"
            name="linkedinLink"
            value={providerInfo.linkedinLink}
            onChange={onChangeHandler}
          />
        </label>
        <div className="login-condition">
          <input type="checkbox" required />
          <p className="mt-5">
            Please read the following
            <a
              className="underline"
              href="/providerterms&conditions"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007BFF", marginLeft: "4px" }}
            >
              Terms & Conditions
            </a>{" "}
            carefully before setup your services.
          </p>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProviderSetupForm;
