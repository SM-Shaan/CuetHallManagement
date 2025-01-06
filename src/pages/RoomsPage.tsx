import React from 'react';

const RoomsPage = () => {
  const rooms = [
    { id: 1, roomNumber: '101', type: 'Single', available: true },
    { id: 2, roomNumber: '102', type: 'Double', available: false },
    { id: 3, roomNumber: '103', type: 'Triple', available: true },
    { id: 4, roomNumber: '104', type: 'Quadruple', available: false },
    { id: 5, roomNumber: '105', type: 'Single', available: true },
  ];

  const handleApply = (roomNumber: string) => {
    alert(`Your application for Room ${roomNumber} has been submitted!`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rooms Page</h1>
      <p className="mb-4">Check room availability and apply for accommodation below.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`p-4 border rounded-lg shadow-md ${
              room.available ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <h2 className="text-xl font-bold">Room {room.roomNumber}</h2>
            <p>Type: {room.type}</p>
            <p>Status: {room.available ? 'Available' : 'Not Available'}</p>
            {room.available && (
              <button
                onClick={() => handleApply(room.roomNumber)}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;