import React, { useState, useEffect } from "react";
import Modal from "react-modal";
Modal.setAppElement('#root');
import { CSSProperties } from 'react';

const modalStyles: { content: CSSProperties; overlay: CSSProperties } = {
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
const PaymentManagement: React.FC = () => {
  const [isHallFeeModalOpen, setHallFeeModalOpen] = useState(false);
  const [isDiningFeeModalOpen, setDiningFeeModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const Token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState("");
  const [diningSearchTerm, setDiningSearchTerm] = useState("");
  const [batch, setBatch] = useState("");
  const [levelAndTerm, setLevelAndTerm] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [year, setYear] = useState(0);
const [month, setMonth] = useState("");
const [diningTotalAmount, setDiningTotalAmount] = useState("");

  useEffect(() => {
    fetch('https://localhost:7057/AdminPaymentManagement/GetPaymentPage', {
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
      .then((data) => {
        setPaymentData(data);
        console.log(data);
        console.log(paymentData);
        return;
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);


  const handleHallFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    fetch('https://localhost:7057/AdminPaymentManagement/AssignHallFee', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${Token}`,
        },
        body: JSON.stringify({
            batch,
            levelAndTerm,
            totalAmount,
        }),
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
                    //window.location.reload();
                    alert(`${errorMessage}`);
                    return;
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            alert('Hall Fee Assigned Successfully');
            setPaymentData(data);
            setBatch('');
            setLevelAndTerm('');
            setTotalAmount('');
            setHallFeeModalOpen(false);
        })
        .catch((error) => {
            console.error('There was an error!', error);
        });

    // console.log({ batch, levelAndTerm, totalAmount });
    // setHallFeeModalOpen(false);
  };

  const handleDiningFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ year, month, totalAmount });
    fetch('https://localhost:7057/AdminPaymentManagement/AssignDinningFee', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${Token}`,
        },
        body: JSON.stringify({
            year,
            month,
            totalAmount,
        }),
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
                    //window.location.reload();
                    alert(`${errorMessage}`);
                    return;
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            alert('Dining Fee Assigned Successfully');
            setPaymentData(data);
            setYear(0);
            setMonth('');
            setDiningTotalAmount('');
            setDiningFeeModalOpen(false);
        })
        .catch((error) => {
            console.error('There was an error!', error);
        });
  };
  


  const filteredHallFeePayments =
    paymentData?.hallFeePayments?.filter((payment: any) =>
      payment.studentId.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredDiningFeePayments =
    paymentData?.dinningFeePayments?.filter((payment: any) =>
      String(payment.studentId).toLowerCase().includes(diningSearchTerm.toLowerCase())
    ) || [];

  if (!paymentData) {
    return <div className="p-6 bg-gray-100 min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Top Buttons */}
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={() => setHallFeeModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          New Hall Fee
        </button>
        <button
          onClick={() => setDiningFeeModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          New Dining Fee
        </button>
      </div>

      {/* Hall Fee Modal */}
      <Modal
  isOpen={isHallFeeModalOpen}
  onRequestClose={() => setHallFeeModalOpen(false)}
  contentLabel="Hall Fee Modal"
  className="modal-container"
  overlayClassName="modal-overlay"
  ariaHideApp={false}
  style={modalStyles}
>
  <div className="modal-header flex justify-between items-center">
    <h2 className="modal-title text-xl font-bold">New Hall Fee</h2>
    <button
      type="button"
      className="close-button text-gray-600 text-2xl leading-none"
      onClick={() => setHallFeeModalOpen(false)}
    >
      &times;
    </button>
  </div>
  <form onSubmit={handleHallFeeSubmit} className="modal-form mt-4">
    <div className="modal-form-group mb-4">
      <label htmlFor="batch" className="block mb-1">
        Batch
      </label>
      <input
        type="text"
        id="batch"
        value={batch}
        onChange={(e) => setBatch(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="modal-form-group mb-4">
      <label htmlFor="levelAndTerm" className="block mb-1">
        Level and Term
      </label>
      <select
        id="levelAndTerm"
        value={levelAndTerm}
        onChange={(e) => setLevelAndTerm(e.target.value)}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Level and Term</option>
        <option value="Level-1,Term-1">Level-1, Term-1</option>
        <option value="Level-1,Term-2">Level-1, Term-2</option>
        <option value="Level-2,Term-1">Level-2, Term-1</option>
        <option value="Level-2,Term-2">Level-2, Term-2</option>
        <option value="Level-3,Term-1">Level-3, Term-1</option>
        <option value="Level-3,Term-2">Level-3, Term-2</option>
        <option value=">Level-4,Term-1">Level-4, Term-1</option>
        <option value="Level-4,Term-2">Level-4, Term-2</option>
      </select>
    </div>
    <div className="modal-form-group mb-4">
      <label htmlFor="totalAmount" className="block mb-1">
        Total Amount
      </label>
      <input
        type="number"
        id="totalAmount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="modal-footer flex justify-end space-x-2">
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={() => setHallFeeModalOpen(false)}
        className="px-4 py-2 bg-gray-300 text-black rounded"
      >
        Close
      </button>
    </div>
  </form>
</Modal>


      {/* Dining Fee Modal */}
      <Modal
  isOpen={isDiningFeeModalOpen}
  onRequestClose={() => setDiningFeeModalOpen(false)}
  contentLabel="Dining Fee Modal"
  className="modal"
  overlayClassName="modal-overlay"
  ariaHideApp={false}
  style={modalStyles}
>
  <h2>New Dining Fee</h2>
  <form onSubmit={handleDiningFeeSubmit}>
    <div className="modal-form-group mb-4">
      <label htmlFor="year" className="block mb-1">Year</label>
      <select
        id="year"
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value))}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Year</option>
        {Array.from({ length: 33 }, (_, i) => 2018 + i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
    <div className="modal-form-group mb-4">
      <label htmlFor="month" className="block mb-1">Month</label>
      <select
        id="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Month</option>
        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
    <div className="modal-form-group mb-4">
      <label htmlFor="totalAmount" className="block mb-1">
        Total Amount
      </label>
      <input
        type="number"
        id="totalAmount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="modal-footer flex justify-end space-x-2">
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      <button type="button" onClick={() => setDiningFeeModalOpen(false)} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
    </div>
  </form>
</Modal>

      {/* Summary Boxes */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-md p-4 rounded-md text-center">
          <h3 className="text-gray-600 text-lg">Total Fee Assigned</h3>
          <p className="text-xl font-bold">{paymentData.totalAmountToGet}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md text-center">
          <h3 className="text-gray-600 text-lg">Total Hall Fee</h3>
          <p className="text-xl font-bold">{paymentData.totalHallFeeAmount}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md text-center">
          <h3 className="text-gray-600 text-lg">Total Dining Fee</h3>
          <p className="text-xl font-bold">{paymentData.totalDinningFeeAmount}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md text-center">
          <h3 className="text-gray-600 text-lg">Payment Completed</h3>
          <p className="text-xl font-bold">{paymentData.percentageOfPayment}%</p>
        </div>
      </div>

      {/* Four-Quadrant Scrollable Layout */}
      <div className="relative w-full h-[800px] border border-gray-300 rounded-lg overflow-hidden">
        {/* Vertical and Horizontal Lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-300"></div>
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300"></div>

        {/* Assigned Dining Fee */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 p-6 bg-white hover:shadow-lg transition-shadow border-r border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Assigned Dining Fee</h3>
          <div className="overflow-y-auto max-h-[280px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Month</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Year</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.assignedDinningFeeToShow.map((fee: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors">
                    <td className="p-3">{fee.month}</td>
                    <td className="p-3">{fee.year}</td>
                    <td className="p-3">{fee.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assigned Hall Fee */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 p-6 bg-white hover:shadow-lg transition-shadow border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Assigned Hall Fee</h3>
          <div className="overflow-y-auto max-h-[280px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Batch</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Level And Term</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.assignedHallFeeToShow.map((fee: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors">
                    <td className="p-3">{fee.batch}</td>
                    <td className="p-3">{fee.levelAndTerm}</td>
                    <td className="p-3">{fee.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hall Fee Payments */}
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 p-6 bg-white hover:shadow-lg transition-shadow border-r border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Hall Fee Payments</h3>

          {/* Filter by Student ID */}
          <input
            type="text"
            placeholder="Filter by Student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          />

          <div className="overflow-y-auto max-h-[280px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Student ID</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Level And Term</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Amount</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHallFeePayments.map((payment: any) => (
                  <tr key={payment.hallFeePaymentId} className="hover:bg-gray-100 transition-colors">
                    <td className="p-3">{payment.studentId}</td>
                    <td className="p-3">{payment.levelAndTerm}</td>
                    <td className="p-3">{payment.paymentAmount}</td>
                    <td className="p-3">{payment.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dining Fee Payments */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 p-6 bg-white hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Dining Fee Payments</h3>

          {/* Filter by Student ID */}
          <input
            type="text"
            placeholder="Filter by Student ID..."
            value={diningSearchTerm}
            onChange={(e) => setDiningSearchTerm(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          />

          <div className="overflow-y-auto max-h-[280px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Student ID</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Month</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Year</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Amount</th>
                  <th className="p-3 bg-gray-100 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiningFeePayments.map((payment: any) => (
                  <tr key={payment.dinningFeePaymentId} className="hover:bg-gray-100 transition-colors">
                    <td className="p-3">{payment.studentId}</td>
                    <td className="p-3">{payment.month}</td>
                    <td className="p-3">{payment.year}</td>
                    <td className="p-3">{payment.paymentAmount}</td>
                    <td className="p-3">{payment.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;