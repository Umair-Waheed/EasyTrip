import React, { useContext, useEffect, useState } from "react";
import "./guide.css";
import Searchbar from "../../components/Searchbar/Searchbar";
import Card from "../../components/Card/Card.jsx";
import { StoreContext } from "../../context/StoreContext.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import Footer from "../../components/Footer/Footer.jsx";
const guide = () => {
  const { url } = useContext(StoreContext);
  const [guides, setGuides] = useState([]);
  const [searchText, setSearchText] = useState({ value: "", type: "name" });

  const getGuides = async () => {
    try {
      const response = await axios.get(`${url}api/publicRoute/guides`);
      // console.log(response);

      if (response.data.success) {
        console.log(response.data.listing);
        setGuides(response.data.listing);
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
  //     setCategory(" ");
  //   }else{
  //   setCategory(name);
  // }
  // }

  const filterGuide = guides?.filter((guide) => {
    const matchesCategory =
      category === "All" ? true : guide.expertise?.includes(category);

    const searchValue = searchText?.value?.toLowerCase() || "";
    const searchType = searchText?.type || "name";

    const matchesSearch =
      searchType === "name"
        ? guide.guideName?.toLowerCase().includes(searchValue)
        : guide.location?.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    getGuides();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="guide-main-container">
      <Navbar />
      <div className="guide-hero-section">
        <img className="hero-section-img" src={assets.guide_banner} alt="" />
        <div className="guide-hero-section-content">
          <h2>Guides</h2>
          <Searchbar
            searchText="Search by guide Expertise...."
            setSearchText={setSearchText}
          />
        </div>
      </div>
     
      <div className="guide-container px-20">
        <div className="guide-content-container">
          <h2>Guides</h2>
          <div className="guides grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterGuide?.map((guide, index) => {
              return (
                <Card
                  key={index}
                  data={guide}
                  serviceUrl="guide"
                  name={guide.guideName}
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

export default guide;
