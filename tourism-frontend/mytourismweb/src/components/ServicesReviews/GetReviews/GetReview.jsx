import React, { useContext,useRef } from 'react';
import "./GetReview.css";
import { assets } from '../../../assets/assets';
import { StoreContext } from '../../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const GetReview = ({ data}) => {
  const {url,token}=useContext(StoreContext);
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    const { current } = sliderRef;
    const scrollAmount = current.offsetWidth;

    if (direction === "left") {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };
   let userId = "";
      if (token) {
          const decodeToken = JSON.parse(atob(token.split(".")[1]));
          userId = decodeToken.id;
          }
                  
      console.log(userId);
  const deleteHandler=async(id)=>{
    try{
     const response= await axios.delete(`${url}api/reviews/${id}`,
      {headers: { authorization: `Bearer ${token}`} },
     )
     console.log(response.data);
     if(response.data.success){
      toast("Review deleted successfully!")
    } else {
      toast.error(response.data.message || "Something went wrong.");
    }

    }catch(error){
 if (error.response && error.response.data) {
      toast.error(error.response.data.message || "Error deleting review.");
    } else {
      toast.error("Network or server error.");
    }    }

  }

  return (
    <div className="get-review-wrapper">
      <button className="slider-btn left" onClick={() => scroll("left")}>&lt;</button>

      <div className="get-review-container" ref={sliderRef}>
        {data?.length > 0 ? (
          data.map((review, index) => (
            <div className="get-review-content" key={index}>
              <div className="get-reviewer-info">
                <img src={assets.profile_icon_2} alt="" />
                <p className='text-sm'>{review.author.name}</p>
                {/* <h5><b>@{review.author.name}</b></h5> */}
                <p className="starability-result star-small" data-rating={review.rating}></p>
              </div>
              <p className='get-review-para'>{review.review}</p>
              
              {review.author._id === userId && (
              <div className='flex justify-center mt-3'>
                <button onClick={()=>deleteHandler(review._id)}  className='review-delete-btn'>Delete</button>

              </div>
              )}
            </div>
          ))
        ) : (
          <p>No reviews available</p>
        )}
      </div>

      <button className="slider-btn right" onClick={() => scroll("right")}>&gt;</button>
    </div>
  );
};

export default GetReview;
