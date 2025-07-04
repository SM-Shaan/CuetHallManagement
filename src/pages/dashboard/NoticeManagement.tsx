import React, { useEffect, useState } from 'react';
import {
  Bell, Pin, Calendar, Eye, Edit, Trash2, Filter,
  Search, Plus, Clock, AlertCircle, CheckCircle,
  MessageCircle, Download, Share2, Paperclip, Heart
} from 'lucide-react';
// import { Delete } from 'lucide-react';
import { DOMAIN } from '../../constants/domain';

type AddNewNotice = {
  title: string;
  description: string;
  noticeType: string;
}

type NoticeToShow = {
  title: string;
  description: string;
  noticeType: string;
  noticeId: number;
  date: string;
  views: number;
};

type NoticePage = {
  totalNotices: number;
  totalViews: number;
  totalFavourites: number;
  lastMonth: number;
  notices: NoticeToShow[];
};

const NoticeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [noticepage, setNoticepage] = useState<NoticePage>({
    totalNotices: 0,
    totalViews: 0,
    totalFavourites: 0,
    lastMonth: 0,
    notices: []
  });
  const [expandedNotices, setExpandedNotices] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleExpand = (noticeId: number) => {
    setExpandedNotices((prev) => ({
      ...prev,
      [noticeId]: !prev[noticeId],
    }));
  };

  const Token = localStorage.getItem('token');



  const [newNotice, setNewNotice] = useState({ title: '', noticeType: 'Maintanence', description: '' });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const isToAdd = window.confirm('Are you sure to add the Notice?');
    if (!isToAdd) return;
    e.preventDefault();
    if (!newNotice.title || !newNotice.description) {
      alert('Please fill all the fields');
      return;
    }

    console.log(newNotice);
    fetch(`${DOMAIN}/NoticeManagement/AddNotice`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify(newNotice),
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
        setNoticepage(data);
        closeModal();
        alert('Notice added successfully');
        return;
      })
      .catch((error) => {
        console.error('Error adding new notice:', error);
      });
  };

  const handleDelete = (noticeId: number) => {
    
    const isToDelete = window.confirm('Are you sure to delete the Notice?');
    if (!isToDelete) return;

    fetch(`${DOMAIN}/NoticeManagement/DeleteNotice/${noticeId}`, {
      method: 'DELETE',
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
            alert(`${errorMessage}`);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setNoticepage(data);
        alert('Notice deleted successfully');
        return;
      })
      .catch((error) => {
        console.error('Error deleting notice:', error);
      });

  };


  useEffect(() => {
    fetch(`${DOMAIN}/NoticeManagement/GetNoticesOfHall`, {
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
      .then((data: NoticePage) => {
        setNoticepage(data);
      })
      .catch((error) => {
        console.error('Error fetching notices data:', error);
      });
  }, [Token]);

  const getCategoryIcon = (category: NoticeToShow['noticeType']) => {
    switch (category) {
      case 'updates': return Bell;
      case 'Maintanence': return AlertCircle;
      case 'event': return Calendar;
      default: return Bell; // Default icon
    }
  };

  const filteredNotices = noticepage.notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || notice.noticeType === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3">
        <h2 className="text-2xl font-bold text-gray-800">Notice Management</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={openModal}>
            <Plus size={20} />
            Create Notice
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Active Notices</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {noticepage.totalNotices}
              </h3>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Bell className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {noticepage.totalViews}
              </h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Eye className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Favourites</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {noticepage.totalFavourites}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Heart className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Last Month</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {noticepage.lastMonth}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="Maintanence">Maintenance</option>
              <option value="updates">Updates</option>
              <option value="event">Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-6">
        {filteredNotices.map((notice) => {
          const CategoryIcon = getCategoryIcon(notice.noticeType);
          const TypeColor = notice.noticeType === 'updates' ? 'bg-sky-100' : notice.noticeType === 'Maintanence' ? 'bg-red-50' : 'bg-green-50'; const isExpanded = expandedNotices[notice.noticeId] || false;

          return (
            <div
              key={notice.noticeId}
              className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col min-h-[200px] ${TypeColor}`}
            >
              <div className="p-6 flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon size={16} className="text-indigo-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {notice.title}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-700">
                      <p className={`transition-all ${isExpanded ? "line-clamp-none" : "line-clamp-2"}`}>
                        {notice.description}
                      </p>
                      <button
                        onClick={() => toggleExpand(notice.noticeId)}
                        className="mt-2 text-indigo-600 hover:underline"
                      >
                        {isExpanded ? "Show less" : "Expand"}
                      </button>
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Date: {notice.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{notice.views} views</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-3 bg-indigo-100 rounded-lg" onClick={() => handleDelete(notice.noticeId)}>
                    <Trash2 className="text-indigo-600" size={24} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-lg font-semibold mb-4">Add New Notice</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Notice Type</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={newNotice.noticeType}
                  onChange={(e) => setNewNotice({ ...newNotice, noticeType: e.target.value })}
                >
                  <option value="Maintanence">Maintenance</option>
                  <option value="updates">Updates</option>
                  <option value="event">Events</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter description"
                  value={newNotice.description}
                  onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default NoticeManagement;