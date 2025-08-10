import React,{useState,useContext} from 'react'
import "./AddReview.css"
import "../../../../public/star.css"
import {StoreContext} from "../../../context/StoreContext.jsx";
import axios from 'axios';
const AddReview = ({listingId,onReviewAdd}) => {
    const[rating,setRating]=useState("");
    const[comment,setComment]=useState("");
    const[message,setMessage]=useState("");
    const[loading,setLoading]=useState(false);
    const {token,url}=useContext(StoreContext);
    console.log(token);

    const handleRatingChange=(e)=>{
        setRating(e.target.value);
    }

    const handleCommentChange=(e)=>{
        setComment(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
          const response = await axios.post(`${url}api/reviews/${listingId}`, {
            rating,
            comment,
          },{
            headers: {
              Authorization: `Bearer ${token}` 
            }
          }
        );
          console.log(response);
          if (response.data.success) {
            setMessage("Review added successfully!");
            onReviewAdd(response.data.review);
             setRating("");
             setComment("");
             }
        else{
            setMessage("Failed to submit review!");
              }
      }
      catch(error){
                console.error(error);
                setMessage("Something went wrong.");
            }finally{
                setLoading(false);
            }
    };
  return (
    <div className='service-reviews-add-container'>

    <form onSubmit={handleSubmit} className="add-review-form">
        <h1>Leave a Review</h1>
        <p>Your feedback helps others travel better!</p>
          <h2 className='mt-2'>Ratings</h2>
          <div className='flex justify-center'>
        <fieldset className="starability-checkmark">
            <input type="radio" id="no-rate" className="input-no-rate" name="rating" value="1" checked aria-label="No rating." />
            <input type="radio" id="first-rate1" name="rating" value="1" checked={rating === "1"} onChange={handleRatingChange}/>
            <label for="first-rate1" title="Terrible"></label>
            <input type="radio" id="first-rate2" name="rating" value="2" checked={rating === "2"} onChange={handleRatingChange} />
            <label for="first-rate2" title="Not good"></label>
            <input type="radio" id="first-rate3" name="rating" value="3" checked={rating === "3"} onChange={handleRatingChange}/>
            <label for="first-rate3" title="Average"></label>
            <input type="radio" id="first-rate4" name="rating" value="4" checked={rating === "4"} onChange={handleRatingChange}/>
            <label for="first-rate4" title="Very good"></label>
            <input type="radio" id="first-rate5" name="rating" value="5" checked={rating === "5"} onChange={handleRatingChange}/>
            <label for="first-rate5" title="Amazing"></label>

        </fieldset>
        </div>
        <div style={{ marginTop: "1rem" }}>
        <textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={handleCommentChange}
          rows="4"
          style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      {message && <p style={{ marginTop: "1rem", color: "#333" }}>{message}</p>}

    </form>
    </div>
  )
}

export default AddReview;