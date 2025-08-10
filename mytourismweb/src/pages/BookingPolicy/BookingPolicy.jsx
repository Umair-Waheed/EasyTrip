import React from "react";
import "./BookingPolicy.css";

const BookingPolicy = () => {
  return (
    <div className="booking-policy-container">
      <h1>Booking Policy</h1>
      <hr className="mb-4" />
      <p className="text-red-500 mb-3 ">
        Please read our booking policy carefully before making a reservation. By
        confirming a booking through our platform, you agree to the terms and
        conditions outlined below.
      </p>

      <div>
        <h2>Booking Confirmation</h2>
        <li>All bookings must be made through our official website.</li>
        <li>A booking is confirmed only after successful payment.</li>
        <li>
          Customers are responsible for providing accurate personal and contact
          details when booking.
        </li>
        <li className="text-indigo-800 mb-3 font-semibold">
          Contact to service provider to confirm availability before making payment.
        </li>
      </div>
      <div>
        <h2>Payment Terms</h2>
        <li>Services can be booked by paying the full amount.</li>
        <li>
          All prices are displayed in PKR and are inclusive/exclusive of taxes
          and discounts as indicated.
        </li>
        <li>
          Payment methods accepted: PayFast, credit/debit card, bank transfer,
          mobile payment.
        </li>
      </div>
      <div>
        <h2>Refunds Terms</h2>
        <a
          className="underline"
          href="/refund-policy"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#007BFF",
            marginLeft: "4px",
            textDecoration: "underline",
          }}
        >
          Refund Policy
        </a>
      </div>
      <div>
        <h2>Responsibility & Liability</h2>
        <li>
          We act as an intermediary between users and service providers. Any
          disputes regarding service quality should be addressed directly with
          the provider.
        </li>
        <li>
          We are not liable for delays, cancellations, or issues caused by
          unforeseen circumstances such as weather, strikes, or natural
          disasters.
        </li>
        <li>
          Payment methods accepted: PayFast, credit/debit card, bank transfer,
          mobile payment.
        </li>
      </div>

      <div>
        <h2>Contact Information</h2>
    <li>+92 3483256587</li>
        <li>easytrip@gmail.com</li>
      </div>

      <p>
        <strong>Not Eligible:</strong>
        <ul>
          <li>Requests made after 48 hours.</li>
          <li>Services already utilized.</li>
          <li>Incomplete or false refund information.</li>
        </ul>
      </p>
      <hr className="my-2" />
      <p>
        <strong>If you have any questions, contact our support team.</strong>
      </p>
    </div>
  );
};

export default BookingPolicy;
