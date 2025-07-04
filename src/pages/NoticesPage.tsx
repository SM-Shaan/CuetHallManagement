import React, { useEffect, useState } from 'react';
import NoticeItem from '../components/notices/NoticeItem';
import { DOMAIN } from '../constants/domain';

type Notice = {
  noticeId: number;
  title: string;
  date: string;
  description: string;
  noticeType: 'maintenance' | 'events' | 'updates';
  priority: boolean;
  isRead: boolean;
};

const NoticesPage = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const noticesPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${DOMAIN}/Notice/GetNotices?pageNumber=${currentPage}&pageSize=${noticesPerPage}&filter=${filter}&searchTerm=${searchTerm}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
        setTotalPages(parseInt(response.headers.get('X-Total-Pages') || '1', 10));
        return response.json();
      })
      .then((data: Notice[]) => {
        if (!data || data.length === 0) {
          setNotices([]);
        } else {
          setNotices(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching notices data:', error);
        setNotices([]);
      });
  }, [currentPage, noticesPerPage, filter, searchTerm]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
        {notices.length === 0 ? (
          <p className="text-center text-gray-500">No notices found.</p>
        ) : (
          notices.map((notice, index) => (
            <NoticeItem
              key={index}
              noticeId={notice.noticeId}
              title={notice.title}
              date={notice.date}
              description={notice.description}
              noticeType={notice.noticeType}
              isFavorite={notice.priority}
              isRead={notice.isRead}
            />
          ))
        )}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages+1 }, (_, i) => (
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