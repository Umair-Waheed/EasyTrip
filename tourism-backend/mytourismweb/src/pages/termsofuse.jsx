import React from "react";

const termsofuse = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#1EBEB1] text-white p-6 text-center shadow">
        <h1 className="text-3xl font-bold">Terms of Use</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-10 px-6 flex-1">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="mb-4">
            By accessing and using EasyTrip, you agree to the following terms and conditions. If you do not agree, please do not use our services.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-2">1. Booking Responsibility</h2>
          <p>You are responsible for ensuring all booking details are correct before confirming payment.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">2. Payments</h2>
          <p>All payments must be made through our secure payment gateway. Prices may vary depending on availability.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">3. Cancellations</h2>
          <p>Cancellations are subject to our cancellation policy. Refund eligibility depends on the service provider’s rules.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">4. Liability</h2>
          <p>EasyTrip acts as a booking platform and is not directly responsible for the quality of services provided by hotels, transport operators, or guides.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white text-center py-4">
        &copy; 2025 EasyTrip. All rights reserved.
      </div>
    </div>
  );
};

export default termsofuse;
