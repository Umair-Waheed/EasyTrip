import { useState, React, useEffect, useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import axios from "axios";
import TokenChecker from "./components/TokenChecker/TokenChecker.jsx";
import { assets } from "./assets/assets.js";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./pages/home/home.jsx";
import Login from "./components/Login/Login.jsx";
import Destination from "./pages/destination/destination.jsx";
import Hotel from "./pages/hotel/hotel.jsx";
import Transport from "./pages/transport/transport.jsx";
import Guide from "./pages/guide/guide.jsx";
import UserDashboard from "./pages/userDashboard/userDashboard.jsx";
import ProviderDashboard from "./pages/providerDashboard/providerDashboard.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { StoreContext } from "./context/StoreContext.jsx";
import DestinationCardDetails from "./components/HomeCardDetails/DestinationCardDetails/DestinationCardDetails.jsx";
import HotelCardDetails from "./components/HomeCardDetails/HotelCardDetails/HotelCardDetails.jsx";
import TransportCardDetails from "./components/HomeCardDetails/TransportCardDetails/TransportCardDetails.jsx";
import GuideCardDetails from "./components/HomeCardDetails/GuideCardDetails/GuideCardDetails.jsx";
import EditProviderProfile from "./components/Transport/EditProviderProfile/EditProviderProfile.jsx";
import PaymentForm from "./components/Payment/PaymentForm/PaymentForm.jsx";
import RefundPolicy from "./pages/refund/RefundPolicy.jsx";
import BookingPolicy from "./pages/BookingPolicy/BookingPolicy.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutUs from "./pages/aboutUs.jsx";
import TermsOfUse from "./pages/termsofuse.jsx";
import PrivacyPolicy from "./pages/privacyPolicy.jsx";
import ProviderTermsConditions from "./pages/providerTermsConditions.jsx";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword/ResetPassword.jsx";
const App = () => {
  const { token, url } = useContext(StoreContext);
  const [login, setLogin] = useState(false);
  const [providerLogin, setProviderLogin] = useState(false);
  const [providerRoute, setProviderRoute] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [unreadNotications, setUnreadNotifications] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const fetchUnreadNotification = async () => {
      const response = await axios.get(
        `${url}api/notifications/unread-notify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setUnreadNotifications(response.data.count);
    };

    fetchUnreadNotification();
  }, [token, url]);
  console.log(unreadNotications);




  return (
    <div>
      <div>
        {login || providerLogin ? (
          <Login
            login={login}
            setLogin={setLogin}
            providerLogin={providerLogin}
            setProviderLogin={setProviderLogin}
          />
        ) : null}
      </div>

      <div className="app-container">
        <ToastContainer theme="dark" />
        <TokenChecker />
        {(location.pathname === "/" ||
          location.pathname === "/user/login" ||
          location.pathname === "/serviceprovider/login") && (
          <div className="hero-section">
            <img
              className="hero-section-img"
              src={assets.home_banner_img}
              alt=""
            />
            <Navbar
              setProviderLogin={setProviderLogin}
              setLogin={setLogin}
              setDarkMode={setDarkMode}
              unreadNotications={unreadNotications}
            />
           

            {/* <Searchbar/> */}
            <div className="heroSection-text">
              <h2 className="sm:text-[10px]">
                Find your dream <br /> destination
              </h2>
              <p>
                <b>Your next adventure starts here!</b> Discover stunning
                destinations, book comfortable stays, and secure reliable
                transport all in just one place.
              </p>
              {/* <p>Book your trip with<br /><span>smart solutions!</span></p> */}
              <button>Explore</button>
              {/* <img src={assets.right_full_arrow} alt="" /> */}
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home url={url} token={token}/>} />
          <Route path="/destination" element={<Destination />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/touristguide" element={<Guide />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/termsofuse" element={<TermsOfUse />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/providerterms&conditions" element={<ProviderTermsConditions />} />
<Route path="/forgot-password/:role" element={<ForgotPassword url={url} />} />
        <Route path="/reset-password/:role/:token" element={<ResetPassword url={url} />} />

          {token && (
            <Route
              path="/user/:route"
              element={
                <UserDashboard
                  setProviderRoute={setProviderRoute}
                  unreadNotications={unreadNotications}
                  setUnreadNotifications={setUnreadNotifications}
                />
              }
            />
          )}
          {token && (
            <Route
              path={`/serviceprovider/:route`}
              element={
                <ProviderDashboard
                  setProviderRoute={setProviderRoute}
                  unreadNotications={unreadNotications}
                  setUnreadNotifications={setUnreadNotifications}
                />
              }
            />
          )}
          {token && (
            <Route
              path="/serviceprovider/profile/:id"
              element={<EditProviderProfile />}
            />
          )}
          {token && (
            <Route
              path={"/user/payment/:bookingId"}
              element={<PaymentForm />}
            />
          )}
          <Route
            path={`/destination/:id`}
            element={<DestinationCardDetails />}
          />
          <Route path={`/hotel/:id`} element={<HotelCardDetails />} />
          <Route path={`/transport/:id`} element={<TransportCardDetails />} />
          <Route path={`/guide/:id`} element={<GuideCardDetails />} />
          <Route path={"/refund-policy"} element={<RefundPolicy />} />
          <Route path={"/booking-policy"} element={<BookingPolicy />} />
        </Routes>

        {/* <div className="web-footer">
      <Footer />
    </div> */}
      </div>
    </div>
  );
};

export default App;
