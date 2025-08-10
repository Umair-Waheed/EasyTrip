import React, { useEffect, useContext, useState } from "react";
import "./GuideCardDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar/Navbar.jsx";
import { StoreContext } from "../../../context/StoreContext.jsx";
import AddReview from "../../ServicesReviews/AddReview/AddReview.jsx";
import GetReview from "../../ServicesReviews/GetReviews/GetReview.jsx";
import BookingForm from "../../BookingForm/BookingForm.jsx";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import Footer from "../../Footer/Footer.jsx";
const GuideCardDetails = () => {
  const [guideData, setGuideData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const { url, token } = useContext(StoreContext);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(true);

  const { id } = useParams();

  const getGuide = async () => {
    try {
      const response = await axios.get(`${url}api/publicRoute/guides/${id}`);
      // console.log(response);

      if (response.data.success) {
        console.log(response.data.listing);
        setGuideData(response.data.listing);
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
  console.log("guide Detail:", guideData);

  useEffect(() => {
    getGuide();
    getReviews();
    console.log(guideData);
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="guide-card-detail-container">
      <Navbar />
      <div className="guide-card-detail">
        {/* <div onClick={()=>navigate("/")} className="back-btn">
              <img src={assets.back_icon} alt="" />
              <p>back</p>
            </div> */}

        <h2>{guideData.guideName}</h2>

        <div className="guide-card-img">
          {/* {guideData?.images?.length > 0 ? ( */}
          {/* guideData.images.map((img, index) => ( */}
          <img src={guideData.guideImage?.url} alt="guide image" />
          {/* ))
            ) : (
             <p>No images available</p>
            )} */}
        </div>

        <div className="guide-card-content">
          <div className="guide-details">
            {/* <p><b>Guide Name:</b> {guideData.guideName}</p> */}
            <p>
              <b>Description:</b> {guideData.description}
            </p>
            <p>
              <b>Location:</b> {guideData.location}
            </p>
            <p>
              <b>Country:</b> {guideData.country}
            </p>
            <hr />

            <h4 className="font-[700] mt-2">Guide Details:</h4>
            <div className="detail-box">
              <p>
                <b>Expertise:</b>
              </p>
              {guideData.expertise && guideData.expertise.length > 0 ? (
                <ul>
                  {guideData.expertise.map((skill, index) => (
                    <li key={index}> {skill} </li>
                  ))}
                </ul>
              ) : (
                <p>expertise not defined!</p>
              )}

              <p>
                <b>Languages:</b>
              </p>
              {guideData.languages && guideData.languages.length > 0 ? (
                <ul>
                  {guideData.languages.map((lang, index) => (
                    <li key={index}>{lang + " "}</li>
                  ))}
                </ul>
              ) : (
                <p>languages not defined!</p>
              )}
              <p>
                <b>Availability:</b>{" "}
                {guideData.availability ? "Available" : "Not Available"}
              </p>

              {guideData.pricing ? (
                <>
                  <p>
                    <b>PerHour Price:</b> Rs. {guideData.pricing?.perHour}
                  </p>
                  <p>
                    <b>PerDay Price:</b> Rs. {guideData.pricing?.perDay}
                  </p>
                  <p>
                    <b>Discounted Price:</b>{" "}
                    {guideData.pricing?.discountPercentage}%{" "}
                    <span className="text-[#D3D3D3] ml-5">
                      //apply during booking
                    </span>
                  </p>
                </>
              ) : (
                <p>Pricing not defined</p>
              )}
              <hr />
            </div>
          </div>

          <h4 className="font-[700] mt-2">Contact Details:</h4>
          <div className="detail-box">
            <p>
              <strong>Email:</strong> {guideData.contactInfo?.email}
            </p>
            <p>
              <strong>Phone:</strong> {guideData.contactInfo?.phone}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              {guideData.contactInfo?.website || (
                <span className="text-[#D3D3D3]"> link not provided! </span>
              )}
            </p>
          </div>

          <button onClick={() => setIsBooking(!isBooking)}>Book now</button>
        </div>
      </div>

      {isBooking && <BookingForm serviceType="guide" setIsBooking={setIsBooking} listingId={id} />}

      <div className="home-guide-reviews-container">
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
        <div className="home-guide-show-review">
          {reviewData.length > 0 ? (
            <GetReview data={reviewData} />
          ) : (
            <p>Reviews not available</p>
          )}
        </div>
        {token && (
          <>
            <h3>Share Your Experience</h3>
            <div className="home-guide-add-review">
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

export default GuideCardDetails;
