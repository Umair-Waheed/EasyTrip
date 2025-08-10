import { useNavigate } from "react-router-dom";
import { useState, useEffect,useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./Card.css";
import PlaceIcon from "@mui/icons-material/Place";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Card = ({ data, serviceUrl, name }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(true);
  const navigate = useNavigate();
  const{url}=useContext(StoreContext);
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
  const images = Array.isArray(data.images)
    ? data.images
    : data.vehicleImage?.url
    ? [data.vehicleImage.url]
    : data.guideImage?.url
    ? [data.guideImage.url]
    : Array.isArray(data.roomDetails)
    ? data.roomDetails.map((room) => room.roomImage).filter(Boolean) // get roomImage from each room
    : [];

  // console.log(data._id);
  const cardClickHandler = () => {
    navigate(`/${serviceUrl}/${data._id}`);
  };
  const id=data._id;

  useEffect(() => {
    const fetchReviews = async () => {
      
      try {
       const response = await axios.get(`${url}api/reviews/listing/${id}`);
        if (response.data.success && response.data.reviews.length > 0) {
          const ratings = response.data.reviews.map((review) =>
            parseFloat(review.rating)
          );
          console.log(ratings);

          const avg =
            ratings.reduce((sum, curr) => sum + curr, 0) / ratings.length;
          setAverageRating(Math.round(avg * 2) / 2); // round to nearest 0.5
        }
      } catch (err) {
        console.error("Error fetching ratings", err);
      } finally {
        setLoadingRating(false);
      }
    };

    fetchReviews();
  }, [data._id]);
console.log(averageRating)
  return (
    <div className="card" onClick={cardClickHandler}>
      <div className="card-image-slider-container">
        <Slider {...sliderSettings}>
          {images.map((img, index) => (
            <div key={index} className="card-slider-image-wrapper">
              <img
                className="card-listing-image"
                src={img}
                alt={`Destination ${index + 1}`}
              />
            </div>
          ))}
        </Slider>
      </div>
      {/* <div className="card-img-container">
        {data.images.map((image, index) => (
          <img className="card-image" src={image} key={index} alt={`Image ${index + 1}`}/>
        ))}
        </div> */}

      <div className="card-header">
        <h3 className="home_card_title ">
          {name.length > 15 ? `${name.substring(0, 15)}...` : name}
        </h3>
      </div>

        <div className="px-2 ">
          {Array.from({ length: 5 }, (_, i) => {
            if (averageRating >= i + 1) {
              return (
                <StarIcon key={i} sx={{ fontSize: 14, color: "#fbbf24" }} />
              );
            } else if (averageRating >= i + 0.5) {
              return (
                <StarHalfIcon key={i} sx={{ fontSize: 14, color: "#fbbf24" }} />
              );
            } else {
              return (
                <StarIcon key={i} sx={{ fontSize: 14, color: "#d1d5db" }} />
              );
            }
          })}
          {!loadingRating && (
            <span className="text-xs text-gray-600 ml-1">
              ({averageRating})
            </span>
          )}
        </div>
      <div className="card-body text-sm lg:text-base">
        {data.description.slice(0, 80)}...
        <div className="card-footer ">
          <i>
            <PlaceIcon />
          </i>
          <p className="text-sm mt-1 ">{data.location.slice(0, 30)}...</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
