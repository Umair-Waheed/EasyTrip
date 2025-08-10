import React, { useEffect, useContext, useState } from "react";
import "./HotelCardDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar/Navbar.jsx";
import { assets } from "../../../assets/assets.js";
import { StoreContext } from "../../../context/StoreContext.jsx";
import AddReview from "../../ServicesReviews/AddReview/AddReview.jsx";
import GetReview from "../../ServicesReviews/GetReviews/GetReview.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Map from "../../Map/Map.jsx";
import BookingForm from "../../BookingForm/BookingForm.jsx";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import Footer from "../../Footer/Footer.jsx";
const HotelCardDetails = () => {
  const [hotelData, setHotelData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const { url, token } = useContext(StoreContext);
  const [reviewData, setReviewData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  // console.log(id);

  const getHotel = async () => {
    try {
      const response = await axios.get(`${url}api/publicRoute/hotels/${id}`);
      console.log(response);

      if (response.data.success) {
        setHotelData(response.data.listing);
        // console.log(response);
      }
    } catch (error) {
      //   alert(response.data.message);
      console.log(error);
    }
  };

  const getReviews = async () => {
    try {
      const response = await axios.get(`${url}api/reviews/listing/${id}`);
      console.log(response.data);

      if (response.data.success) {
        setReviewData(response.data.reviews);
      }
      if (response.data.success && response.data.reviews.length > 0) {
        const ratings = response.data.reviews.map((review) =>
          parseFloat(review.rating)
        );
        console.log(ratings);

        const avg =
          ratings.reduce((sum, curr) => sum + curr, 0) / ratings.length;
        setAverageRating(Math.round(avg * 2) / 2); // round to nearest 0.5
      }
    } catch (error) {
      //   alert(response.data.message);
      console.log(error);
    } finally {
      setLoadingRating(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  useEffect(() => {
    getHotel();
    getReviews();
    console.log(hotelData);
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.log("Error getting user location", error);
        setUserLocation(null);
      }
    );
    window.scrollTo(0, 0);
  }, [id]);

  const [longitude = 0, latitude = 0] = Array.isArray(hotelData.coordinates)
    ? hotelData.coordinates
    : [0, 0];
  const destination = { lat: latitude, lng: longitude };
  // console.log(destination);
  // console.log(hotelData);
  console.log(isBooking);

  return (
    <div className="hotel-card-detail-container">
      <Navbar />
      <div className="hotel-card-detail">
        {/* <div onClick={()=>navigate("/")} className="back-btn">
          <img src={assets.back_icon} alt="" />
          <p>back</p>
        </div> */}

        <h2>{hotelData.hotelName}</h2>

        <div className="card-detail-image-slider-container">
          <Slider {...sliderSettings}>
            {hotelData.roomDetails?.map((room, index) =>
              room.roomImage?.map((img, index) => (
                <div key={index} className="card-detail-slider-image-wrapper">
                  <img
                    className="card-detail-listing-image"
                    src={img}
                    alt={`Destination ${index + 1}`}
                  />
                </div>
              ))
            )}
          </Slider>
        </div>
        <div className="hotel-card-content">
          <p>
            <strong>Description:</strong> {hotelData.description}
          </p>
          <p>
            <strong>Category:</strong> {hotelData.hotelCategory}
          </p>
          <p>
            <strong>Breakfast:</strong>{" "}
            {hotelData.breakfastIncluded ? "Yes" : "No"}
          </p>
          <p>
            <strong>Security Features:</strong>{" "}
            {hotelData?.securityFeatures?.length
              ? hotelData.securityFeatures.join(", ")
              : "None"}
          </p>
          <p>
            <strong>Location: </strong> {hotelData.location}
          </p>
          <p>
            <strong>Country:</strong> {hotelData.country}
          </p>

          <div className="room-details">
            <hr />
            <h4 className="font-[700] mt-2">Room Details:</h4>
            {hotelData.roomDetails && hotelData.roomDetails.length > 0 ? (
              hotelData.roomDetails.map((room, index) => (
                <div className="detail-box" key={room._id || index}>
                  <p>
                    <strong>Bed Type:</strong> {room.bedType}
                  </p>
                  <p>
                    <strong>Amenities:</strong> {room.roomAmenities.join(", ")}
                  </p>
                  <p>
                    <strong>Availability:</strong>{" "}
                    {room.availability ? "Available" : "Not Available"}
                  </p>
                  <p>
                    <strong>Original Price:</strong>
                    <span className="line-through">
                      {" "}
                      Rs. {hotelData.pricing?.originalPrice}
                    </span>
                  </p>
                  <p>
                    <strong>Discounted Price:</strong> Rs.{" "}
                    {hotelData.pricing?.discountedPrice}
                  </p>
                </div>
              ))
            ) : (
              <p>No room details available.</p>
            )}
            <hr className="mt-3" />
          </div>

          <h4 className="font-[700] ">Contact Details:</h4>
          <div className="detail-box">
            <p>
              <strong>Email:</strong> {hotelData.contactInfo?.email}
            </p>
            <p>
              <strong>Phone:</strong> {hotelData.contactInfo?.phone}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              {hotelData.contactInfo?.website || (
                <span className="text-[#D3D3D3]"> link not provided! </span>
              )}
            </p>
          </div>

          <button
            className="booknow-btn"
            onClick={() => setIsBooking(!isBooking)}
          >
            Book Now
          </button>
        </div>
        {isBooking && <BookingForm serviceType="hotel" setIsBooking={setIsBooking} listingId={id} />}

        <div className="hotel_detail-map">
          <h2 className="text-center">See Where We Are</h2>
          {userLocation && destination.lat && destination.lng ? (
            <Map userLocation={userLocation} destination={destination} />
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      </div>

      <div className="home-hotel-reviews-container">
        <div>
          <h2 className="text-center ">Reviews</h2>

          <div className="border mt-2 border-gray-300 p-4 rounded shadow-sm">
            <h5 className="font-semibold">Overall Reviews</h5>
            {!loadingRating && (
              <div className="text-xs text-center text-gray-600 ml-1">
                ({averageRating})
              </div>
            )}
            <div className="text-center">
              {Array.from({ length: 5 }, (_, i) => {
                if (averageRating >= i + 1) {
                  return (
                    <StarIcon key={i} sx={{ fontSize: 14, color: "#fbbf24" }} />
                  );
                } else if (averageRating >= i + 0.5) {
                  return (
                    <StarHalfIcon
                      key={i}
                      sx={{ fontSize: 14, color: "#fbbf24" }}
                    />
                  );
                } else {
                  return (
                    <StarIcon key={i} sx={{ fontSize: 14, color: "#d1d5db" }} />
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div className="home-hotel-show-review">
          {reviewData.length > 0 ? (
            <GetReview data={reviewData} />
          ) : (
            <p>Reviews not available</p>
          )}
        </div>

        {token && (
          <>
            <h3>Share Your Experience</h3>
            <div className="home-hotel-add-review">
              <AddReview
                listingId={id}
                onReviewAdd={() => console.log("Refresh review")}
              />
            </div>
          </>
        )}
      </div>
      <div className="web-footer">
        <Footer />
      </div>
    </div>
  );
};

export default HotelCardDetails;
