import React, { useContext, useEffect, useState } from "react";
import "./destination.css";
import Searchbar from "../../components/Searchbar/Searchbar";
import Card from "../../components/Card/Card.jsx";
import { StoreContext } from "../../context/StoreContext.jsx";
import CategoryCircle from "../../components/CategoryCircle/CategoryCircle.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import Footer from "../../components/Footer/Footer.jsx";
const destination = () => {
  const { url } = useContext(StoreContext);
  const [destinations, setDestinations] = useState([]);
  const [searchText, setSearchText] = useState({ value: "", type: "name" });
  const getDestination = async () => {
    try {
      const response = await axios.get(`${url}api/publicRoute/destinations`);
      // console.log(response);

      if (response.data.success) {
        console.log(response.data.destListings);
        setDestinations(response.data.destListings);
      }
    } catch (error) {
      alert(response.data.message);
    }
  };

  useEffect(() => {
    getDestination();
    window.scrollTo(0, 0);
  }, []);

  console.log(searchText);

  const [category, setCategory] = useState("All");

  const categoryHandler = (name) => {
    console.log(name);
    if (category == name) {
      setCategory("All");
    } else {
      setCategory(name);
    }
  };

  const filterDestinations = destinations?.filter((destination) => {
    const matchesCategory =
      category === "All" ? true : destination.category?.includes(category);

    const searchValue = searchText?.value?.toLowerCase() || "";
    const searchType = searchText?.type || "name";

    const matchesSearch =
      searchType === "name"
        ? destination.name?.toLowerCase().includes(searchValue)
        : destination.location?.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });
  console.log(filterDestinations);

  return (
    <div className="destination-main-container">
      <Navbar />
      <div className="destination-hero-section">
        <img
          className="hero-section-img"
          src={assets.destination_banner}
          alt=""
        />
        <div className="destination-hero-section-content">
          <h2>DESTINATIONS</h2>
          <Searchbar
            searchText="Search destinations...."
            setSearchText={setSearchText}
          />
        </div>
      </div>
      <div className="destination-category-container">
        <div className="destination-category">
          <CategoryCircle
            name={"Mountain"}
            img={assets.mountain_cat}
            onClick={categoryHandler}
            category={category}
          />
          <CategoryCircle
            name={"Nature"}
            img={assets.Wildlife_cat}
            onClick={categoryHandler}
            category={category}
          />
          <CategoryCircle
            name={"Adventure"}
            img={assets.adventure_cat}
            onClick={categoryHandler}
            category={category}
          />
          <CategoryCircle
            name={"Historical"}
            img={assets.historical_cat}
            onClick={categoryHandler}
            category={category}
          />
          <CategoryCircle
            name={"Hiking"}
            img={assets.hiking_cat}
            onClick={categoryHandler}
            category={category}
          />
          <CategoryCircle
            name={"Waterspot"}
            img={assets.waterspot_cat}
            onClick={categoryHandler}
            category={category}
          />
          <CategoryCircle
            name={"Camping"}
            img={assets.camping_cat}
            onClick={categoryHandler}
            category={category}
          />
        </div>
      </div>
      <div className="destination-container px-20">
        <div className="destination-content-container">
          <h2>Destinations</h2>
          <div className="destinations grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterDestinations?.map((destination, index) => {
              return (
                <Card
                  key={index}
                  data={destination}
                  serviceUrl="destination"
                  name={destination.name}
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

export default destination;
