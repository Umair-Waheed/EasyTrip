import React, { useContext, useState, useEffect } from 'react';
import "./userDashboard.css"
import axios from "axios";
import { assets } from '../../assets/assets.js';
import { useNavigate, useParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import UserProfile from "../../components/User/UserProfile/UserProfile.jsx";
import UserBooking from '../../components/Bookings/UserBookings/UserBookings.jsx';
import UserPayments from '../../components/PaymentDetails/UserPayments/UserPayments.jsx';
import UserBookingRequests from '../../components/UserBookingRequests/UserBookingRequests.jsx';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import BookIcon from '@mui/icons-material/Book';
import AddCardIcon from '@mui/icons-material/AddCard';
import PaymentIcon from '@mui/icons-material/Payment';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ReportIcon from '@mui/icons-material/ReportGmailerrorred';
import ReportForm from '../../components/ReportForm/ReportForm.jsx';
import Reports from '../../components/Reports/Reports.jsx';
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 0,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const UserDashboard = ({ setProviderRoute,unreadNotications,setUnreadNotifications }) => {
    const { route } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const { url, token,setToken } = useContext(StoreContext);
    const [userBooking, setUserBooking] = useState([]);
    const [activeTab, setActiveTab] = useState("");
    const [click, setClick] = useState(false);
    const [loading,setLoading]=useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifyDropdown,setNotifyDropdown]=useState(false);
      const [notifications,setNotifications]=useState({});
      const[isReportForm,setIsReportForm]=useState(false);
    
// const[isLoading,setIsLoading]=useState(true);
    const routeHandler = (route) => {
        setProviderRoute(route);
        setActiveTab(route);
        navigate(`/user/${route}`);
    };

    const paymentHandler = ({ userId,bookingId,serviceType,basePrice, amount, providerId }) => {
        const PaymentData = {
            userId,bookingId,basePrice, amount,serviceType, providerId
        }
        navigate(`/user/payment/${bookingId}`, {
            state: { PaymentData }
        });
    };

const logoutHandler=()=>{
  setLoading(true);
  localStorage.removeItem('token');
  setToken("");
  toast("Logout successfully")
  setLoading(false)
  navigate("/",{replace:true});
}

 
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

    useEffect(() => {
        const getUserData = async () => {
            try {
                let userId = "";
                if (token) {
                    const decodeToken = JSON.parse(atob(token.split(".")[1]));
                    userId = decodeToken.id;
                }
                if (!userId) {
                    throw new Error("user ID not found in token");
                }

                const response = await axios.get(`${url}api/user/${userId}`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                if(response.data.success){
                    console.log(response.data);
                    setUserData(response.data.isUser);
                }else{
                    console.log("error")
                }
            } catch (error) {
                console.error('Error in fetching user data:', error.message);
            }
        };
        getUserData();
        window.scrollTo(0, 0);
    }, []);
    // console.log(userData)

    useEffect(() => {
        const currentPath = window.location.pathname.split('/')[2];
        setActiveTab(currentPath || 'dashboard');
    }, []);

    useEffect(() => {
        const getBookings = async () => {
            if (!userData?._id) return;
            try {
                const response = await axios.get(`${url}api/bookings/user/${userData._id}`, {
                    headers: { authorization: `Bearer ${token}` },
                });
                if(response.data.success){
                    console.log(response.data);
                setUserBooking(response.data.bookings);
                }else{
                    console.log("error")
                }
                setUserBooking(response.data.bookings);
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
    }, [userData]);
// console.log(userBooking);
// console.log(notifications);

    return (
         loading? <div className="login-spinner flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
        </div>:
        <div className='user-dashboard-container'>
            
            {/* Sidebar */}
            <div className="user-sidebar-container hidden md:flex">
                <div className="user-sidebar">
                    <h2 className={activeTab === 'dashboard' ? '' : ""} onClick={() => routeHandler('dashboard')}>Dashboard</h2>
                    <hr />
                
                    <div className="user-sidebar-content">
                        <ul>
                            <li className={activeTab === 'dashboard' ? 'active-tab' : ""} onClick={() => routeHandler('dashboard')}>Dashboard</li>
                            {/* <li className={activeTab === 'profile' ? 'active-tab' : ""} onClick={() => routeHandler('profile')}>Profile</li> */}
                            <li className={activeTab === 'bookings' ? 'active-tab' : ""} onClick={() => routeHandler('bookings')}>Bookings</li>
                            <li className={activeTab === 'bookingRequests' ? 'active-tab' : ""} onClick={() => routeHandler('bookingRequests')}>Proceed to Payment</li>
                            <li className={activeTab === 'payments' ? 'active-tab' : ""} onClick={() => routeHandler('payments')}>Payment Details</li>
                            <li className={activeTab === 'reports' ? 'active-tab' : ""} onClick={() => routeHandler('reports')}>My Reports</li>
                        </ul>
                        <div className="user-go-home" onClick={() => navigate('/')}>
                            <img src={assets.home1} alt="" />
                            <p>Go Home</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="user-content-container">
                {/* Topbar */}
                <div className="user-topbar">
                 {/* Hamburger */}
                  <button className="md:hidden text-white cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                    <MenuIcon sx={{color:"#1EBEB1"}}/>
                  </button>
                    <h3 className={activeTab === 'dashboard' ? 'animate-fadeSlide' : ""}>
                        {route === 'dashboard' ? `Welcome, ${userData.name?.charAt(0).toUpperCase() + userData.name?.slice(1)}` : "User Dashboard"}
                        {/* {route === 'dashboard' ? `Welcome, Tayyab` : "User Dashboard"} */}
                    </h3>
                    <div className="user-topbar-icons">
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
                        </div>
                                    
                        <div className={click ? "profile-image-options-visible " : "profile-image-container"} onClick={() => setClick(!click)}>
                            <Avatar alt="Profile" sx={{ bgcolor: "#1EBEB1"  }} src={userData?.image?.url || ""}>
                                      <span className='user-profile-img '> {!userData?.image?.url && userData?.name?.[0]} </span>
                                      </Avatar>                                    

                            <div className="profile-image-options" onClick={logoutHandler}>
                                <img src={assets.logout} alt="" />
                                <p>Logout</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="user-content ">
    
                {isReportForm && <ReportForm url={url} token={token} onClose={()=>setIsReportForm(false)} />}
                    {/* {route === 'profile' && <UserProfile ussserData={userData} />} */}
                    {route === 'bookings' && <UserBooking bookings={userBooking} userId={userData._id} formatPrice={formatPrice} />}
                    {route === 'bookingRequests' && <UserBookingRequests bookings={userBooking?userBooking:[]} onPay={paymentHandler} formatPrice={formatPrice}/>}
                    {route === 'payments' && <UserPayments userId={userData._id} formatPrice={formatPrice}/>}
                    {route === 'reports' && <Reports url={url} token={token}/>}
                    {route === 'dashboard' && <div className="dashboard-overview">
                        <div className="user-dashboard-cards">
                            <div className="user-dashboard-card">
                                <h4>Total Bookings</h4>
                                <p>{userBooking?userBooking.length:"0" }</p>
                            </div>
                            <div className="user-dashboard-card">
                                <h4>Successfull Bookings</h4>
                                <p>{
                                    userBooking?userBooking.filter(booking => 
                                        booking.status == 'completed'
                                    ).length :"0"
                                }</p>
                            </div>
                            <div className="user-dashboard-card">
                                <h4>Total Spendings</h4>
                                {userData?.spendings !== undefined ? (
                                <p>Rs. {formatPrice(userData.spendings)}</p>
                                ) : (
                                <p>0</p>
                                )}                                
                            </div>
                        </div>
                    </div>}
                </div>
            </div>

              {/* Mobile Menu */}
                  {menuOpen && (
                    <div className="absolute top-0 left-0 h-[100vh] w-[80%] bg-[black] text-white shadow-md flex flex-col space-y-3 px-6 py-4 z-50 ">
                    <div className="flex items-center justify-between pb-3 border-b border-white/20 ">
                    <h2 className="text-[#1EBEB1] text-lg font-medium">EASYTRIP</h2>
                    <p className="cursor-pointer" onClick={()=>setMenuOpen(false)}><CloseIcon/></p>
                    </div>
            
                      <div className="user-sidebar-content text-sm">
                        <ul>
                            <li className={activeTab === 'dashboard' ? 'active-tab' : ""} onClick={() => {routeHandler('dashboard');setMenuOpen(false)}}><DashboardIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Dashboard</li>
                            {/* <li className={activeTab === 'profile' ? 'active-tab' : ""} onClick={() => routeHandler('profile')}>Profile</li> */}
                            <li className={activeTab === 'bookings' ? 'active-tab' : ""} onClick={() => {routeHandler('bookings');setMenuOpen(false)}}><BookIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Bookings</li>
                            <li className={activeTab === 'bookingRequests' ? 'active-tab' : ""} onClick={() => {routeHandler('bookingRequests');setMenuOpen(false)}}><AddCardIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Proceed to Payment</li>
                            <li className={activeTab === 'payments' ? 'active-tab' : ""} onClick={() => {routeHandler('payments');setMenuOpen(false)}}><PaymentIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> Payment Details</li>
                            <li className={activeTab === 'reports' ? 'active-tab' : ""} onClick={() => {routeHandler('reports');setMenuOpen(false)}}><ReportIcon sx={{fontSize:"20px",marginBottom:"3px",color:"#1EBEB1"}}/> My Reports</li>

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

export default UserDashboard;