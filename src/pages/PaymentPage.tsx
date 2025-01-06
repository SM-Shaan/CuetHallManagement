import React from 'react';
import PaymentForm from '../components/payment/PaymentForm';

const PaymentPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Payment Page</h1>
      <PaymentForm />
    </div>
  );
};

export default PaymentPage;
