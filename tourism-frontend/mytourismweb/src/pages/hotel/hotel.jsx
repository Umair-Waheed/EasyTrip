import React, { useContext, useEffect, useState } from "react";
import "./hotel.css";
import Searchbar from "../../components/Searchbar/Searchbar";
import Card from "../../components/Card/Card.jsx";
import { StoreContext } from "../../context/StoreContext.jsx";
import CategoryCircle from "../../components/CategoryCircle/CategoryCircle.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import Footer from "../../components/Footer/Footer.jsx";
const hotel = () => {
  const { url } = useContext(StoreContext);
  const [hotels, setHotels] = useState([]);
  const [searchText, setSearchText] = useState({ value: "", type: "name" });

  const getHotels = async () => {
    try {
      const response = await axios.get(`${url}api/publicRoute/hotels`);
      // console.log(response);

      if (response.data.success) {
        console.log(response.data.listing);
        setHotels(response.data.listing);
      }
    } catch (error) {
      alert(response.data.message);
    }
  };

  // for control category
  const [category, setCategory] = useState("All");

  // const categoryHandler=(name)=>{
  //   // console.log(category);
  //   if(category == name ){
  //     setCategory("All");
  //   }else{
  //   setCategory(name);
  // }
  // }
  const filterHotel = hotels?.filter((hotel) => {
    const matchesCategory =
      category === "All" ? true : hotel.hotelCategory?.includes(category);

    const searchValue = searchText?.value?.toLowerCase() || "";
    const searchType = searchText?.type || "name";

    const matchesSearch =
      searchType === "name"
        ? hotel.hotelName?.toLowerCase().includes(searchValue)
        : hotel.location?.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    getHotels();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="hotel-main-container">
      <Navbar />
      <div className="hotel-hero-section">
        <img
          className="hotel-hero-section-img"
          src={assets.hotel_banner}
          alt=""
        />
        <div className="hotel-hero-section-content">
          <h2>HOTELS</h2>
          <Searchbar
            searchText="Search hotel location...."
            setSearchText={setSearchText}
          />
        </div>
      </div>
    
      <div className="hotel-container px-20">
        <div className="hotel-content-container">
          <h2>Hotels</h2>
          <div className="hotels grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterHotel.map((hotel, index) => {
              return (
                <Card
                  key={index}
                  data={hotel}
                  serviceUrl="hotel"
                  name={hotel.hotelName}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="web-footer">
        <Footer />
      </div>
    </div>
  );
};

export default hotel;
