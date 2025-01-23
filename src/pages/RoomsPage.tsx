import React, { useState, useEffect } from 'react';
import RoomApplicationForm from '../components/rooms/RoomApplicationForm';

type Student = {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  imageData: string;
  roomNo: string;
  hallId: number;
  room: null;
  hall: null;
};

type RoomsToShow = {
  roomNo: string;
  roomType: string;
  roomStatus: string;
  roomCondition: string;
  hasSeats: number;
  occupiedSeats: number;
  available: number;
  students: Student[];
};

const StudentModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full text-center">
      <h2 className="text-xl font-bold mb-2">Student Details</h2>
      <img src={`data:image/jpeg;base64,${student.imageData}`} alt={student.name} className="mx-auto mb-4 w-32 h-32 rounded-full" />
      <p><strong>ID:</strong> {student.id}</p>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Department:</strong> {student.department}</p>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Close
      </button>
    </div>
  </div>
);

const RoomsPage = () => {
  const [rooms, setRooms] = useState<RoomsToShow[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    fetch('https://localhost:7057/Room/GetRoomData', {
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
            alert(`Unauthorized: ${errorMessage}`);
            return;
          }
          if (response.status === 400) {
            window.location.href = '/';

            alert(`${errorMessage}`);
            //setError(errorMessage);
            setIsLoading(false);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: RoomsToShow[] | null) => {
        if (data === null) {
          throw new Error('No data available');
        }
        setRooms(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching rooms data:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleApply = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
  };

  const closeForm = () => {
    setSelectedRoom(null);
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const closeStudentModal = () => {
    setSelectedStudent(null);
  };

  const filteredRooms = rooms.filter((room) =>
    room.roomNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-red-600">{error}</h1>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">No Rooms In Your Hall Or You are Not Alloted in a Hall</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rooms Page</h1>
      <p className="mb-4">Check room availability and apply for accommodation below.</p>

      <input
        type="text"
        placeholder="Search by Room No"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded-lg w-64"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.roomNo}
            className={`p-4 border rounded-lg shadow-md ${
              room.available ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <h2 className="text-xl font-bold mb-2">Room {room.roomNo}</h2>
            <p className="text-gray-700"><strong>Type:</strong> {room.roomType}</p>
            <p className="text-gray-700"><strong>Status:</strong> {room.roomStatus}</p>
            <p className="text-gray-700"><strong>Condition:</strong> {room.roomCondition}</p>
            <p className="text-gray-700"><strong>Seats:</strong> {room.hasSeats}</p>
            <p className="text-gray-700"><strong>Occupied Seats:</strong> {room.occupiedSeats}</p>
            <p className="text-gray-700"><strong>Available Seats:</strong> {room.available}</p>
            <p className="text-gray-700"><strong>Students:</strong></p>
            <ul className="list-disc list-inside mb-2">
              {room.students.length > 0 ? (
                room.students.map((student) => (
                  <li
                    key={student.id}
                    className="text-gray-700 cursor-pointer underline"
                    onClick={() => handleStudentClick(student)}
                  >
                    {student.name} ({student.id})
                  </li>
                ))
              ) : (
                <li className="text-gray-700">No student</li>
              )}
            </ul>
            {room.available > 0 && (
              <button
                onClick={() => handleApply(room.roomNo)}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedRoom && (
        <RoomApplicationForm roomNumber={selectedRoom} onClose={closeForm} />
      )}

      {selectedStudent && (
        <StudentModal student={selectedStudent} onClose={closeStudentModal} />
      )}
    </div>
  );
};

export default RoomsPage;