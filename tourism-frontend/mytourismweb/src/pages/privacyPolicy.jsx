import React from "react";

const privacyPolicy = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#1EBEB1] text-white p-6 text-center shadow">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-10 px-6 flex-1">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="mb-4">
            EasyTrip values your privacy and is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-2">1. Information We Collect</h2>
          <p>We collect personal details such as your name, email, contact number, and payment information when you book services through our platform.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">2. How We Use Your Information</h2>
          <p>Your data is used to process bookings, improve services, and communicate with you regarding your reservations.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">3. Data Security</h2>
          <p>We implement secure measures to protect your data, but we cannot guarantee absolute security due to the nature of the internet.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">4. Third-Party Sharing</h2>
          <p>We only share necessary details with service providers to fulfill your bookings. We do not sell your data to third parties.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white text-center py-4">
        &copy; 2025 EasyTrip. All rights reserved.
      </div>
    </div>
  );
};

export default privacyPolicy;
