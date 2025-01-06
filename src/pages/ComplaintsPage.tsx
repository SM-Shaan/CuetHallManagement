import React, { useState } from 'react';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, title: 'Leaking pipe in washroom', status: 'Pending' },
    { id: 2, title: 'Noisy environment at night', status: 'Resolved' },
    { id: 3, title: 'Broken window in room 105', status: 'In Progress' },
  ]);

  const [newComplaint, setNewComplaint] = useState('');

  const handleSubmitComplaint = () => {
    if (newComplaint.trim() === '') {
      alert('Please enter a complaint before submitting.');
      return;
    }

    const newEntry = {
      id: complaints.length + 1,
      title: newComplaint,
      status: 'Pending',
    };
    setComplaints([...complaints, newEntry]);
    setNewComplaint('');
    alert('Your complaint has been submitted successfully!');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Complaint Page</h1>
      <p className="mb-4">
        Submit your complaints and monitor their resolution status below. We strive for transparency and timely action.
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Submit a Complaint</h2>
        <textarea
          value={newComplaint}
          onChange={(e) => setNewComplaint(e.target.value)}
          placeholder="Enter your complaint here..."
          className="w-full p-2 border rounded-lg mb-2"
        ></textarea>
        <button
          onClick={handleSubmitComplaint}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Submit Complaint
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Complaints</h2>
        <ul className="space-y-4">
          {complaints.map((complaint) => (
            <li
              key={complaint.id}
              className={`p-4 border rounded-lg shadow-md ${
                complaint.status === 'Resolved'
                  ? 'bg-green-100'
                  : complaint.status === 'In Progress'
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
              }`}
            >
              <h3 className="font-bold">{complaint.title}</h3>
              <p>Status: {complaint.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ComplaintsPage;

