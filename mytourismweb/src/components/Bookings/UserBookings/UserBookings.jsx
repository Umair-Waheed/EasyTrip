import React, { useEffect, useState } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "./UserBookings.css";
const UserBookings = ({ bookings,userId,formatPrice }) => {
  const { url, token } = useContext(StoreContext);
  // const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refunds,setRefunds]=useState([]);
    const location = useLocation();

  console.log(bookings);


 const cancelBookingHandler = async (id) => {
  try {
    const response = await axios.put(`${url}api/bookings/${id}/cancel`, {}, {
      headers: { authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
};

  const filteredBookings = bookings?.filter((booking) => {
    if (filter === "all") return true;
    else return booking.status === filter;
  });
  
      const sortedBookings=[...(filteredBookings || [])].sort((a,b)=>
      new Date(b.createdAt) - new Date(a.createdAt));

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(()=>{
        setLoading(false);
      const fetchRefunds = async () => {
        try {
          const response = await axios.get(`${url}api/refund/user/${userId}`, {
            headers: { authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            setRefunds(response.data.refunds);
          }
        } catch (error) {
          console.error("Failed to fetch refunds", error);
        }
      };

      fetchRefunds();
      },[location.key])

    const rejectedRefunds = refunds.filter(refund => refund.status === 'rejected');
const rejectedBookingIds = rejectedRefunds.map(refund => refund.bookingId);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
        Booking Management
      </h1>

      <div className="flex gap-3 space-x-2 mt-8 mb-5">
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
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg ${
            filter === "pending"
              ? "bg-[#1EBEB1] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Pending
        </button> */}
        <button
          onClick={() => setFilter("confirmed")}
          className={`px-4 py-2 rounded-lg ${
            filter === "confirmed"
              ? "bg-[#1EBEB1] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          confirmed
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg ${
            filter === "completed"
              ? "bg-[#1EBEB1] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`px-4 py-2 rounded-lg ${
            filter === "cancelled"
              ? "bg-[#1EBEB1] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          cancelled
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
        </div>
      ) : sortedBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {sortedBookings?.map((booking) => {
            const isRejected = rejectedBookingIds.includes(booking._id.toString());
            return(
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 text-sm md:text-base lg:text-base">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className=" font-semibold text-gray-800">
                      {booking.fullName}
                    </h2>
                    <p className="text-gray-600">{booking.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[booking.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs md:text-sm lg:text-base">
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Booked Service:</span>
                    <span className="font-medium">
                      {booking.serviceType === "hotel"
                        ? "room"
                        : booking.serviceType}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Booking ID:</span>
                    <span className="font-medium">{booking._id}</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Service ID:</span>
                    <span className="font-medium">{booking.listingId}</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Dates:</span>
                    <span className="font-medium">
                      {formatDate(booking.startDate)} -{" "}
                      {formatDate(booking.endDate)}
                    </span>
                  </div>
                  {booking.pricingType == "per_day" ? (
                    <div className="flex flex-wrap justify-between">
                      <span className="text-gray-500">Total Days:</span>
                      <span className="font-medium">{booking.totalDays}</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-between">
                      <span className="text-gray-500">Total Hours:</span>
                      <span className="font-medium">{booking.totalHours}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Contact:</span>
                    <span className="font-medium">{booking.contactNumber}</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Provider Contact:</span>
                    <span className="font-medium">
                      {booking.providerContactInfo?.phone}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Provider Email:</span>
                    <span className="font-medium">
                      {booking.providerContactInfo?.email}
                    </span>
                  </div>
                

                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Payment Status:</span>
                    <span className="font-medium capitalize">
                      {booking.paymentDetails.status}
                    </span>
                  </div>
                  {isRejected &&
                  (<div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Refund Status:</span>
                    <span className="font-medium capitalize">
                      Rejected
                    </span>
                  </div>)
          }
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Created At:</span>
                    <span className="font-medium capitalize">
                      {new Date(booking.createdAt).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap text-sm md:text-base justify-between items-center">
                    {booking.pricingType === "per_day" ? (
                      <span className="text-gray-500 ">
                        {" "}
                        PerDay Price:
                      </span>
                    ) : (
                      <span className="text-gray-500 ">
                        {" "}
                        PerHour Price:
                      </span>
                    )}
                    <span className=" font-bold text-[#1EBEB1]">
                      Rs.{formatPrice(booking.basePrice)}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center">
                    <span className="text-gray-500 ">
                      Total Price:
                    </span>
                    <span className=" font-bold text-[#1EBEB1] line-through">
                      {(booking.serviceType === "hotel" &&
                        booking.pricingType === "per_day") ||
                      (booking.serviceType === "transport" &&
                        booking.pricingType === "per_day") ||
                      (booking.serviceType === "guide" &&
                        booking.pricingType === "per_day")
                        ? "Rs." +
                          formatPrice(booking.basePrice * booking.totalDays)
                        : (booking.serviceType === "transport" &&
                            booking.pricingType === "per_hour") ||
                          (booking.serviceType === "guide" &&
                            booking.pricingType === "per_hour")
                        ? "Rs." +
                          formatPrice(booking.basePrice * booking.totalHours)
                        : ""}
                    </span>
                  </div>
                  {booking.serviceType !== "hotel" ? (
                    <div className="flex flex-wrap justify-between items-center">
                      <span className="text-gray-500 ">Discount:</span>
                      <span className=" font-bold text-[#1EBEB1]">
                        {booking.discountPercentage}%{" "}
                      </span>
                    </div>
                  ) : null}

                  {/* <div className="mt-6 pt-4 "> */}
                  <div className="flex flex-wrap justify-between items-center border-t border-gray-100 mt-2 ">
                    <span className="text-gray-500 ">Final Price:</span>
                    <span className=" font-bold text-[#1EBEB1]">
                      Rs.{formatPrice(booking.totalPrice)}
                    </span>
                  </div>
                  {/* </div> */}
                </div>

                {booking.additionalDetails && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Additional Details:
                    </h3>
                    <p className="text-sm text-gray-600">
                      {booking.additionalDetails}
                    </p>
                  </div>
                )}

                {/* cancel booking button */}
                {isRejected && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelBookingHandler(booking._id)}
                          className="text-md font-medium text-red-500 border mt-3 px-2 py-2 rounded-lg hover:bg-red-100 hover:text-red-800"
                        >
                          Cancel Booking
                        </button>
                      )}

              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
