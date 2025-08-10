import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets.js";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer text-white ">
      <div className="footer-container">
        <div className="footer-logo ">
          <img src={assets.EasyTrip_logo} alt="" />
          <p>
            Easy Trip Your trusted travel companion for discovering Pakistan’s
            beauty. From hotels and transport to expert guides, we make every
            journey smooth, safe, and memorable.
          </p>

          <div className="follow-us">
            <h2 className="text-xl mb-2 mt-5 font-semibold text-[#1DB3A6]">
              Social Handles
            </h2>
            <div className="socialhandles">
              <img src={assets.facebookLogo} alt="" />
              <img src={assets.xthread} alt="" />
              <img src={assets.instaLogo} alt="" />
            </div>
          </div>
        </div>

        <div className="details explore-links">
          <h2 className="text-xl  mb-2 font-semibold text-[#1DB3A6]">
            Explore
          </h2>
          <ul>
            <Link to={"/destination"}>
              <li>Destinations</li>
            </Link>
            <Link to={"/hotel"}>
              <li>Hotels</li>
            </Link>
            <Link to={"/transport"}>
              <li>Transport</li>
            </Link>
            <Link to={"/touristguide"}>
              <li>Guide</li>
            </Link>
          </ul>
        </div>

        <div className="details">
          <h2 className="text-xl mb-2 font-semibold text-[#1DB3A6]">Pages</h2>
          <ul>
            <Link to={"/aboutus"}>
              <li>About us</li>
            </Link>
            <Link to={"/termsofuse"}>
              <li>Terms of use</li>
            </Link>
            <Link to={"/privacypolicy"}>
              <li>Privacy policy</li>
            </Link>
          </ul>
        </div>

        <div className="contact-us">
          <div className="contacts">
            <h2 className="text-xl mb-2 font-semibold text-[#1DB3A6]">
              Contact Us
            </h2>
            <ul>
              <li>
                <img src={assets.phoneLogo} alt="" />
                <p>+92 3483256587</p>
              </li>
              <li>
                <img src={assets.mailLogo} alt="" />
                <p>easytrip@gmail.com</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="copyright-container">
        <div className="copyright">
          <p>
            &copy; 2025 <span className="text-[#1DB3A6]">EasyTrip</span> | All
            rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
