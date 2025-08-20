import "./home.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeCard from "../../components/HomeCard/HomeCard";
import { assets } from "../../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";
import {
  destination,
  hotel,
  transport,
  guide,
} from "../../../public/helper.js";

import Footer from "../../components/Footer/Footer.jsx";
const home = ({url,token}) => {
  const [homeDestination, setHomeDestination] = useState([]);
  const [homeHotel, setHomeHotel] = useState([]);
  const [homeTransport, setHomeTransport] = useState([]);
  const [homeGuide, setHomeGuide] = useState([]);
  const [providerdata,setProviderdata]=useState([]);

  const sliderRef = useRef(null);
  const [isMouseDown, setISMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navigate = useNavigate();

  const handleMouseDown = (e) => {
    setISMouseDown(true);
    setStartX(e.pageX - -sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setISMouseDown(false);
  };
  const handleMouseLeave = () => {
    setISMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1; //speed control
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };
  const destDetailHandler = (destination) => {
    navigate(`/destination/${destination._id}`);
  };
  const hotelDetailHandler = (hotel) => {
    navigate(`/hotel/${hotel._id}`);
  };
  const transportDetailHandler = (transport) => {
    navigate(`/transport/${transport._id}`);
  };
  const guideDetailHandler = (guide) => {
    navigate(`/guide/${guide._id}`);
  };

  useEffect(() => {
    destination(setHomeDestination);
    hotel(setHomeHotel);
    transport(setHomeTransport);
    guide(setHomeGuide);
    window.scrollTo(0, 0);
    // console.log(homeDestination);
    console.log(homeTransport);
  }, []);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        let providerId = "";
        if (token) {
          const decodeToken = JSON.parse(atob(token.split(".")[1]));
          providerId = decodeToken.id;
        }
  
        if (!providerId) {
          throw new Error("Provider ID not found in token");
        }
  
        const response = await axios.get(
          `${url}api/serviceprovider/${providerId}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
  
        // const providerInfo = response.data.isProvider;
        // setProviderdata(providerInfo);
  
        if (response.data.isProvider?.status === "rejected") {
          toast.error(
            "Your account was rejected. Please re-submit valid documents or contact support for assistance."
          );
        }
      } catch (error) {
        console.error("Error fetching provider:", error);
      }
    };
  
    fetchProvider();
  }, [token, url]); // run when token or url changes

  return (
    <div className="home ">
      <div className="home-container px-20">
        {/* <div className="find-interest-section">
          <Category/>
        </div> */}

        {/* dest-1 slider */}
        <div className="home_services_card">
          <h2>Trending Destinations</h2>
          <div
            className="home-card-container"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {homeDestination.slice(0, 6).map((destination, index) => (
              <div className="cards-container" key={index}>
                <div
                  onClick={() => destDetailHandler(destination)}
                  className="home-page-card"
                >
                  <HomeCard key={index} data={destination} />
                </div>
              </div>
            ))}

            <div className="see_more_container">
              <div
                className="see_more"
                onClick={() => navigate("/destination")}
              >
                <button>see more </button>
                <img src={assets.more} alt="see more" />
              </div>
            </div>
          </div>
        </div>

        {/* dest-2 slider */}
        <div className="home_services_card">
          <h2>Adventure Spots</h2>
          <div
            className="home-card-container"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {homeDestination.slice(6, 12).map((destination, index) => (
              <div className="cards-container" key={index}>
                <div
                  onClick={() => destDetailHandler(destination)}
                  className="home-page-card"
                >
                  <HomeCard key={index} data={destination} />
                </div>
              </div>
            ))}

            <div className="see_more_container">
              <div
                className="see_more"
                onClick={() => navigate("/destination")}
              >
                <button>see more </button>
                <img src={assets.more} alt="see more" />
              </div>
            </div>
          </div>
        </div>

        {/* hotel slider */}
        <div className="home_services_card">
          <h2>Stay in Comfort</h2>
          <div
            className="home-card-container"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {homeHotel.slice(0, 6).map((hotel, index) => (
              <div className="cards-container" key={index}>
                <div
                  onClick={() => hotelDetailHandler(hotel)}
                  className="home-page-card"
                >
                  <HomeCard key={index} data={hotel} />
                </div>
              </div>
            ))}

            <div className="see_more_container">
              <div className="see_more" onClick={() => navigate("/hotel")}>
                <button>see more </button>
                <img src={assets.more} alt="see more" />
              </div>
            </div>
          </div>
        </div>

        {/* transport slider */}
        <div className="home_services_card">
          <h2>Traveler’s Choice </h2>
          <div
            className="home-card-container"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {homeTransport.slice(0, 6).map((transport, index) => (
              <div className="cards-container" key={index}>
                <div
                  onClick={() => transportDetailHandler(transport)}
                  key={index}
                  className="home-page-card"
                >
                  <HomeCard key={index} data={transport} />
                </div>
              </div>
            ))}

            <div className="see_more_container">
              <div className="see_more" onClick={() => navigate("/transport")}>
                <button>see more </button>
                <img src={assets.more} alt="see more" />
              </div>
            </div>
          </div>
        </div>

        {/* Guide slider */}
        <div className="home_services_card ">
          <h2>Expert Travel Guides </h2>
          <div
            className="home-card-container"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {homeGuide.slice(0, 6).map((guide, index) => (
              <div className="cards-container" key={index}>
                <div
                  onClick={() => guideDetailHandler(guide)}
                  className="home-page-card"
                >
                  <HomeCard key={index} data={guide} />
                </div>
              </div>
            ))}

            <div className="see_more_container">
              <div className="see_more" onClick={() => navigate("/guide")}>
                <button>see more </button>
                <img src={assets.more} alt="see more" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="web-footer">
        <Footer />
      </div>
    </div>
  );
};
export default home;
