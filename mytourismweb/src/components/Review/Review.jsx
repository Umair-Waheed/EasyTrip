import React from 'react'
import "./Review.css"
import { assets } from '../../assets/assets'
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
const Review = () => {
  return (
    <div className='review-container'>
    <img  src={assets.profile_icon_2} alt="" />
    <div className="review-content-container">
    <div className="review-text-container">
        <div className="person-review">
        <h2>@jhon</h2>
        <div className="card-ratings">
              <i><StarIcon sx={{ fontSize: 20,color:"white" }}/></i>
              <i><StarIcon sx={{ fontSize: 20,color:"white" }}/></i>
              <i><StarIcon sx={{ fontSize: 20,color:"white" }}/></i>
              <i><StarIcon sx={{ fontSize: 20,color:"white" }}/></i>
              <i><StarHalfIcon sx={{ fontSize: 20,color:"white" }}/></i>
              
           </div>
        </div>
            <div className="person-review-text">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil nisi laboriosam optio! Sit iste minima ex sequi eligendi ...</p>
            </div>
            </div>
         
        <div className='review-content-container-btn'>
            <button>Submit Your Feedback</button>
        </div>
    </div>
</div>
  )
}

export default Review