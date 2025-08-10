import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
import axios from "axios";
import "./UserPayments.css";
import RefundForm from "../../Refund/RefundForm.jsx";
import { useLocation } from "react-router-dom";

const UserPayments = ({ userId,formatPrice }) => {
  const { url, token } = useContext(StoreContext);
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'held', 'completed', 'failed', 'refunded'
  const [loading, setLoading] = useState(true);
const [activeRefundId, setActiveRefundId] = useState(null);
const[refundAmount,setRefundAmount]=useState("");

    const location = useLocation();

  useEffect(() => {
    const userPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}api/payment/user/${userId}`, {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        // console.log(response.data);
        if (response.data.success) {
          // console.log(response.data.payments);
          setPayments(response.data.payments);
        }
      } catch (error) {
        console.error("Error fetching payments:", error.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId && token) {
      // Only fetch if we have required values
      userPayments();
    }
  }, [url, token,location.key]);

  console.log(payments);

  const filteredPayments = payments?.filter((payment) => {
    if (filter === "all") return true;
    return payment.status === filter;
  });

   const sortedPayments = [...(filteredPayments || [])].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
        Payment Management
      </h1>

      <div className="flex gap-3 space-x-2 mt-8 mb-5 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${
            filter === "all"
              ? "bg-[#1EBEB1] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        {/* <button 
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-[#1EBEB1] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Pending
                </button> */}
        {/* <button 
                    onClick={() => setFilter('held')}
                    className={`px-4 py-2 rounded-lg ${filter === 'held' ? 'bg-[#1EBEB1] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Held
                </button> */}
        {/* <button
          onClick={() => setFilter("held")}
          className={`px-4 py-2 rounded-lg ${
            filter === "held"
              ? "bg-[#1EBEB1] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Completed
        </button> */}
        {/* <button 
                    onClick={() => setFilter('failed')}
                    className={`px-4 py-2 rounded-lg ${filter === 'failed' ? 'bg-[#1EBEB1] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Failed
                </button> */}
        <button
          onClick={() => setFilter("refunded")}
          className={`px-4 py-2 rounded-lg ${
            filter === "refunded"
              ? "bg-[#1EBEB1] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Refunded
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
        </div>
      ) : sortedPayments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No payments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {sortedPayments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 text-xs md:text-sm lg:text-base">
                <div className="flex  justify-end gap-1 mb-2 items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === "refunded"
                        ? statusColors[payment.status] ||
                          "bg-gray-100 text-gray-800"
                        : statusColors["completed"] ||
                          "bg-green-100 text-green-800"
                    }`}
                  >
                    payment:{" "}
                    {payment.status === "refunded"
                      ? payment.status
                      : "completed"}
                  </span>

                  {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${transferStatusColors[payment.transferStatus] || 'bg-gray-100 text-gray-800'}`}>
                                            Receive: {payment.transferStatus}
                                        </span> */}
                </div>
                <div className="border-b border-gray-100 mb-2 ">
                  <div className="flex flex-wrap justify-between mb-2">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="font-medium">
                      #{payment.transactionId}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between mb-2">
                    <span className="text-gray-500">Payment ID:</span>
                    <span className="font-medium">
                      {payment._id}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between mb-2">
                    <span className="text-gray-500">Payment Date:</span>
                    <span className="font-medium">
                      {new Date(payment.createdAt).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Booking ID:</span>
                    <span className="font-medium">{payment.booking}</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">User ID:</span>
                    <span className="font-medium">{payment.user}</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                                        <span className="text-gray-500">Recipient ID:</span>
                                        <span className="font-medium">674eb45a086e4e5631bd9616</span>
                                        {/* <span className="font-medium">{payment.provider}</span> */}
                                    </div>
                  {/* <div className="flex justify-between">
                                        <span className="text-gray-500">Hold Status:</span>
                                        <span className="font-medium">{payment.holdStatus ? 'Yes' : 'No'}</span>
                                    </div> */}
                </div>

                <div className="mt-2 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap justify-between text-sm md:text-base lg:text-base items-center mb-2">
                    <span className="text-gray-500">Total Amount:</span>
                    <span className="font-bold text-[#1EBEB1]">
                      Rs.{formatPrice(payment.amount)}
                    </span>
                  </div>
                  {/* <div className="flex flex-wrap justify-between items-center mb-2">
                                        <span className="text-gray-500">Provider Amount:</span>
                                        <span className="text-md font-medium text-gray-700">
                                            {payment.providerAmount} {payment.currency}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap justify-between items-center mb-2">
                                        <span className="text-gray-500">Platform Fee:</span>
                                        <span className="text-md font-medium text-gray-700">
                                            {payment.commissionAmount} {payment.currency}
                                        </span>
                                    </div> */}
                  {/* {payment.refundedAmount > 0 ? (
                    <div className="flex flex-wrap justify-between items-center">
                      <span className="text-gray-500">Refunded Amount:</span>
                      <span className="text-md font-medium text-red-500">
                        {payment.refundedAmount} {payment.currency}
                      </span>
                    </div>
                    
                  ): ( */}
                    {payment.status == "refunded" ?
                    <div className="flex flex-wrap justify-between text-sm md:text-base lg:text-base items-center mb-2">
                    <span className="text-gray-500">Refund Amount:</span>
                    <span className="text-lg font-bold text-[#1EBEB1]">
                      Rs.{formatPrice(payment.amount)}
                    </span>
                  </div> :
                     <button onClick={() => {setActiveRefundId(payment._id);setRefundAmount(payment.amount)}} className="text-md font-medium text-red-500 border px-2 py-2 rounded-lg hover:bg-red-100 hover:text-red-800">Request to refund</button>
                    }                    {/* )} */}
                </div>
                {activeRefundId && console.log(activeRefundId)}

                {/* <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Transfer Date:</span>
                    <span className="font-medium">
                      {new Date(payment.updatedAt).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div> */}
              </div>
            {activeRefundId && (
            <RefundForm
              paymentId={activeRefundId}
              userId={payment.user}
              amount={refundAmount}
              onClose={() => setActiveRefundId(null)}
            />
          )}
            </div>
          ))
          
          }

        </div>
      )}
    </div>
  );
};

export default UserPayments;
