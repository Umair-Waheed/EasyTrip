import axios from "axios";
import { useContext, } from "react";
import { StoreContext } from "../context/StoreContext";
const getReviews = async (id) => {
let ratingCount=0;   
    const{url}=useContext(StoreContext);
     try {
       const response = await axios.get(`${url}api/reviews/listing/${id}`);
       console.log(response.data);
 
       if (response.data.success) {
        return response.data.reviews;
            }
     } catch (error) {
       //   alert(response.data.message);
       console.log(error);
     }
   };

   
   const getRatings=(data)=>{
     const ratings = data.map((review) =>
      parseFloat(review.rating)
    );
    
    const avg =
    ratings.reduce((sum, curr) => sum + curr, 0) / ratings.length;
   ratingCount=Math.round(avg * 2) / 2; // round to nearest 0.5
    return ratingCount;
  }
  
  
  export{getReviews,getRatings}