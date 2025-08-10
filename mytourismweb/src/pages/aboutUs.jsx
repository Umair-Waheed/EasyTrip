import React from "react";

const aboutUs = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#1EBEB1] text-white p-6 text-center shadow">
        <h1 className="text-3xl font-bold">About Us</h1>
        <p className="mt-2 text-lg">Your trusted travel partner – EasyTrip</p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-10 px-6 flex-1">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
          <p className="mb-4">
            EasyTrip is your one-stop platform for booking hotels, transportation, and tour guides, all in one place.
            Our mission is to make travel planning simple, affordable, and enjoyable for everyone.
          </p>
          <p>
            Whether you're planning a quick weekend getaway or a month-long adventure, we provide reliable service providers
            to ensure your trip is smooth from start to finish.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p>
            To become the leading tourism booking platform, connecting travelers with quality services,
            while ensuring trust, transparency, and convenience in every booking.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white text-center py-4">
        &copy; 2025 EasyTrip. All rights reserved.
      </div>
    </div>
  );
};

export default aboutUs;
