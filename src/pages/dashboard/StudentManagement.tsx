import React, { useState } from 'react';
import {
  Users, Search, Filter, Download, UserPlus, Edit, Trash2,
  Mail, Phone, Calendar, BookOpen, Home, AlertCircle, CheckCircle
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  studentId: string;
  photo: string;
  department: string;
  year: string;
  room: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Alumni';
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  attendance: number;
}

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const students: Student[] = [
    {
      id: 1,
      name: 'John Doe',
      studentId: '2024001',
      photo: 'https://i.pravatar.cc/150?img=1',
      department: 'CSE',
      year: '3rd',
      room: '101',
      email: 'john.doe@example.com',
      phone: '+880 1234567890',
      guardianName: 'Robert Doe',
      guardianPhone: '+880 1234567891',
      address: 'Dhaka, Bangladesh',
      joinDate: '2024-01-15',
      status: 'Active',
      paymentStatus: 'Paid',
      attendance: 95
    },
    // Add more student data...
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm) ||
      student.room.includes(searchTerm);
    const matchesDepartment = filterDepartment === 'all' || student.department === filterDepartment;
    const matchesYear = filterYear === 'all' || student.year === filterYear;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
  });

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Alumni': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Student['paymentStatus']) => {
    switch (status) {
      case 'Paid': return 'text-green-600';
      case 'Pending': return 'text-orange-600';
      case 'Overdue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <UserPlus size={20} />
            Add New Student
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
              <p className="text-sm text-gray-600">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{students.length}</h3>
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
                {students.filter(s => s.status === 'Active').length}
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
                {students.filter(s => s.paymentStatus === 'Overdue').length}
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
              <p className="text-sm text-gray-600">Avg. Attendance</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">
                {Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)}%
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
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Years</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <div key={student.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                      <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen size={16} className="text-gray-400" />
                  <span>{student.department} - {student.year} Year</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Home size={16} className="text-gray-400" />
                  <span>Room {student.room}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${student.email}`} className="text-indigo-600 hover:text-indigo-800">
                    {student.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <a href={`tel:${student.phone}`} className="text-indigo-600 hover:text-indigo-800">
                    {student.phone}
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
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Attendance:</span>
                  <span className="text-sm font-medium">{student.attendance}%</span>
                </div>
              </div>

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

export default StudentManagement; 