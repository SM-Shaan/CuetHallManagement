import React, { useEffect, useState } from 'react';
import Modal, { Styles } from 'react-modal';
import PaymentForm from '../components/payment/PaymentForm';

const modalStyles: Styles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '60%',
    border: 'none',
    height: 'fit-content',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
};

type HallPayments = {
  hallFeePaymentId: number;
  levelAndTerm: string;
  amount: number;
  status: string;
  paymentDate: string;
};

type DinningPayments = {
  dinningFeePaymentId: number;
  month: string;
  year: number;
  amount: number;
  status: string;
  paymentDate: string;
};

type PaymentPageData = {
  hallPayments: HallPayments[];
  dinningPayments: DinningPayments[];
};

const PaymentPage = () => {
  const [paymentPage, setPaymentPage] = useState<PaymentPageData | null>(null);
  const [isHallModalOpen, setIsHallModalOpen] = useState(false);
  const [isDiningModalOpen, setIsDiningModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState('');

  const handleHallPayment = (payment: HallPayments) => {
    setSelectedPaymentId(payment.hallFeePaymentId);
    setIsHallModalOpen(true);
  };

  const handleDiningPayment = (payment: DinningPayments) => {
    setSelectedPaymentId(payment.dinningFeePaymentId);
    setIsDiningModalOpen(true);
  };

  const handleHallFeePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPaymentId) return;
    const Token = localStorage.getItem('token');

    fetch(`https://localhost:7057/Payment/PayHallFee/${selectedPaymentId}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      //body: JSON.stringify({ transactionId }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 401) {
            window.location.href = '/login';
            alert(`Unauthorized: Login First`);
            return;
          }
          if (response.status === 400) {
            alert(`${errorMessage}`);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Payment response:', data);
        alert('Payment successful!');
        setTransactionId('');
        setPaymentPage(data);
        selectedPaymentId && setSelectedPaymentId(null);
        setIsHallModalOpen(false);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });

  };

  const handleDinningFeePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPaymentId) return;
    const Token = localStorage.getItem('token');

    fetch(`https://localhost:7057/Payment/PayDinningFee/${selectedPaymentId}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      //body: JSON.stringify({ transactionId }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 401) {
            window.location.href = '/login';
            alert(`Unauthorized: Login First`);
            return;
          }
          if (response.status === 400) {
            alert(`${errorMessage}`);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Payment response:', data);
        alert('Payment successful!');
        setTransactionId('');
        setPaymentPage(data);
        selectedPaymentId && setSelectedPaymentId(null);
        setIsDiningModalOpen(false);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });

  }

  const Token = localStorage.getItem('token');
  useEffect(() => {
    fetch(`https://localhost:7057/Payment/GetStudentPaymentPage`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 401) {
            window.location.href = '/login';
            alert(`Unauthorized: Login First`);
            return;
          }
          if (response.status === 400) {
            window.location.href = '/';
            alert(`${errorMessage}`);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: PaymentPageData) => {
        console.log('Payment data:', data);
        setPaymentPage(data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, [Token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Payments</h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hall Payments */}
        <div className="relative bg-white p-6 rounded-lg shadow-lg max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Hall Payments</h2>
          {paymentPage && paymentPage.hallPayments.length > 0 ? (
            paymentPage.hallPayments.map((payment, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow">
                <p className="text-gray-700"><strong>Term:</strong> {payment.levelAndTerm}</p>
                <p className="text-gray-700"><strong>Amount:</strong> ${payment.amount}</p>
                <p className={`text-sm font-medium ${payment.status === "Not Paid" ? "text-red-500" : "text-green-600"}`}>
                  <strong>Status:</strong> {payment.status}
                </p>
                <p className="text-gray-600 text-sm"><strong>Payment Date:</strong> {payment.paymentDate}</p>
                {payment.status === "Not Paid" && (
                  <button 
                    onClick={() => handleHallPayment(payment)}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No hall payments found.</p>
          )}
        </div>

        {/* Dining Payments */}
        <div className="relative bg-white p-6 rounded-lg shadow-lg max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dining Payments</h2>
          {paymentPage && paymentPage.dinningPayments.length > 0 ? (
            paymentPage.dinningPayments.map((payment, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow">
                <p className="text-gray-700"><strong>Month:</strong> {payment.month}</p>
                <p className="text-gray-700"><strong>Year:</strong> {payment.year}</p>
                <p className="text-gray-700"><strong>Amount:</strong> ${payment.amount}</p>
                <p className={`text-sm font-medium ${payment.status === "Not Paid" ? "text-red-500" : "text-green-600"}`}>
                  <strong>Status:</strong> {payment.status}
                </p>
                <p className="text-gray-600 text-sm"><strong>Payment Date:</strong> {payment.paymentDate}</p>
                {payment.status === "Not Paid" && (
                  <button 
                    onClick={() => handleDiningPayment(payment)}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No dining payments found.</p>
          )}
        </div>
      </div>

      {/* Hall Payment Modal */}
      <Modal
        isOpen={isHallModalOpen}
        onRequestClose={() => setIsHallModalOpen(false)}
        contentLabel="Hall Payment Modal"
        className="modal"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
        style={modalStyles}
      >
        <h2 className="text-xl font-semibold mb-4">Enter Bkash Transaction ID for Hall Payment</h2>
        <form onSubmit={handleHallFeePayment}>
          <div className="mb-4">
            <label htmlFor="transactionId" className="block text-gray-700">Transaction ID</label>
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
            <button type="button" onClick={() => setIsHallModalOpen(false)} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
          </div>
        </form>
      </Modal>

      {/* Dining Payment Modal */}
      <Modal
        isOpen={isDiningModalOpen}
        onRequestClose={() => setIsDiningModalOpen(false)}
        contentLabel="Dining Payment Modal"
        className="modal"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
        style={modalStyles}
      >
        <h2 className="text-xl font-semibold mb-4">Enter Bkash Transaction ID for Dining Payment</h2>
        <form onSubmit={handleDinningFeePayment}>
          <div className="mb-4">
            <label htmlFor="transactionId" className="block text-gray-700">Transaction ID</label>
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
            <button type="button" onClick={() => setIsDiningModalOpen(false)} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentPage;