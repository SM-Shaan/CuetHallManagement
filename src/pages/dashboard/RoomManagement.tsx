import React, { useState, useEffect } from 'react';
import {
  Home, Users, Key, Trash2, Edit, Plus, Search, AlertCircle
} from 'lucide-react';
//import Modal from 'react-modal';
import Modal, { Styles } from 'react-modal';
import { jwtDecode } from 'jwt-decode';
import { DOMAIN } from '../../constants/domain';

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
    height: 'fit-content',
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



type AdminRoomShow = {
  roomNo: string;
  roomStatus: string;
  roomCondition: string;
  hasSeats: number;
  occupiedSeats: number;
  available: number;
}
type PendingRequest = {
  roomNo: string;
  hallId: number;
  studentId: number;
  requestedAt: string;
}

type AdminRoomPage = {
  totalRooms: number;
  availableRooms: number;
  totalSeats: number;
  availableSeats: number;
  roomConditionNotOk: number;
  adminRoomToShow: AdminRoomShow[];
  pendingRoomRequests: PendingRequest[];
}

type NewRoom = {
  roomNo: string;
  roomCondition: string;
  hasSeats: number;
}

const RoomManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoomNo, setFilterRoomNo] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentDetails, setStudentDetails] = useState({ image: '', name: '', studentId: '', department: '', email: '' });
  const [selectedRoomRequests, setSelectedRoomRequests] = useState<PendingRequest[] | null>(null);
  const [adminRoomPage, setAdminRoomPage] = useState<AdminRoomPage>({
    totalRooms: 0,
    availableRooms: 0,
    totalSeats: 0,
    availableSeats: 0,
    roomConditionNotOk: 0,
    adminRoomToShow: [],
    pendingRoomRequests: []
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoomDetails, setEditRoomDetails] = useState<{ roomNo: string, roomCondition: string, hasSeats: number, prevRoomNo: string } | null>(null);


  const [loading, setLoading] = useState(true);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedRoomStudents, setSelectedRoomStudents] = useState<{ name: string; studentId: Number }[]>([]);

  const [role, setRole] = useState<string | null>(null);
  const Token = localStorage.getItem('token');
 
  useEffect(() => {
    if (Token) {
      const decodedToken: any = jwtDecode(Token);
      setRole(decodedToken.role);
  
    }
    fetch(`${DOMAIN}/AdminRoom/Room`, {
      method: 'GET',
      headers: {
        'content-type': '<application/json',
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
      .then((data: AdminRoomPage) => {
        setAdminRoomPage(data);
        //console.log(data);
        console.log(adminRoomPage);
        setLoading(false);
      })
  }, []);



  const fetchStudentsForRoom = async (roomNo: string) => {
    try {
      const response = await fetch(`${DOMAIN}/AdminRoom/GetStudents/${roomNo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        },
        body: JSON.stringify({ roomNo }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      console.log(data);
      setSelectedRoomStudents(data);
      console.log(selectedRoomStudents);
      setShowStudentsModal(true);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students');
    }
  };


  const filteredRooms = adminRoomPage.adminRoomToShow.filter(room => {
    const matchesSearch = room.roomNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || room.roomStatus === filterStatus;
    const matchesCondition = filterType === 'all' ||
      (filterType === 'Good' && room.roomCondition === 'Good') ||
      (filterType === 'Need Maintenance' && room.roomCondition === 'Need Maintenance');

    return matchesSearch && matchesStatus && matchesCondition;
  });

  const handleOpenRequestsModal = (studentId: number) => {
    const request = adminRoomPage.pendingRoomRequests.find(req => req.studentId === studentId);
    if (request) {
      setSelectedRoomRequests([request]);
    }
  };


  const handleClearRoom = (roomNo: string) => {
    fetch(`${DOMAIN}/AdminRoom/DeleteRoom/${roomNo}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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
      .then((data: AdminRoomPage) => {
        setAdminRoomPage(data);
        console.log(data);
        alert('Room deleted successfully');
        return;
      })
      .catch((error) => {
        console.error('Error deleting room:', error);
        alert('Failed to delete room');
      });
  };


  const handleEditRoom = (roomNo: string) => {
    const room = filteredRooms.find(r => r.roomNo === roomNo);
    if (room) {
      setEditRoomDetails({
        roomNo: room.roomNo,
        roomCondition: room.roomCondition,
        hasSeats: room.hasSeats,
        prevRoomNo: room.roomNo, // Set the previous room number
      });
      setShowEditModal(true);
    }
  };

  const handleSaveChanges = (roomNo: string) => {
    console.log(editRoomDetails);
    console.log(roomNo);
    fetch(`${DOMAIN}/AdminRoom/UpdateSingleRoom/${roomNo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify(editRoomDetails),
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
      .then((data: AdminRoomPage) => {
        setAdminRoomPage(data);
        console.log(data);
        alert('Room updated successfully');
        setShowEditModal(false);
        return;
      })
      .catch((error) => {
        console.error('Error updating room:', error);
        alert('Failed to update room');
      });
    //setShowEditModal(false);
  };

  const handleRoomNeedService = (roomNo: string) => {
    fetch(`${DOMAIN}/AdminRoom/UpdateCondition/${roomNo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify({ roomNo }),
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
      .then((data: AdminRoomPage) => {
        setAdminRoomPage(data);
        console.log(data);
        alert('Service status updated successfully');
        return;
      })
      .catch((error) => {
        console.error('Error marking room for service:', error);
        alert('Failed to mark room for service');
      });
  };

  const handleCloseRequestsModal = () => {
    setSelectedRoomRequests(null);
  };


  const handleStudentDetails = (studentId: Number) => {
    //alert(studentId);

    fetch(`${DOMAIN}/AdminRoom/GetStudent/${studentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify({ studentId }),
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
      .then((data) => {

        console.log(data);
        setStudentDetails(data);
        console.log(data);
        setShowStudentModal(true);

        return
      })
      .catch((error) => {
        console.error('Error fetching student details:', error);
        alert('Failed to fetch student details');
      });
  }

  const handleAcceptRequest = (studentId: number) => {

    fetch(`${DOMAIN}/AdminRoom/AcceptRequest/${studentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify({ studentId }),
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
      .then((data: AdminRoomPage) => {
        setAdminRoomPage(data);
        console.log(data);
        alert('Room allocated successfully');
        return;
      })
      .catch((error) => {
        console.error('Error allocating room:', error);
        alert('Failed to allocate room');
      });

    handleCloseRequestsModal();
  };

  const handleRejectRequest = (studentId: number) => {
    fetch(`${DOMAIN}/AdminRoom/RejectRequest/${studentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify({ studentId }),
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
      .then((data: AdminRoomPage) => {
        setAdminRoomPage(data);
        console.log(data);
        alert('Room request rejected successfully');
        return;
      })
      .catch((error) => {
        console.error('Error rejecting room request:', error);
        alert('Failed to reject room request');
      });
    handleCloseRequestsModal();
  };


  const handleAddRoom = (roomData: NewRoom) => {

    fetch(`${DOMAIN}/AdminRoom/AddRoom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify(roomData),
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
            window.location.reload();
            alert(`${errorMessage}`);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: AdminRoomPage) => {
        setAdminRoomPage(data)
        console.log(data);
        //alert('Room added successfully');
        setLoading(false);
        setShowAddModal(false);
        return;
      })
      .catch((error) => {
        console.error('Error adding room:', error);
        alert('Failed to add room');
      });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Loading...</h1>
        </div>
      </div>
    );
  };



  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Room Management</h2>
        <div className="flex gap-3" style={{ paddingTop: role === 'HallAdmin' ? '5px' : '0px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add New Room
          </button>
        </div>
      </div>

      {/* Add Room Modal */}
      <Modal
        isOpen={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
        contentLabel="Add Room"
        style={{
          ...modalStyles, // Preserve any existing styles
          content: {
            ...modalStyles.content, // Preserve existing content styles
            width: "600px", // Set a wider width
            height: "50vh", // Allow height to adjust based on content
            maxHeight: "150vh", // Ensure the modal doesn't exceed the viewport height
            margin: "auto", // Center the modal
            padding: "20px", // Add padding for better spacing
          },
        }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Room</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            const formData = new FormData(e.target as HTMLFormElement); // Get form data
            const roomData: NewRoom = {
              roomNo: formData.get("roomNo") as string, // Extract roomNo
              roomCondition: formData.get("roomCondition") as string, // Extract roomCondition
              hasSeats: parseInt(formData.get("hasSeats") as string), // Extract hasSeats and convert to number
            };
            handleAddRoom(roomData); // Pass data to handler
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Room No</label>
              <input
                type="text"
                name="roomNo" // Match the NewRoom type field
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Room Condition</label>
              <select
                name="roomCondition" // Match the NewRoom type field
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="Good">Good</option>
                <option value="Need Maintenence">Need Maintenence</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Total Seats</label>
              <input
                type="number"
                name="hasSeats" // Match the NewRoom type field
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Room
            </button>
          </div>
        </form>
      </Modal>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{adminRoomPage.totalRooms}</h3>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Home className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Available Rooms</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {adminRoomPage.availableRooms}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Key className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Need Maintenance</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {adminRoomPage.roomConditionNotOk}
              </h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">
                {Math.round(((adminRoomPage.totalSeats - adminRoomPage.availableSeats) / (adminRoomPage.totalSeats) * 100))}%
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
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
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="UnOccupied">UnOccupied</option>
              <option value="Partial Occupied">Partial Occupied</option>
              <option value="Fully Occupied">Fully Occupied</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Condition</option>
              <option value="Good">Good</option>
              <option value="Need Maintanence">Need Maintanence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[700px] overflow-y-auto">
        {filteredRooms.map(room => (
          <div
            key={room.roomNo}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow ${room.roomCondition === 'Need Maintenance' ? 'bg-red-100' : ''
              }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Room {room.roomNo}</h3>
                  <p className="text-sm text-gray-600">{room.roomCondition}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${room.roomStatus === 'UnOccupied'
                    ? 'bg-green-100 text-green-800'
                    : room.roomStatus === 'Partial Occupied'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                    }`}
                >
                  {room.roomStatus}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Seats:</span>
                  <span className="font-medium">{room.hasSeats}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Occupied Seats:</span>
                  <span className="font-medium">{room.occupiedSeats}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Seats:</span>
                  <span className="font-medium">{room.hasSeats - room.occupiedSeats}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => fetchStudentsForRoom(room.roomNo)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                >
                  Show Students
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => handleEditRoom(room.roomNo)}>
                  <Edit size={18} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleClearRoom(room.roomNo)}>
                  <Trash2 size={18} />
                </button>
              </div>

              {room.roomCondition === 'Need Maintenence' && (
                <div className="mt-4 text-red-600 flex items-center">
                  <span className="mr-2">⚠️</span>
                  <span>Needs Maintenance</span>
                  <button
                    onClick={() => {
                      if (window.confirm('Has this room been serviced?')) {
                        handleRoomNeedService(room.roomNo);
                      }
                    }}
                    className="ml-1 px-1 py-0 text-black rounded-lg hover:bg-green-700"
                  >
                    Mark as Serviced
                  </button>
                </div>
              )}
              {room.roomCondition !== 'Need Maintenence' && (
                <div className="mt-4 text-red-600 flex items-center">
                  <button
                    onClick={() => {
                      if (window.confirm('Does this room need to be serviced?')) {
                        handleRoomNeedService(room.roomNo);
                      }
                    }}
                    className="ml-1 px-1 py-0 text-black rounded-lg hover:bg-red-700"
                  >
                    Need to be Serviced?
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Students Modal */}
      <Modal
        isOpen={showStudentsModal}
        onRequestClose={() => setShowStudentsModal(false)}
        contentLabel="Students in Room"
        style={modalStyles}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Students in Room</h3>
        <div className="space-y-4">
          {selectedRoomStudents.length > 0 ? (
            selectedRoomStudents.map((student, index) => (
              <div key={index} className="flex justify-between items-center" onClick={() => handleStudentDetails(student.studentId)}>
                <span className="text-gray-800">{student.name}</span>
                <span className="text-gray-600">{student.studentId.toString()}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No students found in this room.</p>
          )}
        </div>
        <button
          onClick={() => setShowStudentsModal(false)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Close
        </button>
      </Modal>

      <Modal
        isOpen={showStudentModal}
        onRequestClose={() => setShowStudentModal(false)}
        contentLabel="Student Details"
        style={{
          content: {
            ...modalStyles.content,
            maxWidth: '400px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            height: 'fit-content',
          },
          overlay: {
            ...modalStyles.overlay,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <div className="p-6 text-center">
          <img
            src={`data:image/png;base64,${studentDetails.image}`}
            alt="Student"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-300"
          />
          <h3 className="text-xl font-bold text-gray-800 mb-2">{studentDetails.name}</h3>
          <p className="text-sm text-gray-600">ID: {studentDetails.studentId}</p>
          <p className="text-sm text-gray-600">Department: {studentDetails.department}</p>
          <p className="text-sm text-gray-600">Email: {studentDetails.email}</p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowStudentModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>


      <p className="text-gray-600 font-bold">Showing Requests For Room Allocation</p>
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Filter by Room No"
          value={filterRoomNo}
          onChange={(e) => setFilterRoomNo(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6 border border-gray-300">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Pending Requests</h3>
        <div className="space-y-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {adminRoomPage.pendingRoomRequests && adminRoomPage.pendingRoomRequests.length > 0 ? (
            adminRoomPage.pendingRoomRequests
              .filter(request => request.roomNo.toLowerCase().includes(filterRoomNo.toLowerCase()))
              .map(request => (
                <div key={request.roomNo} className="flex justify-between items-center border-b border-gray-300 pb-2">
                  <span className="text-gray-800">Room {request.roomNo}</span>
                  <button
                    onClick={() => handleOpenRequestsModal(request.studentId)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    View Requests
                  </button>
                </div>
              ))
          ) : (
            <p className="text-gray-600">No pending room requests.</p>
          )}
        </div>
      </div>

      {/* Requests Modal */}
      {selectedRoomRequests && (
        <Modal
          isOpen={!!selectedRoomRequests}
          onRequestClose={handleCloseRequestsModal}
          contentLabel="Room Requests"
          style={modalStyles}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Room Requests</h3>
          <div className="space-y-4">
            {selectedRoomRequests.map(request => (
              <div key={request.studentId} className="flex justify-between items-center">
                <span className="text-gray-800">Student ID: {request.studentId}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.studentId)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.studentId)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleCloseRequestsModal}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </Modal>
      )}

      <Modal
        isOpen={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        contentLabel="Edit Room"
        style={modalStyles}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Room</h3>
          {editRoomDetails && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveChanges(editRoomDetails.roomNo);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Room No</label>
                  <input
                    type="text"
                    name="roomNo"
                    value={editRoomDetails.roomNo}
                    onChange={(e) => setEditRoomDetails({ ...editRoomDetails, roomNo: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Room Condition</label>
                  <select
                    name="roomCondition"
                    value={editRoomDetails.roomCondition}
                    onChange={(e) => setEditRoomDetails({ ...editRoomDetails, roomCondition: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="Good">Good</option>
                    <option value="Need Maintenance">Need Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700">Total Seats</label>
                  <input
                    type="number"
                    name="hasSeats"
                    value={editRoomDetails.hasSeats}
                    onChange={(e) => setEditRoomDetails({ ...editRoomDetails, hasSeats: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RoomManagement;