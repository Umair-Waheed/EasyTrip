import React from 'react';

const ProviderBookingRequests = ({ bookings, onConfirm, onCancel,formatPrice }) => {
  // console.log(bookings)

      const sortedBookings=[...(bookings || [])].sort((a,b)=>
    new Date(b.createdAt) - new Date(a.createdAt));

  return (
     <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Booking Requests</h1>
      {sortedBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No new booking requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-h-[800px] overflow-y-auto pr-2">
          {sortedBookings.map((booking) => (
            <div
              key={booking._id}
              className="m-2 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {booking.serviceType === 'hotel' ? 'Room Booking' : `${booking.serviceType} Booking`}
                    </h2>
                    <p className="text-gray-600">{booking.fullName}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service ID:</span>
                    <span className="font-medium">{booking.listingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking Dates:</span>
                    <span className="font-medium">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {booking.totalDays ? 'Total Days:' : 'Total Hours:'}
                    </span>
                    <span className="font-medium">
                      {booking.totalDays || booking.totalHours}
                    </span>
                  </div>
                  <div className="flex justify-between">
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
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Total Price:</span>
                    <span className="text-xl font-bold text-[#1EBEB1]">
                      Rs.{formatPrice(booking.totalPrice)} 
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <button
                      className="flex-1 px-4 py-2 rounded-lg bg-[#1ebeb1] 
                      text-white hover:bg-[#28b5a9] transition-colors"
                      onClick={() => onConfirm(booking._id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="flex-1 px-4 py-2 border rounded-lg text-black
                        hover:bg-red-600 transition-colors hover:text-white"
                      onClick={() => onCancel(booking._id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderBookingRequests;
