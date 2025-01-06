import React, { useState } from 'react';
import NoticeItem from '../components/notices/NoticeItem';

const NoticesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;

  const notices = [
    {
      title: 'Maintenance Notice',
      date: 'October 10, 2023',
      description: 'The hall will undergo maintenance on October 15th. Please ensure all personal belongings are secured.',
      type: 'maintenance' as 'maintenance',
    },
    {
      title: 'Dining Hall Closure',
      date: 'October 8, 2023',
      description: 'The dining hall will be closed on October 12th for a private event. Alternative dining options will be available.',
      type: 'events' as 'events',
    },
    {
      title: 'Fire Drill',
      date: 'October 5, 2023',
      description: 'A fire drill is scheduled for October 20th at 10 AM. Participation is mandatory for all residents.',
      type: 'updates' as 'updates',
    },
    // Add more notices as needed
  ];

  const filteredNotices = notices.filter((notice) => {
    return (
      (filter === 'all' || notice.type === filter) &&
      notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Notices</h1>
      <div className="max-w-4xl mx-auto mb-4">
        <input
          type="text"
          placeholder="Search notices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          aria-label="Search notices"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          aria-label="Filter notices"
        >
          <option value="all">All</option>
          <option value="maintenance">Maintenance</option>
          <option value="events">Events</option>
          <option value="updates">Updates</option>
        </select>
      </div>
      <div className="max-w-4xl mx-auto">
        {currentNotices.map((notice, index) => (
          <NoticeItem
            key={index}
            title={notice.title}
            date={notice.date}
            description={notice.description}
            type={notice.type}
            onClick={() => alert(`Viewing details for: ${notice.title}`)}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredNotices.length / noticesPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 mx-1 rounded-md ${
              currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'
            }`}
            aria-label={`Go to page ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoticesPage;
