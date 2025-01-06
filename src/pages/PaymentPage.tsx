import React, { useState } from 'react';

const PaymentPage = () => {
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePayment = () => {
    setPaymentStatus('Your payment was successful!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Payment Page</h1>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Student Details</h2>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>ID:</strong> 123456</p>
        <p><strong>Hall Name:</strong> XYZ Hall</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Fee Details</h2>
        <p><strong>Hall Fee:</strong> ৳200</p>
        <p><strong>Dining Fee:</strong> ৳150</p>
        <p><strong>Total:</strong> ৳350</p>
      </div>

      <div className="text-center">
        <button
          onClick={handlePayment}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700"
        >
          Pay Now
        </button>
      </div>

      {paymentStatus && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700">
          {paymentStatus}
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
