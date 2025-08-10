import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DestinationCardDetails.css";
import Navbar from "../../Navbar/Navbar.jsx";
import { assets } from "../../../assets/assets.js";
import { StoreContext } from "../../../context/StoreContext.jsx";
import AddReview from "../../ServicesReviews/AddReview/AddReview.jsx";
import GetReview from "../../ServicesReviews/GetReviews/GetReview.jsx";
import Map from "../../Map/Map.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import Footer from "../../Footer/Footer.jsx";
const DestinationCardDetails = () => {
  const [destData, setDestData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(true);
  const { id } = useParams();

  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  // console.log(id);

  const getdestination = async () => {
    try {
      const response = await axios.get(
        `${url}api/publicRoute/destinations/${id}`
      );
      // console.log(response.data.listing);

      if (response.data.success) {
        setDestData(response.data.listing);
        console.log(destData);
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
    getdestination();
    getReviews();
    // console.log(reviewData);
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

  const [longitude = 0, latitude = 0] = Array.isArray(destData.coordinates)
    ? destData.coordinates
    : [0, 0];
  const destination = { lat: latitude, lng: longitude };
  console.log(destination);

  return (
    <div className="dest-card-detail-container">
      <Navbar />
      <div className="dest-card-detail">
        {/* <div onClick={()=>navigate("/")} className="back-btn">
            <img src={assets.back_icon} alt="" />
            <p>back</p>
          </div> */}

        <h2>{destData.name}</h2>

        <div className="card-detail-image-slider-container">
          <Slider {...sliderSettings}>
            {destData.images?.map((img, index) => (
              <div key={index} className="card-detail-slider-image-wrapper">
                <img
                  className="card-detail-listing-image"
                  src={img}
                  alt={`Destination ${index + 1}`}
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="dest-card-content">
          {/* <p><b>Destination:</b> <i>{destData.name}</i></p> */}
          <p>
            <b>Description:</b> {destData.description}
          </p>
          <p>
            <b>Location: </b> {destData.location}
          </p>
          <p>
            <b>Country:</b> {destData.country}
          </p>
          <p>
            <b>Climate:</b> {destData.climate}
          </p>
          <p>
            <b>Best Visited In:</b>{" "}
            {destData.bestVisitedIn?.join(", ") || "N/A"}
          </p>
          <p>
            <b>SafetyLevel:</b> {destData.safetyLevel}
          </p>
          <p>
            <b>PriceRange:</b> {destData.priceRange}
          </p>
          {/* <p><b>PriceRange:</b> {destData.coordinates?.join(', ') || 'N/A'}</p> */}
        </div>

        <div className="dest_detail-map">
          <h2 className="text-center">See Where We Are</h2>
          <div class="dest-details-show-map">
            {userLocation && destination.lat && destination.lng ? (
              <Map userLocation={userLocation} destination={destination} />
            ) : (
              <p>Loading map...</p>
            )}
          </div>
        </div>
      </div>

      <div className="home-dest-reviews-container">
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
        <div className="home-dest-show-review">
          {reviewData.length > 0 ? (
            <GetReview data={reviewData} />
          ) : (
            <p>Reviews not available</p>
          )}
        </div>
        {token && (
          <>
            <h3>Share Your Experience</h3>
            <div className="home-dest-add-review">
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

export default DestinationCardDetails;
