import React, { useState, useEffect } from 'react';
import { Star, Users, Home, AlertCircle } from 'lucide-react';
import { DOMAIN } from '../constants/domain';

type Complaints = {
  complaintId: number;
  title: string;
  catagory: string;
  priority: string;
  status: string;
  location: string;
  complaintDate: string;
};

type Statics = {
  totalStudents: number;
  occupiedRooms: number;
  availableRooms: number;
  pendingComplaints: number;
  totalNotices: number;
  totalSeats: number;
  occupiedSeats: number;
  totalRooms: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  recentComplaints: Complaints[];
  review: number; // can be fractional
  complaintsCategory: { [key: string]: number };
  totalReview: number;
};

type selectedHall =
{
  hallId: number;
  hallName: string;
}

type allHalls=
{
  halls: selectedHall[];
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
        size={30}
      />
    );
  }
  return stars;
};

const AdminOverviewPage: React.FC = () => {
  const [statics, setStatics] = useState<Statics>({} as Statics);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // State for hall filtering
  const [selectedHall, setSelectedHall] = useState<selectedHall>({} as selectedHall);

  const[allHalls,setAllHalls]=useState<allHalls>({} as allHalls);

  // Assume that the user's role is stored in localStorage (adjust as needed)

  useEffect(() => {
    const Token = localStorage.getItem('token');
    fetch(`${DOMAIN}/DSWHallOverview/Halls`, {
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
            .then((data: allHalls) => {
        if (!data || !data.halls || data.halls.length === 0) {
          
            window.location.href = '/addhall'
            alert('No Hall Available');
          return;
        }
        setAllHalls(data);
        const firstHall=data.halls[0];
        setSelectedHall(firstHall);
        handleStatics(firstHall.hallId);
        return;
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });    

  }, []);
  console.log(selectedHall.hallId);
  
  const handleStatics = (hallId:number) => {
    
    const Token = localStorage.getItem('token');
    //const hallId = selectedHall.hallId;
    console.log(hallId);
    fetch(`${DOMAIN}/DSWHallOverview/GetHallOverview/${hallId}`, {
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
      .then((data: Statics) => {
        console.log(data);
        setStatics(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error.message);
      });
  };

  // console.log(selectedHall);
  // console.log(allHalls);


  const renderOverview = () => (
    <div className="space-y-6">
      {/* Hall Filter */}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Hall Overview</h2>
        <select
          value={selectedHall.hallId}
          onChange={(e) => {
            const hallId = parseInt(e.target.value);
            const hall = allHalls.halls.find((h) => h.hallId === hallId);
            if (hall) {
              setSelectedHall(hall);
              handleStatics(hallId);
            }
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {allHalls.halls.map((hall) => (
            <option key={hall.hallId} value={hall.hallId}>
              {hall.hallName}
            </option>
          ))}
        </select>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {/* Students */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Students</h3>
            <Users className="text-indigo-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{statics.totalStudents}</p>
          <p className="text-sm text-gray-600 mt-1">Active residents</p>
        </div>

        {/* Rooms */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Rooms</h3>
            <Home className="text-indigo-600" size={24} />
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-800">
              {statics.occupiedRooms}/{statics.occupiedRooms + statics.availableRooms}
            </p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <p className="text-sm font-medium text-green-600">
                {Math.round((statics.occupiedSeats / statics.totalSeats) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Complaints */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Complaints</h3>
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{statics.pendingComplaints}</p>
          <p className="text-sm text-red-600 mt-1">Pending resolution</p>
        </div>

        {/* Rating */}
        {/* <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Rating</h3>
            <div className="flex">
              {renderStars(statics.review)}
            </div>
          </div>
          <p className="text-xl font-bold text-gray-800 mt-2">Total Review : {statics.totalReview}</p>
        </div> */}
      </div>

      {/* Complaints Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Complaints</h3>
          </div>
          <div className="space-y-4">
            {statics.recentComplaints &&
              statics.recentComplaints.slice(0, 4).map(complaint => (
                <div
                  key={complaint.complaintId}
                  className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      complaint.priority.toLowerCase() === 'high'
                        ? 'bg-red-100'
                        : complaint.priority.toLowerCase() === 'medium'
                        ? 'bg-orange-100'
                        : 'bg-green-100'
                    }`}
                  >
                    <AlertCircle
                      className={
                        complaint.priority.toLowerCase() === 'high'
                          ? 'text-red-600'
                          : complaint.priority.toLowerCase() === 'medium'
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }
                      size={20}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium text-gray-800">{complaint.title}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          complaint.status.toLowerCase() === 'pending'
                            ? 'bg-red-100 text-red-800'
                            : complaint.status.toLowerCase() === 'in-progress'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Location: {complaint.location}</p>
                    <p className="text-xs text-gray-500 mt-1">{complaint.complaintDate}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Complaints Analytics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Complaints Analytics</h3>
          <div className="space-y-4">
            {/* Analytics by Status */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">By Status</span>
                <span className="text-gray-800">
                  Total:{' '}
                  {statics.inProgressComplaints +
                    statics.resolvedComplaints +
                    statics.pendingComplaints}
                </span>
              </div>
              <div className="space-y-2">
                {['pending', 'in-progress', 'resolved'].map(status => {
                  let count = 0;
                  if (status === 'pending') {
                    count = statics.pendingComplaints;
                  } else if (status === 'in-progress') {
                    count = statics.inProgressComplaints;
                  } else if (status === 'resolved') {
                    count = statics.resolvedComplaints;
                  }
                  const totalComplaints =
                    statics.pendingComplaints +
                    statics.inProgressComplaints +
                    statics.resolvedComplaints;
                  const percentage =
                    totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize">{status}</span>
                        <span>
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            status === 'pending'
                              ? 'bg-red-500'
                              : status === 'in-progress'
                              ? 'bg-orange-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Analytics by Category */}
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">By Category</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {statics.complaintsCategory &&
                  Object.keys(statics.complaintsCategory)
                    .reverse()
                    .map(category => {
                      const count = statics.complaintsCategory[category];
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

  return (
    <div className="p-6">
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2> */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {errorMessage}</p>
      ) : (
        renderOverview()
      )}
    </div>
  );
};

export default AdminOverviewPage;
