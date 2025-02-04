import React, { useEffect, useState } from 'react';
import {
  Users, Search, Filter, Download, UserPlus, Edit, Trash2,
  Mail, Phone, Calendar, BookOpen, Home, AlertCircle, CheckCircle
} from 'lucide-react';
//import { MoveDiagonal } from 'lucide-react';
import Modal, { Styles } from 'react-modal';

Modal.setAppElement('#root');

const modalStyles: Styles = {
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
    height: 'auto',
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



type StudentToShow={
  studentId: number;
  name: string;
  email: string;
  department: string;
  batch: Number;
  roomNo: string;
  paymentStatus: string;
  isActive: boolean;
  image: string;
}

type StudentManagementPage={
  totalStudents: number,
  paymentDue: number,
  activeStudents: number,
  dinningAttendenceInPercent: number,
  students: StudentToShow[]
}

type AvailableRooms={
  roomNo: string;
  totalSeats: number;
  availableSeats: number;
}

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBatch, setFilterBatch] = useState('');
  const [studentManagementPage, setStudentManagementPage] = useState<StudentManagementPage>({
    totalStudents: 0,
    paymentDue: 0,
    activeStudents: 0,
    dinningAttendenceInPercent: 0,
    students: []
  });
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState<AvailableRooms[]>([]);
  const [assignRoomModalOpen, setAssignRoomModalOpen] = useState(false);
  const Token=localStorage.getItem('token');

  useEffect(() => {
    const fetchData = () => {
      fetch('https://localhost:7057/StudentManagement/GetStudentManagementPage', {
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
        .then((data: StudentManagementPage) => {
          setStudentManagementPage(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    };
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    fetchData(); 
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    }, 60000); 
  
    return () => {
      clearInterval(intervalId); 
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  console.log(studentManagementPage);

  console.log(studentManagementPage);

  const handleDelete = (studentId: number) => {
    const isDelete = window.confirm('Are you sure to delete?');
    if (!isDelete) return;

    fetch(`https://localhost:7057/StudentManagement/DeleteStudent/${studentId}`, {
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
            window.location.href = '/';
            alert(`${errorMessage}`);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data:StudentManagementPage) => {
        setStudentManagementPage(data);
        alert('Student Deleted Successfully');
        return;
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const openAssignRoomModal = (studentId: number) => {
    setSelectedStudentId(studentId); // Store the studentId
    fetch('https://localhost:7057/StudentManagement/GetAvailableRooms', {
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
      .then((data: AvailableRooms[]) => {
        setAvailableRooms(data);
        setAssignRoomModalOpen(true); // Open the modal
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleAssignRoom = (roomNo: string) => {
    console.log(roomNo);
    console.log(selectedStudentId);
    if (!selectedStudentId) return;
    //Ask for confirmation
    const isAssign = window.confirm('Are you sure to assign this room?');
    fetch(`https://localhost:7057/StudentManagement/AssignRoom/${selectedStudentId}/${roomNo}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      //body: JSON.stringify({ roomNo }), // Send the room number to assign
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
      .then((data: StudentManagementPage) => {
        setStudentManagementPage(data); // Update the student list
        setAssignRoomModalOpen(false); // Close the modal
        alert('Room Assigned Successfully');
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const filteredStudents = studentManagementPage.students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toString().includes(searchTerm);
    const matchesDepartment = filterDepartment === 'all' || student.department === filterDepartment;
    const matchesBatch = filterBatch === '' || student.batch.toString().includes(filterBatch);
    const matchesStatus = filterStatus === 'all' || student.isActive === (filterStatus === 'Active');
    return matchesSearch && matchesDepartment && matchesBatch && matchesStatus;
  });

  const getStatusColor = (status: StudentToShow['isActive']) => {
    switch (status) {
      case true: return 'bg-green-100 text-green-800';
      case false: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: StudentToShow['paymentStatus']) => {
    switch (status) {
      case 'Paid': return 'text-green-600';
      case 'Pending': return 'text-orange-600';
      case 'Due': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };


  if(loading){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Loading...</h1>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
        <div className="flex gap-3">
          
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{studentManagementPage.totalStudents}</h3>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Active Students</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {studentManagementPage.activeStudents}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Payment Due</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {studentManagementPage.paymentDue}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Dinning Attendance</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">
                {studentManagementPage.dinningAttendenceInPercent}%
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="text-blue-600" size={24} />
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
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="TE">ETE</option>
              <option value="IPE">IPE</option>
              <option value="MSE">MSE</option>
              <option value="NSE">WRE</option>
              <option value="ARCH">ARCH</option>
              <option value="URP">URP</option>
              <option value="BME">URP</option>             
            </select>
             <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search Batch..."
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inacive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredStudents.length > 0 ? (
    filteredStudents.map(student => (
      <div key={student.studentId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <img
              src={`data:image/png;base64,${student.image}`}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(student.isActive ? true : false)}`}>
                  {student.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen size={16} className="text-gray-400" />
              <span>{student.department} - {student.batch.toString()} Batch</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Home size={16} className="text-gray-400" />
              {student.roomNo ? (
  <span>Room: {student.roomNo}</span>
) : (
  <>
    <span>No Room Assigned</span>
    <button
      className="ml-2 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
      onClick={() => openAssignRoomModal(student.studentId)}
    >
      Assign Room
    </button>
  </>
)}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} className="text-gray-400" />
              <a href={`mailto:${student.email}`} className="text-indigo-600 hover:text-indigo-800">
                {student.email}
              </a>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Status:</span>
              <span className={`text-sm font-medium ${getPaymentStatusColor(student.paymentStatus)}`}>
                {student.paymentStatus}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            {/* <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
              <Edit size={18} />
            </button> */}
            <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(student.studentId)}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-600">
      No Student
    </div>
  )}
</div>
<Modal
  isOpen={assignRoomModalOpen}
  onRequestClose={() => setAssignRoomModalOpen(false)}
  className="modal"
  overlayClassName="overlay"
  style={modalStyles}
>
  <div className="p-6 bg-white rounded-xl shadow-md max-h-96 overflow-y-auto">
    <h2 className="text-xl font-bold text-gray-800">Assign Room</h2>
    <div className="mt-4 space-y-4">
      {availableRooms.map((room) => (
        <div key={room.roomNo} className="flex justify-between items-center">
          <span>{room.roomNo}</span>
          <span>{room.availableSeats} seats available</span>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => handleAssignRoom(room.roomNo)} // Assign the room
          >
            Assign
          </button>
        </div>
      ))}
    </div>
  </div>
</Modal>
    </div>

    /*assign room modal*/


  );
};

export default StudentManagement; 