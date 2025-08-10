import React, { useEffect,useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeCard.css"

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { getReviews } from "../../utils/getReviews.js";
const card = ({data}) => {
  const destName=data.name;
  const tranName=data.vehicleDetail?data.vehicleDetail.name:"";
  const hotelName=data.hotelName;
  const guideName=data.guideName;
const [ratings,setRatings]=useState({});
  const navigate=useNavigate();

    const handleClick = ()=>{
      navigate(`/destination/${data._id}`);
    }
    // console.log(data.vehicleImage?.url);
    const images =
  Array.isArray(data.images)
    ? data.images
    :  data.vehicleImage?.url
    ? [data.vehicleImage.url]
    : data.guideImage?.url
    ? [data.guideImage.url]
    : Array.isArray(data.roomDetails)
    ? data.roomDetails.map(room => room.roomImage).filter(Boolean) // get roomImage from each room
    : [];



    
    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false
    };
  return (
      <div className="home_card" onClick={handleClick}>
         <div className="home_card_image-slider-container">
                 
               <Slider {...sliderSettings}>
                 {images.map((img, index) => (
                   <div key={index} className="home_card_slider-image-wrapper">
                     {/* {resizedUrl && ( */}
                      <img
                       className="home_card_listing-image"
                       src={img}
                       alt={`Destination ${index + 1}`}
                     />
                     {/* )} */}
                       {/* <div class="absolute inset-0 bg-black bg-opacity-8"></div> */}

                   </div>
                 ))}
               </Slider>
         
               </div>
        <div className="home_card_content_container">
          <div className="home_card_content">

          {hotelName ? (
            <h2 className="home_card_title">
              {hotelName.length > 20 ? `${hotelName.substring(0, 15)}...` : hotelName}
            </h2>
          ) : (
            "Hotel"
          )}

            {data.vehicleDetail ? (
              <h2 title={tranName} className="home_card_title">{tranName.length > 20 ? `${tranName.substring(0, 15)}...`:tranName}</h2>):
              ("Vehicle")}
            {destName ? (
              <h2 title={destName} className="home_card_title">{destName.length > 20 ? `${destName.substring(0, 15)}...`:destName}</h2>):
            ("Destination")}

            {guideName ? (
              <h2 title={guideName}  className="home_card_title">{guideName.length > 20 ? `${guideName.substring(0, 15)}...`:guideName}</h2>):
              ("Guide")}
            
            <p>
              {data.description.slice(0,80)}... 
            </p>
            <button className="home_card_btn">Read more</button>

          </div>
        </div>
      </div>
  );
};

export default card;
