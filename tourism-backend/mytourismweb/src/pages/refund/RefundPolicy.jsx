import React from 'react';
import './RefundPolicy.css';

const RefundPolicy = () => {
  return (
    <div className="refund-policy-container">
      <h1>Refund Policy</h1>
      <hr className='mb-4' />

      <li><strong>Refund Eligibility:</strong> Refund requests are accepted within 48 hours of payment.</li>
      <li><strong>How to Request:</strong> Use the “Request Refund” button on your payment and submit the form with a reason.</li>
      <li><strong>Processing Time:</strong> Requests are reviewed within 3–5 business days. You'll be notified once approved or rejected.</li>
      <li><strong>Refund Method:</strong> Refunds will be issued using the original payment method or agreed method.</li>
      <br />
      <p><strong>Not Eligible:</strong> 
        <ul>
          <li>Requests made after 48 hours.</li>
          <li>Services already utilized.</li>
          <li>Incomplete or false refund information.</li>
        </ul>
      </p>
      <hr className='my-2'/>
      <p><strong>If you have any questions, contact our support team.</strong></p>
    </div>
  );
};

export default RefundPolicy
