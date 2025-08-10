import React, { useState,useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./RefundForm.css";
import { StoreContext } from "../../context/StoreContext.jsx";

const RefundForm = ({ paymentId, userId, amount, onClose }) => {
  console.log( paymentId, userId, amount)
     const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const {url,token}=useContext(StoreContext);

  const submitRefund = async (e) => {
    e.preventDefault();
    if (!reason.trim()){
        return toast.error("Reason is required");
    }
    setLoading(true);
    console.log("working")

    try {
      const response = await axios.post(`${url}api/refund/create`, {
        paymentId,userId,amount,reason,},
      {
      headers: { authorization: `Bearer ${token}` },

      });
        console.log("working")

      if(response.data.success){
      toast.success(response.data.message);
      onClose(); // close modal
      }else{
        toast.error(response.data.message);
        
      }
    } catch (error) {
       const errMsg = error.response?.data?.message || "An unexpected error occurred";
        toast.error(errMsg);
        console.error("Refund error:", response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
<div className="refund-container">
      <div className="refund-box">
        <h3>Request a Refund</h3>
        By requesting a refund, you agree to our
        <a href="/refund-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF", marginLeft: "4px" }}>
          Refund Policy
        </a>.
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter genuine reason for refund..."
        />
        <div className="refund-btn">
          <button className="submit-btn bg-[#E5E7EB] px-2 rounded hover:text-green-400" onClick={submitRefund} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button className="cancel-btn bg-[#E5E7EB] px-2 rounded hover:text-red-400" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>  )
}

export default RefundForm