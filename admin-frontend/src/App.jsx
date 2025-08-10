import { useState,React, useEffect,useContext } from 'react'
import { Route,Routes,useLocation,useNavigate,Navigate} from 'react-router-dom'
import './App.css'
import { StoreContext } from './context/StoreContext.jsx'
import AdminLogin from './component/Login/AdminLogin.jsx'
import AdminDashboard from './pages/adminDashboard/adminDashboard.jsx'
import GetDestinations from './component/Destinations/GetDestinations/GetDestinations.jsx'
import {ToastContainer,toast} from "react-toastify"
  import 'react-toastify/dist/ReactToastify.css';const App = () => {
  const{token,setToken}=useContext(StoreContext);
  const navigate=useNavigate();
  const[adminRoute,setAdminRoute]=useState("dashboard");
  const BackgroundWrapper = ({ children }) => {
    return (
      <div className="background-container">
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    )
  }

  const AdminHomeScreen = () => {
    return (
      <div className="home-container">
        <div className="home-content">
          <h1 >Welcome to Admin Panel</h1>
          <p>Manage your EasyTrip platform efficiently</p>
          <button 
            className="login-button"
            onClick={() => navigate('/admin/login')}
          >
            Admin Login
          </button>
        </div>
      </div>
    )
  }
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      setToken(storedToken);
      navigate('/admin/dashboard');
    }
  }, []);

  return (
    <>  
        <ToastContainer theme='dark' />
    
    <Routes>
    {!token && (
        <>
          <Route path="/" element={
            <BackgroundWrapper>
              <AdminHomeScreen />
            </BackgroundWrapper>
          } />
          <Route path="/admin/login" element={
            <BackgroundWrapper>
              <AdminLogin />
            </BackgroundWrapper>
          } />
        </>
      )}

      {/* Protected route - only accessible with token */}
      <Route path="/admin/:route" element={
        token ? <AdminDashboard setAdminRoute={setAdminRoute} /> : <Navigate to="/" replace />
      } />

      
      {/* Redirect rules */}
      {/* <Route path="*" element={
        <Navigate to={token ? "/admin/dashboard" : "/"} replace />
      } /> */}
          
          </Routes>

      </>
  )
}

export default App
