import React,{useContext,useEffect,useState} from 'react'
import "./AdminLogin.css";
import axios from "axios";
import {StoreContext} from '../../context/StoreContext';
import {assets} from "../../assets/assets.js";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const AdminLogin = () => {
    const{url,setToken}=useContext(StoreContext);
    const[loading,setLoading]=useState(false);
    const navigate=useNavigate();
    const[data,setData]=useState({
        email:"",
        password:""
      });
    
    const onChangeHandler=(event)=>{
        const name=event.target.name;
        const value=event.target.value;
        setData(data=>({...data,[name]:value}));
    }


    const onLogin=async(event)=>{
        event.preventDefault();
        setLoading(true);      
        try{
          //send infromation or login in backend
          const response=await axios.post(`${url}api/admin/login`,data);

          if(response.data.success){
              setToken(response.data.token);
              localStorage.setItem('token',response.data.token);
              toast.success("Welcome to Admin Dashboard");
              navigate('/admin/dashboard');
          }else{
            toast.error("Wrong credentials!");

          }
        }catch(error){
          toast.error(error);
        }
      
        setLoading(false);
        

    }
    const loginCrossHandler=()=>{
      navigate("/");

  }

    useEffect(()=> {   
        const token = localStorage.getItem('token');
        if (token) {
          setToken(token);
        }
  
    window.scrollTo(0, 0)
    },[])
    
    return (
        loading? <div className="login-spinner flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
        </div>:
        <div className='admin-login'>
            <form action="" onSubmit={onLogin} className='admin-login-container'>
                <div className="admin-login-header">
                    <h2>Admin Login </h2> 
                    <img onClick={loginCrossHandler} src={assets.cross_icon} alt="" /> 
                </div>

                {/* eamil login fucntionality */}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='password' required />     
                    <button type='submit'>Login</button>          
            </form>

        </div>
      
  )
}


export default AdminLogin