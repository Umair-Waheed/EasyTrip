import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
const TokenChecker = () => {
    const navigate=useNavigate();

    useEffect(() => {
      try{

      
        const token = localStorage.getItem('token');
        if(token == "undefined"){
          localStorage.removeItem("token");
          return 
        }
        
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiry = payload.exp * 1000;
          const now = Date.now();
    
          if (now >= expiry) {
            localStorage.removeItem('token');
            alert('Session expired. Please log in again!');
            navigate('/');
          }
        }
      }
        catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("token");
    // Optionally redirect to login
  }
      
      }, []);

    
      
  return null;
}

export default TokenChecker