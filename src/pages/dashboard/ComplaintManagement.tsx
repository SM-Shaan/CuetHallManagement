import React, { useEffect, useState } from 'react';
import {
  AlertCircle, Filter, Search, Plus, Clock,
  CheckCircle, MessageCircle, Users,
  Building, Download, RefreshCw, Wrench
} from 'lucide-react';
import { DOMAIN } from '../../constants/domain';



type Comment = {
  commentText: string,
  complaintId: number,
  commentedAt: string,
  commentedBy: string
}

type ComplaintPage = {
  totalComplaints: number;
  totalPendingComplaints: number;
  totalInProgressComplaints: number;
  totalResolvedComplaints: number;
}

type ComplaintsToShow = {
  complaintId: number,
  title: string,
  catagory: string,
  priority: string,
  status: string,
  description: string,
  location: string,
  imageData: string,
  fileData: string,
  complaintDate: string,
  comments: Comment[]
}

const ComplaintManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [complaintPage, setComplaintPage] = useState<ComplaintPage>({
    totalComplaints: 0,
    totalPendingComplaints: 0,
    totalInProgressComplaints: 0,
    totalResolvedComplaints: 0
  });

  const [complaintsToShow, setComplaintsToShow] = useState<ComplaintsToShow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);

  const Token = localStorage.getItem('token');

  useEffect(() => {
    fetchComplaintOverview();
    fetchComplaintsToShow();
  }, []);

  const fetchComplaintOverview = () => {
    fetch(`${DOMAIN}/AdminComplaint/AdminComplaintOverview`, {
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
      .then((data: ComplaintPage) => {
        setComplaintPage(data);
      })
      .catch((error) => {
        console.error('Error fetching complaints data:', error);
      });
  };

  const fetchComplaintsToShow = () => {
    fetch(`${DOMAIN}/AdminComplaint/ComplaintsToShow`, {
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
            alert('Unauthorized: Login First');
            return;
          }
          if (response.status === 400) {
            window.location.href = '/';
            alert(errorMessage);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: ComplaintsToShow[]) => {
        setComplaintsToShow(data);
      })
      .catch((error) => {
        console.error('Error fetching complaints data:', error);
      });
  };
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageData, setModalImageData] = useState<string | null>(null);
  
  const openImageModal = (imageData: string) => {
    setModalImageData(imageData);
    setIsImageModalOpen(true);
  };
  
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageData(null);
  };
  
  const openModal = (complaintId: number) => {
    setSelectedComplaintId(complaintId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaintId(null);
  };

  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedComments, setSelectedComments] = useState<Comment[]>([]);

  const openCommentsModal = (comments: Comment[]) => {
    setSelectedComments(comments);
    setIsCommentsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
    setSelectedComments([]);
  };

const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

const toggleComments = (complaintId: number) => {
  setShowComments((prev) => ({
    ...prev,
    [complaintId]: !prev[complaintId],
  }));
};


  const handleChangeStatus = (newStatus: string) => {
    fetch(`${DOMAIN}/AdminComplaint/UpdateComplaintStatus/${selectedComplaintId}/${newStatus}`, {
      method: 'PUT',
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
            alert('Unauthorized: Login First');
            return;
          }
          if (response.status === 400) {
            window.location.href = '/';
            alert(errorMessage);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const updatedComplaints = complaintsToShow.map(complaint => {
          if (complaint.complaintId === selectedComplaintId) {
            return { ...complaint, status: newStatus };
          }
          return complaint;
        });
        setComplaintsToShow(updatedComplaints);
        closeModal();
      })
      .catch((error) => {
        console.error('Error updating complaint status:', error);
      });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Plumbing': return Wrench;
      case 'Electrical': return Wrench;
      case 'Furniture': return Wrench;
      case 'Cleaning': return Wrench;
      case 'Security': return Wrench;
      case 'Internet': return Wrench;
      case 'Others': return Wrench;
      default: return Wrench;
    }
  };

  const filteredComplaints = complaintsToShow.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || complaint.catagory === filterCategory;
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3">
        <h2 className="text-2xl font-bold text-gray-800">Complaint Management</h2>
        <div className="flex gap-3">
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={20} />
            New Complaint
<<<<<<< HEAD
          </button>
=======
          </button> */}
>>>>>>> 5ee06a8c1da2fdd39731e8721db4209b9b2d699a
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{complaintPage.totalComplaints}</h3>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <AlertCircle className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {complaintPage.totalPendingComplaints}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {complaintPage.totalInProgressComplaints}
              </h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Wrench className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {complaintPage.totalResolvedComplaints}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Furniture">Furniture</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Security">Security</option>
          <option value="Internet">Internet</option>
          <option value="Others">Others</option>
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
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map(complaint => {
          const CategoryIcon = getCategoryIcon(complaint.catagory);
          return (
            <div
              key={complaint.complaintId}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getPriorityColor(complaint.priority)}`}>
                    <CategoryIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                        <button
                          className="ml-4 px-2 py-1 bg-blue-500 text-white rounded-full text-xs"
                          onClick={() => openModal(complaint.complaintId)}
                        >
                          Change Status
                        </button>
                      </span>
                    </div>
                    {complaint.imageData && (
                      <div className="mt-4">
                        <img
                          src={`data:image/jpeg;base64,${complaint.imageData}`}
                          alt="Complaint Image"
                          className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                          onClick={() => openImageModal(complaint.imageData)}
                        />
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Building size={16} />
                        <span>{complaint.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{new Date(complaint.complaintDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        <span
                          className="cursor-pointer"
                          onClick={() => openCommentsModal(complaint.comments)}
                        >
                          {complaint.comments.length} comments
                        </span>
                      </div>
                    </div>
                    
                    {complaint.fileData && (
                      <div className="mt-4">
                        <a
                          href={`data:application/pdf;base64,${complaint.fileData}`}
                          download={`complaint_${complaint.title}${complaint.complaintDate.toString()}_file.pdf`}
                          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                        >
                          <Download size={16} />
                          <span>Download File</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Change Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Change Status</h2>
            <select
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => handleChangeStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {isCommentsModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4">
      <h2 className="text-lg font-semibold mb-4 text-center">Comments</h2>
      <div className="mt-2 space-y-4 max-h-96 overflow-y-auto">
        {selectedComments.map((comment, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-800">{comment.commentText}</p>
            <p className="text-xs text-gray-500 mt-2">
              - {comment.commentedBy} at {new Date(comment.commentedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg w-full"
        onClick={closeCommentsModal}
      >
        Close
      </button>
    </div>
  </div>
)}

      {/* Image Modal */}
      {isImageModalOpen && modalImageData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl">
            <img
              src={`data:image/jpeg;base64,${modalImageData}`}
              alt="Complaint Image"
              className="max-w-full h-auto rounded-lg"
            />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={closeImageModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;