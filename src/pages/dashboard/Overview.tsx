import React from 'react';
import {
  Users, Home, Bell, TrendingUp, Calendar, Clock,
  DollarSign, Activity, ArrowUp, ArrowDown, BarChart2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OverviewProps {
  stats: {
    totalStudents: number;
    occupiedRooms: number;
    availableRooms: number;
    pendingComplaints: number;
    totalNotices: number;
    monthlyRevenue: number;
  };
}

const Overview: React.FC<OverviewProps> = ({ stats }) => {
  // Sample data for charts
  const revenueData = [
    { month: 'Jan', amount: 125000 },
    { month: 'Feb', amount: 130000 },
    { month: 'Mar', amount: 150000 },
    // Add more months...
  ];

  const occupancyData = [
    { month: 'Jan', occupied: 180, available: 70 },
    { month: 'Feb', occupied: 190, available: 60 },
    { month: 'Mar', occupied: 200, available: 50 },
    // Add more months...
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalStudents}</h3>
              <span className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUp size={12} className="mr-1" />
                12% increase
              </span>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Room Occupancy</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {Math.round((stats.occupiedRooms / (stats.occupiedRooms + stats.availableRooms)) * 100)}%
              </h3>
              <span className="text-xs text-orange-600 flex items-center mt-1">
                <ArrowUp size={12} className="mr-1" />
                5% increase
              </span>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Home className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                ৳{stats.monthlyRevenue.toLocaleString()}
              </h3>
              <span className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUp size={12} className="mr-1" />
                8% increase
              </span>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Pending Issues</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.pendingComplaints}</h3>
              <span className="text-xs text-red-600 flex items-center mt-1">
                <ArrowDown size={12} className="mr-1" />
                3 new today
              </span>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Bell className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
            <select className="text-sm border rounded-lg px-2 py-1">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Occupancy Trend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Room Occupancy</h3>
            <select className="text-sm border rounded-lg px-2 py-1">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="occupied" fill="#4F46E5" />
                <Bar dataKey="available" fill="#E5E7EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Payment Received</p>
              <p className="text-xs text-gray-500">Room 301 - March Rent</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>

          <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Home className="text-orange-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">New Room Allocation</p>
              <p className="text-xs text-gray-500">Room 205 assigned to John Doe</p>
            </div>
            <span className="text-xs text-gray-500">5 hours ago</span>
          </div>

          <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bell className="text-red-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">New Complaint</p>
              <p className="text-xs text-gray-500">Maintenance required in Room 402</p>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 