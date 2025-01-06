import React, { useState } from 'react';

type DashboardSection = 'overview' | 'rooms' | 'students' | 'notices' | 'complaints' | 'settings';

interface NavigationItem {
  id: DashboardSection;
  label: string;
  icon: typeof LucideIcon;
}
import {
  Users, Home, Bell, MessageSquare, Settings, PieChart,
  TrendingUp, Calendar, AlertCircle, CheckCircle, Clock,
  Filter, Search, Download, Printer, RefreshCw, Menu, X, LucideIcon
} from 'lucide-react';
import RoomManagement from './dashboard/RoomManagement';
import StudentManagement from './dashboard/StudentManagement';
import NoticeManagement from './dashboard/NoticeManagement';
import ComplaintManagement from './dashboard/ComplaintManagement';

interface DashboardStats {
  totalStudents: number;
  occupiedRooms: number;
  availableRooms: number;
  pendingComplaints: number;
  totalNotices: number;
  monthlyRevenue: number;
}

interface RecentActivity {
  id: number;
  type: 'complaint' | 'payment' | 'room' | 'notice';
  description: string;
  timestamp: string;
  status: string;
}

interface Complaint {
  id: number;
  title: string;
  description: string;
  studentName: string;
  roomNumber: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  category: 'maintenance' | 'facility' | 'roommate' | 'other';
}

const ManagerDashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<DashboardSection>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navigationItems: NavigationItem[] = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'rooms', label: 'Room Management', icon: Home },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'notices', label: 'Notice Management', icon: Bell },
    { id: 'complaints', label: 'Complaint Box', icon: AlertCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const stats: DashboardStats = {
    totalStudents: 450,
    occupiedRooms: 200,
    availableRooms: 50,
    pendingComplaints: 15,
    totalNotices: 8,
    monthlyRevenue: 150000
  };

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
      category: "maintenance"
    },
    // Add more complaints...
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Students</h3>
            <Users className="text-indigo-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalStudents}</p>
          <p className="text-sm text-gray-600 mt-1">Active residents</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Rooms</h3>
            <Home className="text-indigo-600" size={24} />
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-800">
              {stats.occupiedRooms}/{stats.occupiedRooms + stats.availableRooms}
            </p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <p className="text-sm font-medium text-green-600">
                {Math.round((stats.occupiedRooms / (stats.occupiedRooms + stats.availableRooms)) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
            <TrendingUp className="text-indigo-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">৳{stats.monthlyRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Complaints</h3>
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingComplaints}</p>
          <p className="text-sm text-red-600 mt-1">Pending resolution</p>
        </div>
      </div>

      {/* Complaints Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Complaints</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">View all</button>
          </div>
          <div className="space-y-4">
            {complaints.slice(0, 4).map(complaint => (
              <div key={complaint.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${
                  complaint.priority === 'high' ? 'bg-red-100' :
                  complaint.priority === 'medium' ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  <AlertCircle className={`${
                    complaint.priority === 'high' ? 'text-red-600' :
                    complaint.priority === 'medium' ? 'text-orange-600' : 'text-green-600'
                  }`} size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-800">{complaint.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      complaint.status === 'pending' ? 'bg-red-100 text-red-800' :
                      complaint.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Room {complaint.roomNumber} - {complaint.studentName}</p>
                  <p className="text-xs text-gray-500 mt-1">{complaint.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complaints Analytics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Complaints Analytics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">By Status</span>
                <span className="text-gray-800">Total: {complaints.length}</span>
              </div>
              <div className="space-y-2">
                {['pending', 'in-progress', 'resolved'].map(status => {
                  const count = complaints.filter(c => c.status === status).length;
                  const percentage = Math.round((count / complaints.length) * 100);
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize">{status}</span>
                        <span>{count} ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            status === 'pending' ? 'bg-red-500' :
                            status === 'in-progress' ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">By Category</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['maintenance', 'facility', 'roommate', 'other'].map(category => {
                  const count = complaints.filter(c => c.category === category).length;
                  return (
                    <div key={category} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 capitalize">{category}</p>
                      <p className="text-lg font-semibold text-gray-800 mt-1">{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (selectedSection) {
      case 'rooms':
        return <RoomManagement />;
      case 'students':
        return <StudentManagement />;
      case 'notices':
        return <NoticeManagement />;
      case 'complaints':
        return <ComplaintManagement />;
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <div className="mt-6">
              <p className="text-gray-600">Settings section is under development.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            {renderOverview()}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Side Navigation */}
      <div 
        className={`
          fixed left-0 top-0 h-screen w-64 bg-indigo-800 text-white p-4 z-10
          transform transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Manager Dashboard</h2>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setSelectedSection(id as DashboardSection);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${selectedSection === id 
                  ? 'bg-indigo-700 text-white' 
                  : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                }
              `}
              aria-current={selectedSection === id ? 'page' : undefined}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen bg-gray-50 transition-all duration-200">
        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        
        {/* Content Area */}
        <div className="p-4">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard; 