// AdminHeldPayments.jsx
import React, { useState, useEffect,useRef, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext.jsx';
import './HeldPayments.css';
import { toast } from 'react-toastify';

const HeldPayments = ({formatPrice}) => {
  const { url, token } = useContext(StoreContext);
  const [heldPayments, setHeldPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const[isPay,setIsPay]=useState(false);
  const [amount,setAmount]=useState("");
const [transactionId, setTransactionId] = useState('');
const [paymentId, setPaymentId] = useState('');

    const formRef = useRef(null);

  const payTransferHandler=async(paymentId)=>{
    const id=paymentId;

    try {       
        const response = await axios.put(`${url}api/payment/release/${id}`,{}, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
        )
        if(response.data.success){
          if (formRef.current) {
            formRef.current.submit();
          }  
          toast.success("Payment transferred successfully to provider!");
          setTransactionId('');
        setAmount('')
        }
    
    }
        catch(error){
           toast.error("Somethings went wrong!");
        };
  }

  useEffect(() => {
    const getPayments = async () => {
      
      try {
        
        const response = await axios.get(`${url}api/payment/paymentdetails`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data.payments);
        setHeldPayments(response.data.payments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    getPayments();
  }, [url, token,setHeldPayments]);
//   const releasePayment = async (paymentId) => {
//     try {
//       await axios.post(
//         `${url}api/admin/payments/${paymentId}/release`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setHeldPayments(heldPayments.filter(p => p._id !== paymentId));
//     } catch (error) {
//       console.error("Error releasing payment:", error);
//     }
//   };


 const sortedPayments=[...(heldPayments || [])].sort((a,b)=>
    new Date(b.createdAt) - new Date(a.createdAt));


  return (

    
    <div className="p-4">
      { isPay && <div className="h-[80vh]">
      <div className="max-w-md mt-16 mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-2 text-center">
        Confirm Refund Payment
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Please review Refund payment details before proceeding.
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
          value="http://localhost:5174/admin/held-payment"
        />
        <input
          type="hidden"
          name="cancel_url"
          value="http://localhost:5174/admin/held-payment"
        />
        <input type="hidden" name="amount" value={amount} />
                <input type="hidden" name="item_name" value={"Tranfser to Provider"} />
        <input type="hidden" name="m_payment_id" value={transactionId} />

        
                <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Recipent: {transactionId}</span> 
            </p>
        <div className="bg-gray-100 rounded-lg p-4 space-y-2 mb-3">
  
          <p className="text-sm text-gray-700 ">
            <span className="font-medium">Total Amount:</span> Rs.{amount.toLocaleString("en-PK", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}
    </p>
        </div>

        <button type="submit"
           onClick={async (e) => {
             e.preventDefault(); 
              setLoading(true);
    await payTransferHandler(paymentId); // Wait for any updates
    formRef.current.submit(); // Manually submit
  }}      className={`w-full py-2 px-4 rounded-lg text-white font-semibold cursor-pointer ${
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
}
{!isPay && (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 md:mb-0">Pending Transfer Payments</h1>
    {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
                </div>
            )
    :sortedPayments?.filter(payment => payment.status === "held").length === 0 ? (
      <p className="text-gray-500 mt-5">No Held Payments.</p>
    ) : (
      <div className="space-y-4 overflow-y-auto grid grid-cols-2 gap-10  max-h-[600px] pr-2 mt-5">
        {sortedPayments && sortedPayments
          .filter(payment => payment.status === "held")
          .map(payment => (
            <div
              key={payment._id}
              className="bg-white p-4 rounded-xl shadow-lg  md:items-center p-6 ">
              <div className="card-content">
                <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
                <p><strong>Booking ID:</strong> {payment.booking}</p>
                {/* <p><strong>Payment Id:</strong> {payment._id}</p> */}
                <p><strong>Sender ID:</strong> {payment.user}</p>
                <p><strong>Receiver ID:</strong> {payment.provider}</p>
                <p><strong>Payment status:</strong> {payment.status}</p>
                {/* <p><strong>Payment Transfer status:</strong> {payment.transferStatus}</p> */}
                <p><strong>Total Amount:</strong> Rs.{formatPrice(payment.amount)} </p>
                {/* <p><strong>Refund Amount:</strong> {payment.refundedAmount} {payment.currency}</p> */}
                <p><strong>Admin commission:</strong> Rs.{formatPrice(payment.commissionAmount)}</p>
                <p><strong>Provider Amount:</strong> Rs.{formatPrice(payment.providerAmount)}</p>
                <p><strong>Payment Date:</strong> {new Date(payment.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
              <div className="flex gap-2 mt-5">
                <button className="px-6 py-2 rounded-lg bg-[#1ebeb1] 
                      text-white hover:bg-[#28b5a9] transition-colors cursor-pointer"
                onClick={()=>{
                  setIsPay(true);
                  setTransactionId(payment.provider);
                  setAmount(payment.providerAmount);
                  setPaymentId(payment._id)
                  }}
                >
                  Transfer
                </button>
              </div>
            </div>
          ))}
      </div>
    )}
    </div>
  )}
  </div>
  
  );
};

export default HeldPayments;