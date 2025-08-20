import React from 'react'

const providerTermsConditions = () => {
    return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#1EBEB1] text-white p-6 text-center shadow">
        <h1 className="text-3xl font-bold">Terms and Conditions for ServiceProvider</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-10 px-6 flex-1">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="mb-4 font-semibold">
            By setting up your dashboard as a Service Provider on our platform, you agree to the following terms:</p>

          <h2 className="text-xl font-bold mt-6 mb-2">1. Commission Fee</h2>
          <li>A 5% commission will be deducted by the platform from each successfully completed booking.</li>

          <h2 className="text-xl font-bold mt-6 mb-2">2. Payment Holding Policy</h2>
          <li>Payments made by users will be held for 48 hours after the booking start date (arrival date).</li>
        <li>After the 48-hour holding period, the amount will be transferred to your registered account.</li>

          <h2 className="text-xl font-bold mt-6 mb-2">3. Refunds & Cancellations</h2>
          <li>If a user requests a refund and the reason is found to be genuine by the admin team, the booking will be canceled and the payment will be refunded to the user.

In such cases, you will not receive payment for that booking.</li>

          <h2 className="text-xl font-bold mt-6 mb-2">4. Compliance</h2>
          <li>Illegal, fraudulent, or misleading activities are strictly prohibited.

Any violation of laws or platform policies can result in immediate suspension or termination of your account.
</li>
          <h2 className="text-xl font-bold mt-6 mb-2">5. Disputes</h2>
          <li>In case of disputes between you and the user, the admin team’s decision will be final regarding refunds, cancellations, or payments.</li>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white text-center py-4">
        &copy; 2025 EasyTrip. All rights reserved.
      </div>
    </div>
  );
}

export default providerTermsConditions