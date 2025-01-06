import React from 'react';

const NoticesPage = () => {
  const notices = [
    {
      id: 1,
      title: 'Important: Hall Meeting',
      date: '2024-12-10',
      description: 'A hall meeting will be held on December 10th at 5 PM in the common room. Attendance is mandatory for all residents.',
    },
    {
      id: 2,
      title: 'Dining Fee Update',
      date: '2024-12-01',
      description: 'Please ensure that your dining fees for December are paid by December 15th to avoid late fees.',
    },
    {
      id: 3,
      title: 'New Hall Rules',
      date: '2024-11-20',
      description: 'Updated hall rules are now available. Please read and adhere to the new guidelines to ensure a peaceful environment.',
    },
    {
      id: 4,
      title: 'Maintenance Notice',
      date: '2024-11-25',
      description: 'Water supply will be interrupted on November 26th from 9 AM to 3 PM for maintenance work. We apologize for any inconvenience.',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notices</h1>
      <p className="mb-4">Stay updated with the latest hall notices, updates, and rules.</p>

      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition duration-200"
          >
            <h2 className="text-xl font-semibold">{notice.title}</h2>
            <p className="text-sm text-gray-500 mb-2">Date: {notice.date}</p>
            <p className="text-gray-700">{notice.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticesPage;
