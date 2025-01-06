import React, { useState } from 'react';
import {
  Bell, Pin, Calendar, Eye, Edit, Trash2, Filter,
  Search, Plus, Clock, AlertCircle, CheckCircle,
  MessageCircle, Download, Share2, Paperclip
} from 'lucide-react';

interface Notice {
  id: number;
  title: string;
  content: string;
  type: 'maintenance' | 'events' | 'updates';
  category: 'General' | 'Academic' | 'Maintenance' | 'Event' | 'Emergency';
  priority: 'high' | 'medium' | 'low';
  publishDate: string;
  expiryDate: string;
  isPinned: boolean;
  status: 'draft' | 'published' | 'expired';
  views: number;
  comments: number;
}

const NoticeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const notices: Notice[] = [
    {
      id: 1,
      title: 'Important: Hall Maintenance Schedule',
      content: 'The maintenance team will be conducting routine checks...',
      type: 'maintenance',
      category: 'Maintenance',
      priority: 'high',
      publishDate: '2024-03-15',
      expiryDate: '2024-03-20',
      status: 'published',
      isPinned: true,
      views: 245,
      comments: 12
    },
    // Add more notices...
  ];

  const getPriorityColor = (priority: Notice['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getCategoryIcon = (category: Notice['category']) => {
    switch (category) {
      case 'General': return Bell;
      case 'Academic': return CheckCircle;
      case 'Maintenance': return AlertCircle;
      case 'Event': return Calendar;
      case 'Emergency': return AlertCircle;
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || notice.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || notice.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || notice.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Notice Management</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={20} />
            Create Notice
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={20} />
            Export
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
                {notices.filter(n => n.status === 'published').length}
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
              <p className="text-sm text-gray-600">Pinned Notices</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {notices.filter(n => n.isPinned).length}
              </h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Pin className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {notices.reduce((sum, n) => sum + n.views, 0)}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {notices.filter(n => new Date(n.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
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
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Event">Event</option>
              <option value="Emergency">Emergency</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-6">
        {filteredNotices.map(notice => {
          const CategoryIcon = getCategoryIcon(notice.category);
          return (
            <div 
              key={notice.id} 
              className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow ${
                notice.isPinned ? 'border-l-4 border-indigo-500' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {notice.isPinned && <Pin size={16} className="text-indigo-600" />}
                        <h3 className="text-lg font-semibold text-gray-800">{notice.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Published: {notice.publishDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>Expires: {notice.expiryDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{notice.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        <span>{notice.comments} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NoticeManagement; 