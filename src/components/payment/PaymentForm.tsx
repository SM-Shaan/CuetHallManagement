import React, { useState } from 'react';
import { CreditCard, User, Home, DollarSign, Info } from 'lucide-react';

const PaymentForm = () => {
  const [transactionId, setTransactionId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [paymentType, setPaymentType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement payment submission logic here
    alert(`Payment submitted with Transaction ID: ${transactionId}`);
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-800">Payment Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
          <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
            <CreditCard className="ml-2 text-gray-400" />
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="mt-1 block w-full p-2 border-none focus:ring-0"
              placeholder="Enter your transaction ID"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Student ID</label>
          <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
            <User className="ml-2 text-gray-400" />
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1 block w-full p-2 border-none focus:ring-0"
              placeholder="Enter your student ID"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Student Name</label>
          <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
            <User className="ml-2 text-gray-400" />
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="mt-1 block w-full p-2 border-none focus:ring-0"
              placeholder="Enter your student name"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Room Number</label>
          <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
            <Home className="ml-2 text-gray-400" />
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="mt-1 block w-full p-2 border-none focus:ring-0"
              placeholder="Enter your room number"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
            <DollarSign className="ml-2 text-gray-400" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full p-2 border-none focus:ring-0"
              placeholder="Enter the amount"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Reason for Payment</label>
          <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
            <Info className="ml-2 text-gray-400" />
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full p-2 border-none focus:ring-0"
              placeholder="Enter the reason for payment"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="" disabled>Select payment type</option>
            <option value="tuition">Dining Fee</option>
            <option value="accommodation">Hall Fee</option>
            <option value="miscellaneous">Miscellaneous</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 