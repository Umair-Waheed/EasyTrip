import React from 'react'
import "./UserProfile.css"
import { assets } from '../../../assets/assets.js'
const UserProfile = ({userData}) => {
  console.log(userData);
  return (
    <div className="user-header">
            <img className='user-header-img' src={assets.user_prof_banner} alt="service related banner-img" />
                <div className="user-profile">
                    <div className="user-profile-content">
                        <img className='user-profile-img' src={userData.image} alt="userimage" />
                        <div className="user-name">
                          <h2>{userData.name}</h2>
                          <p><img src={assets.location_icon} alt="" />{userData.location}</p>                        
                        </div>
                    </div>
                </div>
        </div>
  )
}

export default UserProfile