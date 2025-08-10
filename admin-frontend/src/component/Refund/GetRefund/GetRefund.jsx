import React, { useEffect, useState,useRef, useContext } from 'react';
import { StoreContext } from '../../../context/StoreContext.jsx';
import axios from 'axios';
import "./GetRefund.css"
import { toast } from 'react-toastify';
const GetRefund = () => {
    const { url, token } = useContext(StoreContext);
    const [refunds, setRefunds] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
const [transactionId, setTransactionId] = useState('');
const [amount,setAmount]=useState("");
const [refundId, setRefundId] = useState('');
  const [status, setStatus] = useState('pending');
  const[isPay,setIsPay]=useState(false);

    const formRef = useRef(null);
  
    useEffect(() => {
        const fetchRefunds = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}api/refund/admin/all`, {
                    headers: { authorization: `Bearer ${token}` },
                });
                if (response.data.success) {
                    console.log(response.data.refunds)
                    setRefunds(response.data.refunds);
                }
            } catch (error) {
                console.error('Error fetching refunds:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRefunds();
    }, [url, token]);

    const filteredRefunds = refunds.filter(refund => {
        if (filter === 'all') return true;
        return refund.status === filter;
    });

    const sortedRefunds = [...filteredRefunds].sort(
        (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
    );

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    const formatPrice = (amount) => {
          return amount.toLocaleString("en-PK", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });
        };

        const statusHandler=()=>{
            if(status=='approved'){
                setIsPay(true);
                setShowForm(false);
            }else{
                handleStatusChange();
            }
        }

    const handleStatusChange = async() => {
             
    try {
      setLoading(true);
      const response = await axios.put(`${url}api/refund/admin/update/${refundId}`,
        {status: status,
        message: responseMessage,
        },
      {headers: { authorization: `Bearer ${token}` }});

      // Update local state if needed
      if (response.data.success) {
        console.log(response.data);
 if (formRef.current) {
        formRef.current.submit();
      }        
      // toast.success(response.data.message);
       setShowForm(false);
        setResponseMessage('');
        setTransactionId('');
        setRefundId('')
        setStatus("pending");
      }else {
              console.log("Payment failed: " + response.data.message);
              navigate(-1)
            }
    } catch (error) {
      console.log('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="container mx-auto px-4 py-3">
            {showForm && (
  <div className="refund-container">
    <div className="refund-box">
      <h3>
        {status === 'approved' ? 'Refund Request (Approved)' : 'Reason Request (Rejected)'}
      </h3>

      {status === 'approved' ? (
        <>
         <textarea
          value={responseMessage}
          onChange={(e) => setResponseMessage(e.target.value)}
          placeholder="Enter message for user..."
        />
        </>
      ) : (
        <textarea
          value={responseMessage}
          onChange={(e) => setResponseMessage(e.target.value)}
          placeholder="Enter reason for rejection..."
          rows="4"
        />
      )}

      <div className="refund-btn">
        <button
          className="submit-btn bg-[#E5E7EB] px-2 rounded hover:text-green-400"
          onClick={statusHandler}
          disabled={loading}
        >
          {status==="approved"?
           (loading ? 'Submitting...':"Procceed to Refund"):(loading ? 'Submitting...':'Submit')}
        </button>
        <button className="cancel-btn bg-[#E5E7EB] px-2 rounded hover:text-red-400" onClick={() => setShowForm(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


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
          value="http://localhost:5174/admin/refunds"
        />
        <input
          type="hidden"
          name="cancel_url"
          value="http://localhost:5174/admin/refunds"
        />
        <input type="hidden" name="amount" value={amount} />
                <input type="hidden" name="item_name" value={"Refund"} />
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

        <button
           onClick={async () => {
    setLoading(true);
    await handleStatusChange(); // Wait for any updates
    formRef.current.submit(); // Manually submit
  }}
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
}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Refund Management</h1>

            <div className="flex gap-3 flex-wrap mb-6">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg ${
                            filter === status
                                ? 'bg-[#1EBEB1] text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
                </div>
            ) : sortedRefunds.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No refund requests found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {sortedRefunds.map((refund) => (
                        <div key={refund._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ">
                            <div className="p-6">
                                <div className="flex justify-end mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[refund.status] || 'bg-gray-100 text-gray-800'}`}>
                                        {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-3 border-b pb-3 border-gray-200">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Refund ID:</span>
                                        <span className="font-medium">{refund._id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payment ID:</span>
                                        <span className="font-medium">{refund.paymentId?._id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Booking ID:</span>
                                        <span className="font-medium">{refund.bookingId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payment Date:</span>
                                        <span className="font-medium">{new Date(refund.paymentId?.createdAt).toLocaleString('en-PK', {dateStyle: 'medium',timeStyle: 'short'})}</span>
                                        
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">User ID:</span>
                                        <span className="font-medium">{refund.userId?._id}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Amount:</span>
                                        <span className="text-md font-bold text-[#1EBEB1]">Rs. {formatPrice(refund.amount)}</span>
                                    </div>
                                    <div className="flex justify-between mb-3 items-start">
                                        <span className="text-gray-500 mr-10">Reason:</span>
                                        <span className="text-md font-medium text-gray-700">{refund.reason}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Requested At:</span>
                                        <span className="font-medium">{new Date(refund.requestedAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                            {refund.status == 'pending' &&
                                <div className="flex gap-2 mt-5 mx-5 mb-5">
                                <button
                                className="px-6 py-2 rounded-lg bg-[#1ebeb1] 
                                 text-white hover:bg-[#28b5a9] transition-colors cursor-pointer"
                                onClick={() => {setStatus('approved');
                                    setRefundId(refund._id);
                                setTransactionId(refund.userId?._id);
                                setShowForm(true);
                                setAmount(refund.amount)
                                }}
                                disabled={loading}
                                >
                                Approve
                                </button>

                                <button
                                className="px-6 py-2 border rounded-lg text-gray-800
                                hover:bg-red-600 transition-colors hover:text-white cursor-pointer"                                
                                onClick={() => {setStatus('rejected');
                                setRefundId(refund._id);
                                setTransactionId(refund.userId?._id);
                                setShowForm(true);

                                }}
                                disabled={loading}
                                >
                                Reject
                                </button>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GetRefund;
