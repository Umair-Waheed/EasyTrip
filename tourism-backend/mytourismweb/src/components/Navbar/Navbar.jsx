import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import { toast } from "react-toastify";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from '@mui/icons-material/Home';
import DestinationIcon from '@mui/icons-material/BeachAccess';
import TransportIcon from '@mui/icons-material/TimeToLeave';
import HotelIcon from '@mui/icons-material/Hotel';
import GuideIcon from '@mui/icons-material/EmojiPeople';
import ProfileIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import CloseIcon from '@mui/icons-material/Close';
import NightsStayIcon from '@mui/icons-material/NightsStay';
const Navbar = ({ setLogin, setProviderLogin,setDarkMode,unreadNotications }) => {
  const { url,token, setToken } = useContext(StoreContext);
  const [menu, setMenu] = useState("home");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isTransparent =
    location.pathname === `/destination/${id}` ||
    location.pathname === `/hotel/${id}` ||
    location.pathname === `/transport/${id}` ||
    location.pathname === `/guide/${id}`;

  const logout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    setToken("");
    toast("Logout successfully!");
    setDropdownVisible(false);
    setTimeout(() => {
      setLoading(false);
      navigate("/", { replace: true });
    }, 500);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const dashboardHandler = () => {
    if (token) {
      const decodeToken = JSON.parse(atob(token.split(".")[1]));
      if (decodeToken.role === "user") {
        window.location.href = "/user/dashboard";
      } else if (decodeToken.role === "serviceProvider") {
        window.location.href = "/serviceprovider/dashboard";
      }
    }
  };

  // useEffect(()=>{
  //   const fetchUnreadNotification=async()=>{
  //     const token =localStorage.getItem("token");
  //     const response=await axios.get(`${url}api/notifications/unread-notify`,{
  //      headers: {
  //         Authorization: `Bearer ${token}`
  //       }});

  //     console.log(response.data);
  //     setUnreadNotifications(response.data.count);
  //   };
  //   fetchUnreadNotification();
  // },[]);

  // console.log(unreadNotications);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setMenu("home");
    } else if (path === "/destination") {
      setMenu("destination");
    } else if (path === "/hotel") {
      setMenu("hotel");
    } else if (path === "/transport") {
      setMenu("transport");
    } else if (path === "/touristguide") {
      setMenu("touristguide");
    } else {
      setMenu("");
    }
  }, [location.pathname, token]);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [token]);

  
  return (
     loading? <div className="login-spinner flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
            </div>:
    <div
      className={`fixed top-0 w-screen z-50 px-4 py-2 transition-all duration-300 flex items-center justify-between backdrop-blur-[1px] border-b border-white/20 ${scroll ? "bg-black/80" : isTransparent ? "bg-black/70" : "bg-transparent"}`}
    >
      {/* Hamburger */}
      <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </button>

      {/* Logo */}
      <Link to="/" className="flex-shrink-0">
       <img src={assets.easytrip_logo_white} alt="EasyTrip" className="h-12 md:h-16 lg:h-20" />
     </Link>

      {/* Navigation Links */}
      <ul className="hidden md:flex flex-1 justify-center space-x-6 text-sm md:text-lg text-white">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "text-[#1EBEB1]" : "hover:text-[#1EBEB1]"}`}>Home</Link>
        <Link to="/destination" onClick={() => setMenu("destination")} className={`${menu === "destination" ? "text-[#1EBEB1]" : "hover:text-[#1EBEB1]"}`}>Destinations</Link>
        <Link to="/hotel" onClick={() => setMenu("hotel")} className={`${menu === "hotel" ? "text-[#1EBEB1]" : "hover:text-[#1EBEB1]"}`}>Hotel</Link>
        <Link to="/transport" onClick={() => setMenu("transport")} className={`${menu === "transport" ? "text-[#1EBEB1]" : "hover:text-[#1EBEB1]"}`}>Transport</Link>
        <Link to="/touristguide" onClick={() => setMenu("touristguide")} className={`${menu === "touristguide" ? "text-[#1EBEB1]" : "hover:text-[#1EBEB1]"}`}>TouristGuide</Link>
      </ul>

      {/* Login/Profile */}
       <>
  

  <div className="relative hidden md:block">
    {token ? (
      <div onClick={toggleDropdown} className="relative cursor-pointer">
        <img src={assets.profile_icon} alt="profile" className="w-8 h-8 rounded-full" />
        {unreadNotications > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
        {dropdownVisible && (
          <div className="absolute right-0 mt-2 w-32 bg-black/50 border text-white rounded-md shadow-lg py-2 z-50">
            <Link onClick={dashboardHandler} className="block px-2 py-1 hover:text-[#1EBEB1] border-b border-white/50">
              <DashboardIcon sx={{ fontSize: "20px", color: "#1EBEB1" }} /> Dashboard
            </Link>
            <Link onClick={logout} className="block px-2 py-1 hover:text-[#1EBEB1]">
              <LogoutIcon sx={{ fontSize: "20px", color: "#1EBEB1" }} /> Logout
            </Link>
          </div>
        )}
      </div>
    ) : (
      <div onClick={toggleDropdown} className="relative">
        <button className="text-sm lg:text-lg text-white border border-white px-4 mr-2 py-1 lg:px-5 lg:py-1 rounded-md hover:bg-[#1EBEB1] hover:border-[#1EBEB1] transition">
          Login
        </button>
        {dropdownVisible && (
          <div className="absolute right-0 mt-2 w-32 bg-black/50 border text-white rounded-md shadow-lg py-2 z-50">
            <Link
              to="/user/login"
              onClick={() => {
                setLogin(true);
                setDropdownVisible(false);
              }}
              className="block px-2 py-1 hover:text-[#1EBEB1] border-b border-white/50"
            >
              <LoginIcon sx={{ fontSize: "20px", color: "#1EBEB1" }} /> User
            </Link>
            <Link
              to="/serviceprovider/login"
              onClick={() => {
                setProviderLogin(true);
                setDropdownVisible(false);
              }}
              className="block px-2 py-1 hover:text-[#1EBEB1]">
              <LoginIcon sx={{ fontSize: "20px", color: "#1EBEB1" }} /> Service &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Providers
            </Link>
          </div>
        )}
      </div>
    )}
  </div>
</>


      {/* Mobile login */}
      
      <div className="md:hidden relative">
        {token ? <div onClick={toggleDropdown} className="relative cursor-pointer">
            <img src={assets.profile_icon} alt="profile" className="w-7 h-7 rounded-full" />
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-28 bg-black/50 border text-white rounded-md shadow-lg py-2 z-50">
                <Link onClick={dashboardHandler} className="block px-2 py-1 hover:text-[#1EBEB1] border-b border-white/50 ">Dashboard</Link>
                <Link onClick={logout} className="block px-2 py-1 hover:text-[#1EBEB1]">Logout</Link>
              </div>
            )}
          </div> 
          : (
        <div onClick={toggleDropdown} className="relative">
            <button className="text-sm lg:text-lg text-white border border-white px-4 py-1 lg:px-5 lg:py-1 rounded-md hover:bg-[#1EBEB1] hover:border-[#1EBEB1] transition">Login</button>
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-28 bg-black/50 border text-white rounded-md shadow-lg py-2 z-50">
                <Link to="/user/login" onClick={() => setLogin(true)} className="block px-2 py-1 hover:text-[#1EBEB1] border-b border-white/50 ">User</Link>
                <Link to="/serviceprovider/login" onClick={() => setProviderLogin(true)} className="block px-2 py-1 hover:text-[#1EBEB1]">Service Providers</Link>
              </div>
            )}
          </div>        
        )}
       
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-0 left-0 h-[100vh] w-[80%] bg-[black] text-white shadow-md flex flex-col space-y-3 px-6 py-4 z-50 ">
        <div class="flex items-center justify-between pb-3 border-b border-white/20 ">
        <h2 class="text-[#1EBEB1] text-lg font-medium">EASYTRIP</h2>
        <p class="cursor-pointer" onClick={()=>setMenuOpen(false)}><CloseIcon/></p>
        </div>

          <Link to="/" onClick={() => setMenu("home")} className="hover:bg-[#1EBEB1]/75 hover:text-white px-4 py-2 rounded"><HomeIcon sx={{marginBottom:"5px", fontSize:"22px",color:"#1EBEB1"}}/> Home</Link>
          <Link to="/destination" onClick={() => setMenu("destination")} className="hover:bg-[#1EBEB1]/75 hover:text-white px-4 py-2 rounded"><DestinationIcon sx={{marginBottom:"5px", fontSize:"22px"}}/> Destinations</Link>
          <Link to="/hotel" onClick={() => setMenu("hotel")} className="hover:bg-[#1EBEB1]/75 hover:text-white px-4 py-2 rounded"><HotelIcon sx={{marginBottom:"5px", fontSize:"22px"}}/> Hotel</Link>
          <Link to="/transport" onClick={() => setMenu("transport")} className="hover:bg-[#1EBEB1]/75 hover:text-white px-4 py-2 rounded"><TransportIcon sx={{marginBottom:"5px", fontSize:"22px"}}/> Transport</Link>
          <Link to="/touristguide" onClick={() => setMenu("touristguide")} className="hover:bg-[#1EBEB1]/75 hover:text-white px-4 py-2 rounded"><GuideIcon sx={{marginBottom:"5px", fontSize:"22px"}}/> Tourist Guide</Link>
          <hr />
          {token ? (
            <>
              <Link onClick={dashboardHandler} className="hover:bg-black hover:text-[#1EBEB1] px-4 py-2 rounded"><ProfileIcon sx={{marginBottom:"5px", fontSize:"22px"}}/> Dashboard</Link>
              <Link onClick={logout} className="hover:bg-black hover:text-[#1EBEB1] px-4 py-2 rounded"><LogoutIcon sx={{marginBottom:"5px", fontSize:"22px"}}/> Logout</Link>
            </>
          ) : (
            <>
              <Link to="/user/login" onClick={() => setLogin(true)} className="hover:bg-black hover:text-[#1EBEB1] px-4 py-2 rounded"><LoginIcon sx={{marginBottom:"5px", fontSize:"22px", color:"#1EBEB1"}}/> User Login</Link>
              <Link to="/serviceprovider/login" onClick={() => setProviderLogin(true)} className="hover:bg-black hover:text-[#1EBEB1] px-4 py-2 rounded"><LoginIcon sx={{marginBottom:"5px", fontSize:"22px",color:"#1EBEB1"}}/> Provider Login</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
