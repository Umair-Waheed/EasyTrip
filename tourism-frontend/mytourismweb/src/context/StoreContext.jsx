import { createContext,useEffect,useState } from "react";
import axios from "axios";

export const StoreContext =createContext(null);
const StoreContextProvider=(props)=>{
    const[token,setToken]=useState("");
const url="https://easytrip-production.up.railway.app/"

    //image compression helper
    const optimizeCloudinaryUrl = (url) => {
        if (!url) return "";
        return url.replace("/upload/", "/upload/q_auto,f_auto/");
      };



       

useEffect(()=>{
    const token=localStorage.getItem("token");
    setToken(token);
},[])

const contextValue={
    token,
    setToken,
    url,
    optimizeCloudinaryUrl,
}

return(
    <StoreContext.Provider value={contextValue}>
        {props.children}
    </StoreContext.Provider>    
)
}

export default StoreContextProvider
