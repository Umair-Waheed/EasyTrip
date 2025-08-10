import React, { useEffect, useState,useContext } from 'react'
import {useLocation,useNavigate,useParams} from "react-router-dom"
import './providerDashboard.css'
import axios from "axios"
import { assets } from '../../assets/assets.js'
import { StoreContext } from '../../context/StoreContext.jsx'
import ProviderSetupForm from "../../components/ProviderSetupForm/ProviderSetupForm"
import ProviderProfile from '../../components/ProviderProfile/ProviderProfile.jsx'
import AddHotelListing from '../../components/Hotel/AddHotelListing/AddHotelListing.jsx'
import AddTransportListing from '../../components/Transport/AddTransportListing/AddTransportListing.jsx'
import AddGuideListing from '../../components/Guide/AddGuideListing/AddGuideListing.jsx'
import GetHotelListing from '../../components/Hotel/GetHotelListing/GetHotelListing.jsx'
import GetTransportListing from '../../components/Transport/GetTransportListing/GetTransportListing.jsx'
import GetGuideListing from '../../components/Guide/GetGuideListing/GetGuideListing.jsx'
import Avatar from '@mui/material/Avatar';
import ProviderBookingRequests from '../../components/ProviderBookingRequests/ProviderBookingRequests.jsx'
import ProviderBookings from '../../components/Bookings/ProviderBookings/ProviderBookings.jsx'
import ProviderPayments from "../../components/PaymentDetails/ProviderPayments/ProviderPayments.jsx"
import { toast } from 'react-toastify';
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import BookIcon from '@mui/icons-material/Book';
import PaymentIcon from '@mui/icons-material/Payment';
import AddIcon from '@mui/icons-material/Add';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import PersonIcon from '@mui/icons-material/Person';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ReportIcon from '@mui/icons-material/ReportGmailerrorred';
import ReportForm from '../../components/ReportForm/ReportForm.jsx';
import Reports from '../../components/Reports/Reports.jsx'
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 0,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));
const providerDashboard = ({setProviderRoute,unreadNotications,setUnreadNotifications}) => {
  const [isSetup,setIsSetup]=useState(false);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [addListingForm, setAddListingForm] = useState(false);
  const [serviceType,setServiceType]=useState("");
  const [providerInfo,setProviderInfo]=useState({});
  const [booking,setBooking]=useState([]);
  const [activeTab,setActiveTab]=useState("");
  const [click,setClick]=useState(false);
  const [loading,setLoading]=useState(true);
  const[totalServices,setTotalServices]=useState("")
    const [menuOpen, setMenuOpen] = useState(false);
 const [notifyDropdown,setNotifyDropdown]=useState(false);
      const [notifications,setNotifications]=useState({});
          const[isReportForm,setIsReportForm]=useState(false);
    
  const{url,token,setToken}=useContext(StoreContext);
  
  const { route } = useParams();
  const location = useLocation();
  const navigate=useNavigate();
  
  const getProviderData=async()=>{
    try{
      let providerId="";
        setLoading(true);

      if(token){
        const decodeToken=JSON.parse(atob(token.split(".")[1]));
        // console.log(decodeToken);
        providerId=decodeToken.id;
        // console.log(providerId);
      }
      if (!providerId) {
        throw new Error("Provider ID not found in token");
      }
      
      const response = await axios.get(`${url}api/serviceprovider/${providerId}`, {
        headers: { authorization: `Bearer ${token}` }
      });        // console.log(response.data);
      const isSetupComplete=response.data.isProvider.isSetupComplete;
      // console.log(isSetupComplete);
      const providerData=response.data.isProvider;
      setProviderInfo(response.data.isProvider);
      // console.log(response.data.isProvider);
      setServiceType(providerData.serviceType);
      setIsSetup(isSetupComplete);
      const currentPath = location.pathname.split('/')[2];
      setActiveTab(currentPath);
        setLoading(false);

    }catch(error){
      console.error('Error in fetching serviceprovider data:', error.message);
    }finally{
      setLoading(false);
    }
  };

 
  const renderListingForm=()=>{
    if(serviceType=='hotel'){
      return <AddHotelListing/>
    }else if(serviceType=='transport'){
      return <AddTransportListing/>
    }else if(serviceType=='guide'){
      return <AddGuideListing/>
    }
  }

  const renderGetListing=()=>{
    if(serviceType=='hotel'){
      return <GetHotelListing setTotalServices={setTotalServices}/>
    }else if(serviceType=='transport'){
      return <GetTransportListing setTotalServices={setTotalServices}/>
    }else if(serviceType=='guide'){
      return <GetGuideListing setTotalServices={setTotalServices}/>
    }
  }

  
    // const getProviderListings

const routeHandler=(route)=>{
  if(route=='addlisting'){
    setAddListingForm(true);
  }
   setProviderRoute(route);
    setActiveTab(route);
   navigate(`/serviceprovider/${route}`);
}

const logoutHandler=()=>{
  setLoading(true);
  localStorage.removeItem('token');
  setToken("");
  navigate("/",{replace:true});
  toast("Logout successfully")
  setTimeout(()=>{
      setLoading(false)
  },1000)}

  const formatPrice = (amount) => {
      return amount.toLocaleString("en-PK", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    };

     const notifyHandler = async () => {
      setNotifyDropdown(!notifyDropdown);
    
      if(unreadNotications>0){
          try {
            const response = await axios.put(
              `${url}api/notifications/mark-as-read`,
              {}, // No body needed, so pass an empty object
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              }
            );
        
            if (response.data.success) {
              console.log(response.data);
              setUnreadNotifications([]);
            }
          } catch (error) {
            console.error("Error marking notifications as read:", error);
          }
    
      }
    };

useEffect(()=>{
  getProviderData();
  window.scrollTo(0, 0);

},[])

useEffect(()=>{
  const getBookings = async () => {
    if (!providerInfo?._id) return;
    try {
      const response = await axios.get(`${url}api/bookings/serviceprovider/${providerInfo._id}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      console.log(response.data.bookings);
      setBooking(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
    const getNotifications=async()=>{
              try {
                  const response = await axios.get(`${url}api/notifications/user`, {
                      headers: { authorization: `Bearer ${token}` },
                  });
                  if(response.data.success){
                      console.log(response.data);
                  setNotifications(response.data.notifications);
                  }
              } catch (error) {
                  console.error("Error fetching notifications:", error);
              }
          };

  getBookings();
  getNotifications();
},[providerInfo]);

if(loading){
    return <div className="loading-spinner flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
        </div>
   
  }

  if(!isSetup){
    
    if(showSetupForm){
      return <ProviderSetupForm  setIsSetup={setIsSetup} setShowSetupForm={setShowSetupForm} setProviderInfo={setProviderInfo} />;
    }else{
      return(
      <div className="setup-provider-profile">
          <h2>Complete Your Service Profile</h2>
          <button onClick={() => setShowSetupForm(true)}>Get Started</button>
          <p className='flex items-center cursor-pointer text-[#1EBEB1]' onClick={()=>navigate(-1)}><img className='w-4 h-4 mr-1' src={assets.back_icon}></img>back</p>
        </div>
      );
    }
  }


  return (
     <div className='provider-dashboard-container'>
    
    {/* Sidebar */}
    <div className="provider-sidebar-container  hidden md:flex">
      <div className="provider-sidebar">
        <h2 className={activeTab === 'dashboard'? '': ""} onClick={() => routeHandler('dashboard')}>Dashboard</h2>
        <hr />
        <div className="provider-sidebar-content">
          <ul>
            <li className={activeTab === 'dashboard'? 'active-tab': ""} onClick={() => routeHandler('dashboard')}>Dashboard</li>
            <li className={activeTab === 'profile'? 'active-tab': ""} onClick={() => routeHandler('profile')}>Profile</li>
            <li className={activeTab === 'addlisting'? 'active-tab': ""} onClick={() => routeHandler('addlisting')}>Add Listing</li>
            <li className={activeTab === 'getlistings'? 'active-tab': ""} onClick={() => routeHandler('getlistings')}>My Listings</li>
            <li className={activeTab === 'bookings'? 'active-tab': ""} onClick={() => routeHandler('bookings')}>Bookings</li>
            {/* <li className={activeTab === 'bookingrequests'? 'active-tab': ""} onClick={() => routeHandler('bookingrequests')}>Booking Requests</li> */}
            <li className={activeTab === 'payments'? 'active-tab': ""} onClick={() => routeHandler('payments')}>Payment Details</li>
            <li className={activeTab === 'reports'? 'active-tab': ""} onClick={() => routeHandler('reports')}>My Reports</li>
          </ul>
          <div className="provider-go-home" onClick={() => navigate('/')}>
          <img src={assets.home1} alt="" />
            <p>Go Home</p>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="provider-content-container">
      
      {/* Topbar */}
      <div className="provider-topbar">
         {/* Hamburger */}
            <button className="md:hidden text-white cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                <MenuIcon sx={{color:"#1EBEB1"}}/>
            </button>
        <h3 className={activeTab === 'dashboard'? 'animate-fadeSlide':""}>{route === 'dashboard' ? `Welcome, ${providerInfo.name?.charAt(0).toUpperCase() + providerInfo.name?.slice(1)}` : "Service Dashboard"}</h3>
        <div className="provider-topbar-icons">
                        <ReportIcon sx={{color:"red"}} className='cursor-pointer' onClick={()=>setIsReportForm(true)}/>
  {/* notification badge */}
                        <div className="relative" onClick={notifyHandler}>
                        <i className="fa-regular fa-bell"></i>
                            {unreadNotications > 0 && (
                                // <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                            <StyledBadge badgeContent={unreadNotications} color="secondary">
                            </StyledBadge>
                        )}
                            {notifyDropdown && (
                                <div className='notify-dropdown absolute top-5 right-0 bg-gray-100 rounded w-[300px] h-[500px] overflow-y-auto no-scrollbar'>
                                    {notifications.map((note) => (
                                        <div key={note._id} className={`px-4 py-2 m-2 flex items-center shadow-sm  bg-white text-xs rounded-md cursor-pointer  ${note.read ? "text-gray-500" : "font-semibold text-black "}`}>
                                            <div>
                                            <i className="fa-regular fa-bell mr-2 border  border-gray-200 shadow-sm px-1 py-1 rounded-2xl "></i>
                                            </div>
                                            <div>
                                            {note.message}
                                            <p className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString('en-US',{hour12: true,})}</p>
                                            </div>
                                        </div>
                                        ))}
                                </div>
                            )}
                        </div>          <div className={click?"profile-image-options-visible ":"profile-image-container"} onClick={()=>setClick(!click)}>
          <Avatar alt="Profile" sx={{ bgcolor: "#1EBEB1"  }} src={providerInfo?.image?.url || ""}>
          <span className='provider-profile-img '> {!providerInfo?.image?.url && providerInfo?.name?.[0]} </span>
          </Avatar>
            <div className="profile-image-options" onClick={logoutHandler}>
            <img src={assets.logout} alt="" />
              <p>Logout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="provider-content">
       {isReportForm && <ReportForm url={url} token={token} onClose={()=>setIsReportForm(false)} />}
        
        {route === 'profile' && <ProviderProfile providerData={providerInfo} setProviderData={setProviderInfo}
        />}
        {route === 'addlisting' && addListingForm && renderListingForm()}
        {route === 'getlistings' && renderGetListing()}
        {route === 'bookings' &&  <ProviderBookings providerId={providerInfo._id} formatPrice={formatPrice}/>}
        {/* {route === 'bookingrequests' && <ProviderBookingRequests bookings={getPendingBookings()} onConfirm={onConfirm} onCancel={onCancel} formatPrice={formatPrice} />} */}
        {route === 'payments' &&  <ProviderPayments providerId={providerInfo._id} formatPrice={formatPrice}/>}
        {route === 'reports' &&  <Reports url={url} token={token}/>}
        {route === 'dashboard' && <div className="dashboard-overview">
          <div className="provider-dashboard-cards">
            <div className="provider-dashboard-card">
              <h4>Total Earning</h4>
              <p>Rs. {formatPrice(providerInfo.totalEarning)}</p> 
            </div>
            <div className="provider-dashboard-card">
              <h4>Total Bookings</h4>
              <p>+{booking.length}</p> 
            </div>
            {/* <div className="provider-dashboard-card">
              <h4> Total Bookings</h4>
              <p>+{booking.filter(booking=>
               
                booking.status=='completed').length}</p> 
            </div> */}
          </div>
        </div>
        }

      </div>
    </div>
                   {/* Mobile Menu */}
                  {menuOpen && (
                    <div className="absolute top-0 left-0 h-[100vh] w-[80%] bg-[black] text-white shadow-md flex flex-col space-y-3 px-6 py-4 z-50 ">
                    <div class="flex items-center justify-between pb-3 border-b border-white/20 ">
                    <h2 class="text-[#1EBEB1] text-lg font-medium">EASYTRIP</h2>
                    <p class="cursor-pointer" onClick={()=>setMenuOpen(false)}><CloseIcon/></p>
                    </div>
            
                      <div className="user-sidebar-content text-sm">
                         <ul>
                            <li className={activeTab === 'dashboard'? 'active-tab': ""} onClick={() => {routeHandler('dashboard');setMenuOpen(false)}}><DashboardIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Dashboard</li>
                            <li className={activeTab === 'profile'? 'active-tab': ""} onClick={() =>{ routeHandler('profile');setMenuOpen(false)}}><PersonIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Profile</li>
                            <li className={activeTab === 'addlisting'? 'active-tab': ""} onClick={() =>{ routeHandler('addlisting');setMenuOpen(false)}}><AddIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Add Listing</li>
                            <li className={activeTab === 'getlistings'? 'active-tab': ""} onClick={() =>{ routeHandler('getlistings');setMenuOpen(false)}}><DisplaySettingsIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> My Listings</li>
                            <li className={activeTab === 'bookings'? 'active-tab': ""} onClick={() =>{ routeHandler('bookings');setMenuOpen(false)}}><BookIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Bookings</li>
                            {/* <li className={activeTab === 'bookingrequests'? 'active-tab': ""} onClick={() => routeHandler('bookingrequests')}>Booking Requests</li> */}
                            <li className={activeTab === 'payments'? 'active-tab': ""} onClick={() =>{ routeHandler('payments');setMenuOpen(false)}}><PaymentIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Payment Details</li>
                            <li className={activeTab === 'reports'? 'active-tab': ""} onClick={() =>{ routeHandler('reports');setMenuOpen(false)}}><ReportIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> My Reports</li>
                          </ul>
                        <div className="user-go-home text-[14px]" onClick={() => {navigate('/');setMenuOpen(false)}}>
                            <HomeIcon sx={{fontSize:"20px", marginTop:"3px",color:"#1EBEB1"}}/>
                            <p>Go Home</p>
                        </div>
                    </div>
                    </div>
                  )}
  </div>
  )
}

export default providerDashboard