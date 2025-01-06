import React, { useState } from 'react';
import { 
  Home, Users, Key, Trash2, Edit, Plus, Search, 
  Filter, Download, RefreshCw, Settings, AlertCircle 
} from 'lucide-react';

interface Room {
  id: number;
  number: string;
  floor: string;
  type: 'Single' | 'Double' | 'Triple';
  capacity: number;
  occupied: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
  lastMaintenance: string;
  monthlyRent: number;
  facilities: string[];
  occupants?: {
    id: number;
    name: string;
    studentId: string;
  }[];
}

const RoomManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const rooms: Room[] = [
    {
      id: 1,
      number: '101',
      floor: '1st',
      type: 'Double',
      capacity: 2,
      occupied: 2,
      status: 'Occupied',
      lastMaintenance: '2024-02-15',
      monthlyRent: 5000,
      facilities: ['AC', 'Attached Bathroom', 'Balcony'],
      occupants: [
        { id: 1, name: 'John Doe', studentId: '2024001' },
        { id: 2, name: 'Jane Smith', studentId: '2024002' }
      ]
    },
    // Add more room data...
  ];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFloor = filterFloor === 'all' || room.floor === filterFloor;
    const matchesType = filterType === 'all' || room.type === filterType;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesFloor && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Room Management</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add New Room
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{rooms.length}</h3>
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
                {rooms.filter(r => r.status === 'Available').length}
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
              <p className="text-sm text-gray-600">Under Maintenance</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {rooms.filter(r => r.status === 'Maintenance').length}
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
                {Math.round((rooms.reduce((acc, room) => acc + room.occupied, 0) / 
                  rooms.reduce((acc, room) => acc + room.capacity, 0)) * 100)}%
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
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Floors</option>
              <option value="1st">1st Floor</option>
              <option value="2nd">2nd Floor</option>
              <option value="3rd">3rd Floor</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <div key={room.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Room {room.number}</h3>
                  <p className="text-sm text-gray-600">{room.floor} Floor</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  room.status === 'Available' ? 'bg-green-100 text-green-800' :
                  room.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {room.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{room.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{room.occupied}/{room.capacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Rent:</span>
                  <span className="font-medium">৳{room.monthlyRent}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Facilities:</p>
                <div className="flex flex-wrap gap-2">
                  {room.facilities.map((facility, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {room.occupants && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Occupants:</p>
                  <div className="space-y-2">
                    {room.occupants.map(occupant => (
                      <div key={occupant.id} className="flex justify-between text-sm">
                        <span>{occupant.name}</span>
                        <span className="text-gray-600">{occupant.studentId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomManagement;