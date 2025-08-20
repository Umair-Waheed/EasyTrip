import React, { useEffect, useState,useContext } from 'react'
import {useLocation} from "react-router-dom"
import './adminDashboard.css'
import axios from "axios"
import { assets } from '../../assets/assets.js'
// import {useNavigate} from "react-router-dom"
import {StoreContext} from "../../context/StoreContext.jsx"
import { useNavigate,useParams } from 'react-router-dom'
import GetDestinations from "../../component/Destinations/GetDestinations/GetDestinations.jsx"
import AddDestinations from "../../component/Destinations/AddDestinations/AddDestinations.jsx"
import Avatar from '@mui/material/Avatar';
import HeldPayments from '../../component/HeldPayments/HeldPayments.jsx'
import GetBookings from '../../component/GetBookings/GetBookings.jsx'
import PaymentDetails from "../../component/PaymentDetails/PaymentDetails.jsx"
import GetRefund from '../../component/Refund/GetRefund/GetRefund.jsx'
import {toast} from "react-toastify"
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import DestinationIcon from '@mui/icons-material/BeachAccess';
import BookIcon from '@mui/icons-material/Book';
import PaymentIcon from '@mui/icons-material/Payment';
import AddIcon from '@mui/icons-material/Add';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ReportIcon from '@mui/icons-material/ReportGmailerrorred';
import ServiceProviders from '../../component/ServiceProviders/ServiceProviders.jsx' 
import Report from '../../component/Reports/Report.jsx'
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 0,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));
const adminDashboard = ({setAdminRoute}) => {
  const [providerInfo,setProviderInfo]=useState({});
  const [activeTab,setActiveTab]=useState("dashboard");
  const [click,setClick]=useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadNotications,setUnreadNotifications]=useState([]);
  const{url,token,setToken}=useContext(StoreContext);
  const [notifyDropdown,setNotifyDropdown]=useState(false);
  const [notifications,setNotifications]=useState({});

  const { route } = useParams();
  const location = useLocation();
  const navigate=useNavigate();


const routeHandler=(route)=>{
  setAdminRoute(route);
    setActiveTab(route);
   navigate(`/admin/${route}`);
}

const logoutHandler=()=>{
  localStorage.removeItem('token');
  setToken("");
  toast("Admin Logout successfully!")
  navigate("/",{replace:true});
  setTimeout(()=>{
  },1000)}

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

const fetchUnreadNotification=async()=>{
        const token =localStorage.getItem("token");
        const response=await axios.get(`${url}api/notifications/unread-notify`,{
         headers: {
            Authorization: `Bearer ${token}`
          }});
          // console.log(response.data);      
          // const adminNotify=response.data?.filter(notify=>notify.userRole=="admin")   
          // console.log(adminNotify);      
        setUnreadNotifications(response.data.count);
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
      fetchUnreadNotification();
      getNotifications();

  window.scrollTo(0, 0);
},[token]);

