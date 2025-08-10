import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import "./PaymentForm.css";
import { assets } from "../../../assets/assets.js";
import { useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext.jsx";
import { toast } from "react-toastify";
const PaymentForm = () => {
  // const [cardNumber, setCardNumber] = useState('');
  // const [expiry, setExpiry] = useState('');
  // const [cvc, setCvc] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { url, token } = useContext(StoreContext);
  const { state } = useLocation();
  const formRef = useRef(null);
  const { userId, amount,basePrice, bookingId, serviceType, providerId } =
    state.PaymentData;
  console.log(state.PaymentData);

  const handlePay = async (e) => {
    console.log("handler call");
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        providerId,
        bookingId,
        amount,
        currency: "PKR",
      };
      const response = await axios.post(`${url}api/payment/create`, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      // toast.success("Payment Successful!");

      if (response.data.success) {
        // toast.success("Backend payment recorded.");
        formRef.current.submit();
      } else {
        toast.error("Payment failed: " + response.data.message);
        navigate(-1)
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  });


  //   return (
  //     <div className='h-[100vh]'>
  //       <div className="payment-header ml-20 flex justify-between w-[55%]">
  //             <div onClick={()=>navigate(-1)} className="flex items-center cursor-pointer  ">
  //               <img className='w-[16px] h-[16px] mr-1' src={assets.back_icon} alt="" />
  //               <p>back</p>
  //           </div>
  //        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2 mt-10 mb-8">
  //         Complete Your Payment</h1>

  //       </div>
  //       <div className=' flex justify-center items-center'>
  //     <div className=" payment-card max-w-md  mx-auto h-[80vh] rounded-xl
  //  overflow-hidden md:max-w-2xl p-6">
  //   <div className="text-center mb-6">
  //     <h2 className="text-2xl font-bold   text-gray-800">Pay Rs. {amount}</h2>
  //   </div>

  //     <p className="text-gray-600 mt-5 mb-5"><strong>RecipientID:</strong> 674eb45a086e4e563....</p>
  //     <p className="text-gray-600 mt-5 mb-5"><strong>Enter your card details</strong></p>

  //     {/* Card Number Field */}
  //     <form action="" className="space-y-4">
  //     <div>
  //       <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
  //         Card Number
  //       </label>
  //       <input
  //         type="text"
  //         id="cardNumber"
  //         placeholder="1234 5678 9012 3456"
  //         value={cardNumber}
  //         required
  //         onChange={(e) => setCardNumber(e.value)}
  //         maxLength={19}
  //         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1EBEB1] focus:border-[#1EBEB1] outline-none transition"
  //    />
  //     </div>

  //     {/* Expiry and CVC Row */}
  //     <div className="grid grid-cols-2 gap-4">
  //       {/* Expiry Date */}
  //       <div>
  //         <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
  //           Expiry Date
  //         </label>
  //         <input
  //           type="text"
  //           id="expiry"
  //           placeholder="MM/YY"
  //           required
  //           maxLength={5}
  //           value={expiry}
  //           onChange={(e) => setExpiry(e.value)}
  //           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1EBEB1] focus:border-[#1EBEB1] outline-none transition"
  //         />
  //       </div>

  //       {/* CVC */}
  //       <div>
  //         <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
  //           CVC
  //         </label>
  //         <input
  //           type="text"
  //           id="cvc"
  //           placeholder="123"
  //           required
  //           maxLength={4}
  //           value={cvc}
  //           onChange={(e) => setCvc(e.value)}
  //           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1EBEB1] focus:border-[#1EBEB1] outline-none transition"
  //        />
  //       </div>
  //     </div>

  //     {/* Pay Button */}
  //     <button
  //       onClick={handlePay}
  //       disabled={loading}
  //       className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
  //         loading
  //           ? 'bg-[#1EBEB1] cursor-not-allowed'
  //           : 'bg-[#1EBEB1] hover:bg-[#28b5a9]'
  //       }`}
  //     >
  //       {loading ? (
  //         <span className="flex items-center justify-center">
  //           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //           </svg>
  //           Processing...
  //         </span>
  //       ) : (
  //         'Pay Now'
  //       )}
  //     </button>
  //     </form>

  //   {/* Security Message */}
  //   <div className="mt-6 text-center text-xs text-gray-500">
  //     <p>Your payment is secured with 256-bit encryption</p>
  //   </div>
  // </div>
  // </div>
  // </div>
  //   );
  // const amountCal=(amount)=>{
  //   let perAmount=0.023*amount; //per 0.023
  //   return amount+perAmount;

  // }

  return (
  <div className="h-[80vh]">
      <div className="max-w-md mt-16 mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-2 text-center">
        Confirm Your Payment
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Please review your payment details before proceeding.
      </p>

      <form
        ref={formRef}
        action="https://sandbox.payfast.co.za/eng/process"
        method="post"
        className="space-y-4"
      >
        <input type="hidden" name="merchant_id" value="10038820" />
        <input type="hidden" name="merchant_key" value="rmrr5npxlrq2t" />
        <input
          type="hidden"
          name="return_url"
          value="http://localhost:5173/user/bookingRequests"
        />
        <input
          type="hidden"
          name="cancel_url"
          value="http://localhost:5173/user/bookingRequests"
        />
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="item_name" value={serviceType} />
        <input type="hidden" name="m_payment_id" value={bookingId} />

        <div className="bg-gray-100 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Service Type:</span> {serviceType}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Booking ID:</span> {bookingId}
          </p>
          {/* <p className="text-sm text-gray-700">
            <span className="font-medium">Amount:</span> Rs. {basePrice.toLocaleString("en-PK", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}
          </p> */}
  
          <p className="text-sm text-gray-700">
            <span className="font-medium">Final Amount:</span> Rs. {amount.toLocaleString("en-PK", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}
        <span className='text-[#7d7f7c] text-[14px]'>&nbsp;&nbsp;// after discount applied </span>  </p>
        </div>

        <button
          onClick={handlePay}
          type="submit"
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
            loading
              ? "bg-[#1ebeb1] cursor-not-allowed"
              : "bg-[#1ebeb1] hover:bg-[#28b5a9]"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
    </div>
  );
};

export default PaymentForm;
