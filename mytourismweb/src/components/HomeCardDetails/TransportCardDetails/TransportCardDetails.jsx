import React, { useEffect, useContext, useState } from "react";
import "./TransportCardDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar/Navbar.jsx";
import { StoreContext } from "../../../context/StoreContext.jsx";
import AddReview from "../../ServicesReviews/AddReview/AddReview.jsx";
import GetReview from "../../ServicesReviews/GetReviews/GetReview.jsx";
import BookingForm from "../../BookingForm/BookingForm.jsx";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { getRatings } from "../../../utils/getReviews.js";
import Footer from "../../Footer/Footer.jsx";
const TransportCardDetails = () => {
  const [transportData, setTransportData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(true);
  const { id } = useParams();

  const { url, token } = useContext(StoreContext);

  const getTransport = async () => {
    try {
      const response = await axios.get(
        `${url}api/publicRoute/transports/${id}`
      );
      // console.log(response);

      if (response.data.success) {
        setTransportData(response.data.listing);
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
  console.log("Vehicle Detail:", transportData);
  console.log("Vratings", averageRating);

  function changeTimeFormat(time) {
    const [hoursStr, minutes] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${hours}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    getTransport();
    getReviews();
    console.log(transportData);
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="vehicle-card-detail-container">
      <Navbar />
      <div className="vehicle-card-detail">
        {/* <div onClick={()=>navigate("/")} className="back-btn">
              <img src={assets.back_icon} alt="" />
              <p>back</p>
            </div> */}

        <h2>{transportData.vehicleDetail?.name}</h2>

        <div className="vehicle-card-img">
          {/* {transportData.vehicleImage?.url?.length > 0 ? (
              transportData.images.map((img, index) => ( */}
          <img src={transportData?.vehicleImage?.url} alt="vehicle image" />
          {/* )) */}
          {/* ) : (
             <p>No images available</p>
            )} */}
        </div>

        <div className="vehicle-card-content">
          <div className="vehicle-detail">
            {transportData.vehicleDetail ? (
              <div className="vehicle-card">
                {/* <p><b>Vehicle Name:</b> <i>{transportData.vehicleDetail.name}</i></p> */}
                <p>
                  <b>Description:</b> {transportData.description}
                </p>
                <p>
                  <b>Location: </b> {transportData.location}
                </p>
                <p>
                  <b>Country:</b> {transportData.country}
                </p>
                <hr />

                <h4 className="font-[700] mt-2">Vehicle Details:</h4>
                <div className="detail-box">
                  <p>
                    <b>Vehicle Type:</b> <i>{transportData.vehicleType}</i>
                  </p>
                  <p>
                    <b>Model:</b> <i>{transportData.vehicleDetail.model}</i>
                  </p>
                  <p>
                    <b>Capacity:</b> {transportData.vehicleDetail.capacity}
                  </p>
                  <p>
                    <b>Fuel Included:</b>{" "}
                    {transportData.fuelIncluded ? "Yes" : "No"}
                  </p>
                  <p>
                    <b>FuelType:</b> {transportData.vehicleDetail.fuelType}
                  </p>
                  <p>
                    <b>Transmission:</b>{" "}
                    {transportData.vehicleDetail.transmission}
                  </p>
                  <p>
                    <b>Features:</b> {transportData.features?.join(", ")}
                  </p>
                  <p>
                    <b>Availability:</b>{" "}
                    {transportData.availability.status
                      ? "Available"
                      : "Not Available"}
                  </p>
                  <p>
                    <strong>Available Time:</strong>{" "}
                    {changeTimeFormat(
                      transportData.availability?.availableFrom
                    )}{" "}
                    -{" "}
                    {changeTimeFormat(transportData.availability?.availableTo)}
                  </p>
                  <p>
                    <b>PerHour Price:</b> Rs. {transportData.pricing?.perHour}
                  </p>
                  <p>
                    <b>PerDay Price:</b> Rs. {transportData.pricing?.perDay}
                  </p>
                  <p>
                    <b>Discounted Price:</b>{" "}
                    {transportData.pricing?.discountPercentage}%{" "}
                    <span className="text-[#D3D3D3] ml-5">
                      //apply during booking
                    </span>
                  </p>
                </div>

                <h4 className="font-[700] mt-2">Contact Details:</h4>
                <div className="detail-box">
                  <p>
                    <strong>Email:</strong> {transportData.contactInfo?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {transportData.contactInfo?.phone}
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    {transportData.contactInfo?.website || (
                      <span className="text-[#D3D3D3]">
                        {" "}
                        link not provided!{" "}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p>No vehicle details available.</p>
            )}
          </div>

          <button onClick={() => setIsBooking(!isBooking)}>Book now</button>
        </div>
        {isBooking && <BookingForm serviceType="transport" setIsBooking={setIsBooking} listingId={id} />}
      </div>

      <div className="home-vehicle-reviews-container">
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
        <div className="home-vehicle-show-review">
          {reviewData.length > 0 ? (
            <GetReview data={reviewData} />
          ) : (
            <p>Reviews not available</p>
          )}
        </div>

        {token && (
          <>
            <h3>Share Your Experience</h3>
            <div className="home-vehicle-add-review">
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

export default TransportCardDetails;