const formatPrice = (amount) => {
      return amount.toLocaleString("en-PK", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    };


  return (
     <div className='admin-dashboard-container'>
    
    {/* Sidebar */}
    <div className="admin-sidebar-container  hidden md:flex">
      <div className="admin-sidebar">
        <h2 className={activeTab === 'dashboard'? '': ""} onClick={() => routeHandler('dashboard')}>Dashboard</h2>
        <hr />
        <div className="admin-sidebar-content">
          <ul>

            <li className={activeTab === 'dashboard'? 'active-tab': ""} onClick={() => routeHandler('dashboard')}>Dashboard</li>
            <li className={activeTab === 'add-destinations'? 'active-tab': ""} onClick={() => routeHandler('add-destinations')}>Add Destinations</li>
            <li className={activeTab === 'destinations'? 'active-tab': ""} onClick={() => routeHandler('destinations')}>Destinations</li>
            <li className={activeTab === 'bookings'? 'active-tab': ""} onClick={() => routeHandler('bookings')}>Bookings</li>
            <li className={activeTab === 'held-payment'? 'active-tab': ""} onClick={() => routeHandler('held-payment')}>Pending Transfers</li>
            <li className={activeTab === 'payment'? 'active-tab': ""} onClick={() => routeHandler('payment')}>Payments Details</li>
            <li className={activeTab === 'refunds'? 'active-tab': ""} onClick={() => routeHandler('refunds')}>Refund Details</li>
            <li className={activeTab === 'serviceproviders'? 'active-tab': ""} onClick={() => routeHandler('serviceproviders')}>Service Providers</li>
            <li className={activeTab === 'reports'? 'active-tab': ""} onClick={() => routeHandler('reports')}>User Reports</li>
            {/* <li className={activeTab === 'notifications'? 'active-tab': ""} onClick={() => routeHandler('notifications')}>Notifications</li> */}
          </ul>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="admin-content-container">
      
      {/* Topbar */}
      <div className="admin-topbar">
         {/* Hamburger */}
                    <button className="md:hidden text-white cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                        <MenuIcon sx={{color:"#1EBEB1"}}/>
                    </button>
        <h3 className={activeTab === 'dashboard'? 'animate-fadeSlide':""}>Welcomeback Dear Admin!</h3>
        <div className="admin-topbar-icons">
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
                                        <div key={note._id} className={`px-4 py-2 m-2 flex items-center shadow-sm  bg-white h-[100px]  text-xs rounded-md cursor-pointer  ${note.read ? "text-gray-500" : "font-semibold text-black "}`}>
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
          <Avatar alt="Profile" className='admin-profile-img' sx={{ bgcolor: "#1EBEB1",width: 35, height: 35 }} >UM</Avatar>
            <div className="profile-image-options" onClick={logoutHandler}>
            <img src={assets.logout_icon} alt="" />
              <p>Logout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="admin-content">

        {route === 'add-destinations' && <AddDestinations />}
        {route === 'destinations' && <div><GetDestinations /></div>}
        {route === 'bookings' && <div><GetBookings formatPrice={formatPrice}/></div>}
        {route === 'held-payment' && <div><HeldPayments formatPrice={formatPrice}/></div>}
        {route === 'payment' && <div><PaymentDetails formatPrice={formatPrice}/></div>}
        {route === 'refunds' && <div><GetRefund /></div>}
        {route === 'serviceproviders' && <div><ServiceProviders url={url} token={token}/></div>}
        {route === 'reports' && <div><Report url={url} token={token}/></div>}
        {/* {route === 'notifications' && <div>Notifications</div>} */}
        {route === 'dashboard' && <div className="dashboard-overview">
          <div className="admin-dashboard-cards">
            <div className="admin-dashboard-card">
              <h4>Total Listings</h4>
              <p>+12</p> 
            </div>
            <div className="admin-dashboard-card">
              <h4>Total Bookings</h4>
              <p>+34</p> 
            </div>
            <div className="admin-dashboard-card">
              <h4>Notifications</h4>
              <p>+5</p> 
            </div>
          </div>
        </div>
        }

      </div>
    </div>

     {menuOpen && (
                        <div className="absolute top-0 left-0 h-[100vh] w-[80%] bg-[black] text-white shadow-md flex flex-col space-y-3 px-6 py-4 z-50 ">
                        <div className="flex items-center justify-between pb-3 border-b border-white/20 ">
                        <h2 className="text-[#1EBEB1] text-lg font-medium">EASYTRIP</h2>
                        <p className="cursor-pointer" onClick={()=>setMenuOpen(false)}><CloseIcon/></p>
                        </div>
                
                          <div className="admin-sidebar-content text-sm">
                             <ul>
                                <li className={activeTab === 'dashboard'? 'active-tab': ""} onClick={() => {routeHandler('dashboard');setMenuOpen(false)}}><DashboardIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Dashboard</li>
                                <li className={activeTab === 'add-destinations'? 'active-tab': ""} onClick={() => {routeHandler('add-destinations');setMenuOpen(false)}}><AddIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Add Destinations</li>
                                <li className={activeTab === 'destinations'? 'active-tab': ""} onClick={() => {routeHandler('destinations');setMenuOpen(false)}}><DestinationIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Destinations</li>
                                <li className={activeTab === 'bookings'? 'active-tab': ""} onClick={() =>{ routeHandler('bookings');setMenuOpen(false)}}><BookIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Bookings</li>
                                <li className={activeTab === 'held-payment'? 'active-tab': ""} onClick={() => {routeHandler('held-payment');setMenuOpen(false)}}><PaymentIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Pending Transfers</li>
                                <li className={activeTab === 'payment'? 'active-tab': ""} onClick={() => {routeHandler('payment');setMenuOpen(false)}}><PaymentIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Payments Details</li>
                                <li className={activeTab === 'refunds'? 'active-tab': ""} onClick={() =>{ routeHandler('refunds');setMenuOpen(false)}}><MoneyOffIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Refund Details</li>
                                <li className={activeTab === 'reports'? 'active-tab': ""} onClick={() =>{ routeHandler('reports');setMenuOpen(false)}}><ReportIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> User Reports</li>
                              </ul>
                          
                        </div>
                        </div>
                      )}

  </div>
  )
}

export default adminDashboard