import React, { useState } from 'react';
import { Filter, Search, AlertCircle, MessageCircle, Paperclip, Camera, Calendar } from 'lucide-react';

interface Complaint {
  id: number;
  title: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  category?: string;
  location?: string;
  description?: string;
  attachments?: string[];
  comments?: Array<{
    id: number;
    text: string;
    date: string;
    user: string;
  }>;
}

const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 1,
      title: 'Leaking pipe in washroom',
      status: 'Pending',
      date: '2024-03-15',
      priority: 'High',
      category: 'Plumbing',
      location: 'Block A, Floor 2',
      description: 'Water leaking from sink pipe causing floor damage',
      comments: [
        { id: 1, text: 'Maintenance team has been notified', date: '2024-03-15', user: 'Admin' }
      ]
    },
    { id: 2, title: 'Noisy environment at night', status: 'Resolved', date: '2024-03-14', priority: 'Medium' },
    { id: 3, title: 'Broken window in room 105', status: 'In Progress', date: '2024-03-13', priority: 'High' },
  ]);

  const [newComplaint, setNewComplaint] = useState('');
  const [priority, setPriority] = useState<Complaint['priority']>('Medium');
  const [filterStatus, setFilterStatus] = useState<'all' | Complaint['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newComment, setNewComment] = useState('');

  const categories = [
    'Plumbing',
    'Electrical',
    'Furniture',
    'Cleaning',
    'Security',
    'Internet',
    'Others'
  ];

  // Filter and search logic
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || complaint.category === selectedCategory;
    return matchesStatus && matchesSearch && matchesCategory;
  });

  const handleSubmitComplaint = () => {
    if (newComplaint.trim() === '') {
      alert('Please enter a complaint title before submitting.');
      return;
    }

    const newEntry: Complaint = {
      id: complaints.length + 1,
      title: newComplaint,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      priority,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      location,
      description,
      comments: [],
      attachments: []
    };
    setComplaints([...complaints, newEntry]);
    resetForm();
  };

  const resetForm = () => {
    setNewComplaint('');
    setPriority('Medium');
    setSelectedCategory('all');
    setLocation('');
    setDescription('');
  };

  const handleAddComment = (complaintId: number) => {
    if (!newComment.trim()) return;
    
    setComplaints(complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          comments: [...(complaint.comments || []), {
            id: Date.now(),
            text: newComment,
            date: new Date().toISOString().split('T')[0],
            user: 'User' // Replace with actual user name from auth
          }]
        };
      }
      return complaint;
    }));
    setNewComment('');
  };

  const getStatusColor = (status: Complaint['status']): string => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getPriorityBadge = (priority: Complaint['priority']): string => {
    const colors: Record<Complaint['priority'], string> = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };
    return colors[priority];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">Complaint Management</h1>
        
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | Complaint['status'])}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Submit a New Complaint</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={newComplaint}
              onChange={(e) => setNewComplaint(e.target.value)}
              placeholder="Complaint Title"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Complaint['priority'])}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g., Block A, Room 101)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the complaint..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />
            <div className="flex gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Paperclip size={20} />
                Attach File
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Camera size={20} />
                Add Photo
              </button>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleSubmitComplaint}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Submit Complaint
              </button>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{complaint.title}</h3>
                  <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {complaint.date}
                    </span>
                    {complaint.location && (
                      <span className="flex items-center gap-1">
                        • Location: {complaint.location}
                      </span>
                    )}
                    {complaint.category && (
                      <span className="flex items-center gap-1">
                        • Category: {complaint.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getPriorityBadge(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
              
              {complaint.description && (
                <p className="text-gray-600 mb-4">{complaint.description}</p>
              )}

              {/* Comments Section */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">Comments</h4>
                <div className="space-y-2">
                  {complaint.comments?.map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm">{comment.text}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {comment.user} • {comment.date}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleAddComment(complaint.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;

