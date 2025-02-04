import React, { useEffect, useState } from 'react';
import {
  AlertCircle, Filter, Search, Plus, Clock,
  CheckCircle, MessageCircle, Users,
  Building, Download, RefreshCw, Wrench
} from 'lucide-react';

interface Complaint {
  id: number;
  title: string;
  description: string;
  studentName: string;
  roomNumber: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
  category: 'maintenance' | 'facility' | 'roommate' | 'other';
  assignedTo?: string;
  comments: number;
}

type ComplaintPage={
  totalComplaints:number;
  totalPendingComplaints:number;
  totalInProgressComplaints:number;
  totalResolvedComplaints:number;
}

const ComplaintManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [complaintPage,setComplaintPage]=useState<ComplaintPage>({
    totalComplaints:0,
    totalPendingComplaints:0,
    totalInProgressComplaints:0,
    totalResolvedComplaints:0 
  });
//  useEffect(() => {
//     fetch(`https://localhost:7057/NoticeManagement/GetNoticesOfHall`, {
//       method: 'GET',
//       headers: {
//         'content-type': 'application/json',
//         'Authorization': `Bearer ${Token}`,
//       },
//     })
//       .then(async (response) => {
//         if (!response.ok) {
//           const errorMessage = await response.text();
//           if (response.status === 401) {
//             window.location.href = '/login';
//             alert(`Unauthorized: Login First`);
//             return;
//           }
//           if (response.status === 400) {
//             window.location.href = '/';
//             alert(`${errorMessage}`);
//             return;
//           }
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((data: NoticePage) => {
//         setNoticepage(data);
//       })
//       .catch((error) => {
//         console.error('Error fetching notices data:', error);
//       });
//   }, [Token]);

  const Token=localStorage.getItem('token');
  useEffect(()=>{
    fetch(`https://localhost:7057/AminComplaint/AdminComplaintOverview`,{
      method:'GET',
      headers:{
        'content-type':'application/json',
        'Authorization':`Bearer ${Token}`,
      },
    })
    .then(async(response)=>{
      if(!response.ok){
        const errorMessage=await response.text();
        if(response.status===401){
          window.location.href='/login';
          alert(`Unauthorized: Login First`);
          return;
        }
        if(response.status===400){
          window.location.href='/';
          alert(`${errorMessage}`);
          return;
        }
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data:ComplaintPage)=>{
      setComplaintPage(data);
      return;
    })
    .catch((error)=>{
      console.error('Error fetching complaints data:',error);
    }
    )
  },[]);

  console.log(complaintPage);







  const complaints: Complaint[] = [
    {
      id: 1,
      title: "AC Not Working",
      description: "The air conditioner in room 101 is not cooling properly",
      studentName: "John Doe",
      roomNumber: "101",
      status: "pending",
      priority: "high",
      createdAt: "2024-03-15",
      updatedAt: "2024-03-15",
      category: "maintenance",
      assignedTo: "Maintenance Team A",
      comments: 3
    },
    // Add more complaints...
  ];

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityColor = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getCategoryIcon = (category: Complaint['category']) => {
    switch (category) {
      case 'maintenance': return Wrench;
      case 'facility': return Building;
      case 'roommate': return Users;
      case 'other': return AlertCircle;
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || complaint.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Complaint Management</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={20} />
            New Complaint
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={20} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{complaints.length}</h3>
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
                {complaints.filter(c => c.status === 'pending').length}
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
                {complaints.filter(c => c.status === 'in-progress').length}
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
                {complaints.filter(c => c.status === 'resolved').length}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
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
                placeholder="Search complaints..."
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
              <option value="maintenance">Maintenance</option>
              <option value="facility">Facility</option>
              <option value="roommate">Roommate</option>
              <option value="other">Other</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map(complaint => {
          const CategoryIcon = getCategoryIcon(complaint.category);
          return (
            <div 
              key={complaint.id} 
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
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{complaint.studentName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building size={16} />
                        <span>Room {complaint.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{complaint.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        <span>{complaint.comments} comments</span>
                      </div>
                    </div>
                    {complaint.assignedTo && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Assigned to: <span className="font-medium text-gray-800">{complaint.assignedTo}</span>
                        </p>
                      </div>
                    )}
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

export default ComplaintManagement; 