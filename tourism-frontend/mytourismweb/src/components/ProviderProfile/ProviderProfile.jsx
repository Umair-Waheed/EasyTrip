import React, { useEffect, useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderProfile.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const ProviderProfile = ({ providerData,setProviderData}) => {
  const { id } = providerData;
  const [editMode, setEditMode] = useState(false);
  const {url,token}=useContext(StoreContext);
  const navigate=useNavigate();
  console.log(providerData);
  const [formData, setFormData] = useState({
    name: '',
    serviceType: '',
    location: '',
    country: '',
    contactNumber: '',
    facebookLink: '',
    instagramLink: '',
    // twitterLink: '',
    linkedinLink:'',
    email: '',
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${url}api/serviceprovider/profile/${id}`, formData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      if(response){
        setProviderData((prev) => ({
          ...prev,
          name: formData.name || '',
        location: formData.location || '',
        contactNumber: formData.contactNumber || '',
        facebookLink: formData.facebookLink || '',
        instagramLink: formData.instagramLink || '',
        // twitterLink: formData.twitterLink || '',
        linkedinLink: formData.linkedinLink || '',
        }));
        // refreshProviderData();
        setEditMode(false);
        toast.success("changes was saved!")
        navigate("/serviceprovider/profile")

      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const serviceImages = {
    hotel: assets.hotel,
    transport: assets.transport,
    guide: assets.guide
  };

  useEffect(() => {
    if (providerData) {
      setFormData({
        name: providerData.name || '',
        serviceType: providerData.serviceType || '',
        location: providerData.location || '',
        country: providerData.country || '',
        email: providerData.email || '',
        contactNumber: providerData.contactNumber || '',
        facebookLink: providerData.facebookLink || '',
        instagramLink: providerData.instagramLink || '',
        // twitterLink: providerData.twitterLink || '',
        linkedinLink: providerData.linkedinLink || '',
      });
    }
    window.scrollTo(0, 0);

  }, [providerData]);

  return (
    <div className="provider-profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit} className='provider-edit-form'>
        <h2>Edit Profile</h2>

            <div className='provider-information'>
            <label>Full Name:</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChangeHandler}
                
            />
            </div>

            <div className='provider-information'>
            <label>Vehicle Type:</label>
            <input
                type="text"
                name="serviceType"
                value={formData.serviceType}
                onChange={onChangeHandler}
                className='non-edit-field'
                disabled
            />
        </div>  

            <div className='provider-information'>
            <label>City:</label>
            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onChangeHandler}
                
            />
            </div>

            <div className='provider-information'>
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={onChangeHandler}
                className='non-edit-field'
                disabled
            />
            </div>

            <div className='provider-information'>
            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChangeHandler}
                className='non-edit-field'
                disabled
            />
            </div>

            <div className='provider-information'>
              <label>Previous Image:</label>
              <img src={providerData.image.url} width="60px" alt="" />
            </div>

            <div className='provider-information'>
              <label>Images:</label>
              <input type="file" multiple  />
            </div>

            <div className='provider-information'>
            <label>Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={onChangeHandler}

            />
          </div>

          <div className="provider-information">
            <label>Facebook Link</label>
            <input
              type="text"
              name="facebookLink"
              value={formData.facebookLink}
              onChange={onChangeHandler}
            />
          </div>
          <div className="provider-information">
            <label>Instagram Link</label>
            <input
              type="text"
              name="instagramLink"
              value={formData.instagramLink}
              onChange={onChangeHandler}
            />
          </div>
          {/* <div className="provider-information">
            <label>Twitter Link</label>
            <input
              type="text"
              name="twitterLink"
              value={formData.twitterLink}
              onChange={onChangeHandler}
            />
          </div> */}
          <div className="provider-information">
            <label>Linkedin Link</label>
            <input
              type="text"
              name="linkedinLink"
              value={formData.linkedinLink}
              onChange={onChangeHandler}
            />
          </div>

          <span className="edit-form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </span>
      </form>
      ) :
        // profile content
      (
        <div className="profile-banner">
          <img 
            src={serviceImages[providerData?.serviceType] || assets.user_prof_banner} 
            alt="Banner" 
            className="banner-img" 
          />
        </div>
      )}

      {!editMode && (
        <div className="profile-card">
          <img src={providerData?.image && providerData.image.url !== "" ? providerData.image.url : assets.profile_icon} alt="Profile" className="profile-img" />
          <div className="profile-info">
            <div className="provider-information-container">
              <div className="provider-information-container-header">
                <h1 className='text-xl md:text-2xl'>ServiceProvider information</h1>
                <div onClick={() => setEditMode(true)} className="provider-info-edit-btn">
                  <i className="fa-solid fa-user-pen"></i>
                  <button >Edit</button>
                </div>
              </div>
              <div className="provider-personal-information">
          <img src={providerData?.image && providerData.image.url !== "" ? providerData.image.url : assets.profile_icon} alt="Profile" className="profile-img" />
                <div className="provider-personal-info">
                  <h2>{providerData.businessName?.charAt(0).toUpperCase() + providerData?.businessName.slice(1)}</h2>
                  <span>
                    <p className='provider-role '>{providerData.serviceType?.charAt(0).toUpperCase() + providerData.serviceType?.slice(1)}</p>
                    <i className="fa-solid fa-location-dot"> </i>{providerData.location?.charAt(0).toUpperCase() + providerData.location?.slice(1)}
                  </span>
                </div>
                <div className="provider-social">
                  <div className="provider-social-icon">
                    <a href={providerData.facebookLink} target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </div>
                  <div className="provider-social-icon">
                    <a href={providerData.instagramLink} target="_blank" rel="noopener noreferrer">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </div>
                  {/* <div className="provider-social-icon">
                    <a href={providerData.twitterLink} target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-x-twitter"></i>
                    </a>
                  </div> */}
                  <div className="provider-social-icon">
                    <a href={providerData.linkedinLink} target="_blank" rel="noopener noreferrer">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="provider-contact-information-container">
                <h1>Personal Information</h1>
                <div className="provider-contact-information-content">
                  <div className="provider-name-information">
                    <p className='provider-contact-information-heading'>Full Name</p>
                    <h2>{providerData.name?.charAt(0).toUpperCase() + providerData.name?.slice(1)}</h2>
                  </div>
                  <div className="provider-serviceType-information">
                    <p className='provider-contact-information-heading'>Service Type</p>
                    <h2>{providerData.serviceType?.charAt(0).toUpperCase() + providerData.serviceType?.slice(1)}</h2>
                  </div>
                  <div className="provider-location-information">
                    <p className='provider-contact-information-heading'>location</p>
                    <h2>{providerData.location?.charAt(0).toUpperCase() + providerData.location?.slice(1)}</h2>
                  </div>
                  <div className="provider-country-information">
                    <p className='provider-contact-information-heading'>Country</p>
                    <h2>{providerData.country?.charAt(0).toUpperCase() + providerData.country?.slice(1)}</h2>
                  </div>
                  <div className="provider-email-information">
                    <p className='provider-contact-information-heading'>Email</p>
                    <h2>{providerData.email?.charAt(0).toUpperCase() + providerData.email?.slice(1)}</h2>
                  </div>
                  <div className="provider-contact-information">
                    <p className='provider-contact-information-heading'>Contact</p>
                    <h2>{providerData.contactNumber?.charAt(0).toUpperCase() + providerData.contactNumber?.slice(1)}</h2>
                  </div>
                  <div className="provider-joined-information">
                    <p className='provider-contact-information-heading'>Joined</p>
                    <h2>{new Date(providerData.createdAt).toLocaleDateString() || "N/A"}</h2>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfile;
