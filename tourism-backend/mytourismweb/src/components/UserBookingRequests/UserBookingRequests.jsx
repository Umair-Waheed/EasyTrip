import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const  UserBookingRequests= ({ bookings, onPay,formatPrice }) => {
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed');
    console.log(confirmedBookings);

    const location = useLocation();
    if (!confirmedBookings.length) {
      return <p className="text-gray-600">No confirmed bookings yet.</p>;
    }
    const sortedBookings = [...(confirmedBookings || [])].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );


    useEffect(()=>{
      
    },[location.key])
  
    
  
    return (
       <div className="container mx-auto px-4 py-3">
       <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
        One Step Away from Your Trip
      </h1>

      {sortedBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No confirmed bookings yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-h-[800px] overflow-y-auto pr-2">
          {sortedBookings.map((booking) => (
            <div
              key={booking._id}
              className="m-2 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 text-sm md:text-base lg:text-base">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {booking.serviceType === 'hotel' ? 'room booking' : `${booking.serviceType} booking`}
                    </h2>
                    <p className="text-gray-600">{booking.serviceProvider?.name || 'Service Provider'}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    payment: pending
                  </span>
                  
                </div>

                <div className="space-y-3 text-xs md:text-sm lg:text-base">
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Booking ID:</span>
                    <span className="font-medium">{booking._id}</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Booking Status:</span>
                    <span className="font-medium">Confirmed</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Booking Dates:</span>
                    <span className="font-medium">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">
                      {booking.totalDays ? 'Total Days:' : 'Total Hours:'}
                    </span>
                    <span className="font-medium">
                      {booking.totalDays || booking.totalHours}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-500">Created At:</span>
                    <span className="font-medium">
                      {new Date(booking.createdAt).toLocaleString('en-PK', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="space-y-2 mb-4">
                    {booking.serviceType === 'hotel' ? (
                      <>
                        <div className="flex flex-wrap justify-between">
                          <span className="text-gray-500">PerDay Original Price:</span>
                          <span className="font-medium line-through">
                            Rs.{formatPrice(booking.basePrice)}
                          </span>
                        </div>
                        <div className="flex flex-wrap justify-between">
                          <span className="text-gray-500">Discounted Total Price:</span>
                          <span className="font-medium text-[#1EBEB1]">
                            Rs.{formatPrice(booking.totalPrice)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-wrap justify-between">
                          <span className="text-gray-500">Original Price:</span>
                          <span className="font-medium line-through">
                            {booking.pricingType === 'per_day' 
                              ? "Rs."+formatPrice(booking.basePrice * booking.totalDays) 
                              : "Rs."+formatPrice(booking.basePrice * booking.totalHours)}
                          </span>
                        </div>
                        <div className="flex flex-wrap justify-between">
                          <span className="text-gray-500">Discount:</span>
                          <span className="font-medium">
                            {booking.discountPercentage}%
                          </span>
                        </div>
                        <div className="flex flex-wrap justify-between">
                          <span className="text-gray-500">Final Price:</span>
                          <span className="font-bold text-[#1EBEB1]">
                            Rs.{formatPrice(booking.totalPrice)}
                          </span>
                        </div>
                       
                      </>
                    )}
                  </div>
                  {/*   */}

                  {booking.paymentDetails?.status === "pending" && (
                    <button
                      onClick={() => onPay({
                        userId:booking.user,
                        bookingId: booking._id,
                        basePrice:booking.basePrice,
                        amount: booking.totalPrice,
                        serviceType:booking.serviceType,
                        providerId: booking.serviceProvider?._id,
                      })}
                      className="w-full px-4 py-2 rounded-lg bg-[#1EBEB1] text-white hover:bg-[#28b5a9] transition-colors"
                    >
                      Proceed to Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

  export default UserBookingRequests;
  