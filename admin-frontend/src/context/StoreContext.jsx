import { createContext,useEffect,useState } from "react";
import axios from "axios";
import { fromURL, blobToURL } from 'image-resize-compress';

export const StoreContext =createContext(null);
const StoreContextProvider=(props)=>{
    const[token,setToken]=useState("");
    const url="https://easytrip-production.up.railway.app/";


    //image resizer pkg

        const handleURL = async (imageUrl) => {
        const quality = 80;
        const width = 'auto';
        const height = 'auto';
        const format = 'jpeg';

        const resizedBlob = await fromURL(imageUrl, quality, width, height, format);
        const url = await blobToURL(resizedBlob);

        console.log('Resized Blob:', resizedBlob);
        console.log('Blob URL:', url);
        };

useEffect(()=>{
    const token=localStorage.getItem("token");
    setToken(token);
},[])

const contextValue={
    token,
    setToken,
    url,
    handleURL
}

return(
    <StoreContext.Provider value={contextValue}>
        {props.children}
    </StoreContext.Provider>    
)
}

export default StoreContextProvider
