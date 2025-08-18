import React, { useContext, useEffect, useState } from "react";
import "./transport.css";
import Searchbar from "../../components/Searchbar/Searchbar";
import Card from "../../components/Card/Card.jsx";
import { StoreContext } from "../../context/StoreContext.jsx";
import CategoryCircle from "../../components/CategoryCircle/CategoryCircle.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import Footer from "../../components/Footer/Footer.jsx";
const transport = () => {
  const { url } = useContext(StoreContext);
  const [transports, setTransports] = useState([]);
  const [searchText, setSearchText] = useState({ value: "", type: "name" });
  const vehicleDetails = transports.map((data) => data.vehicleDetail);
  const vehicleName = vehicleDetails.map((data) => data.name);
  // console.log(vehicleName)

  const getTransports = async () => {
    try {
      const response = await axios.get(`${url}api/publicRoute/transports`);
      // console.log(response);

      if (response.data.success) {
        console.log(response.data.listing);
        setTransports(response.data.listing);
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
  const filterTransport = transports?.filter((transport) => {
    const matchesCategory =
      category === "All" ? true : transport.vehicleType?.includes(category);

    const searchValue = searchText?.value?.toLowerCase() || "";
    const searchType = searchText?.type || "name";

    const matchesSearch =
      searchType === "name"
        ? transport.vehicleDetail?.name.toLowerCase().includes(searchValue)
        : transport.location?.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    getTransports();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="transport-main-container">
      <Navbar />
      <div className="transport-hero-section">
        <img
          className="hero-section-img"
          src={assets.transport_banner}
          alt=""
        />
        <div className="transport-hero-section-content">
          <h2>TRANSPORTS</h2>
          <Searchbar
            searchText="Search by name...."
            setSearchText={setSearchText}
          />
        </div>
      </div>
     
      <div className="transport-container px-20">
        <div className="transport-content-container">
          <h2>Transports</h2>
          <div className="transports grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterTransport?.map((data, index) => (
              <Card
                key={index}
                data={data}
                serviceUrl="transport"
                name={data.vehicleDetail?.name}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="web-footer">
        <Footer />
      </div>
    </div>
  );
};

export default transport;
