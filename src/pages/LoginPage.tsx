import React, { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import {jwtDecode} from 'jwt-decode';

type StudentDetails=
{
  email: string;
  role: string;
  name: string;
  department: string;
  imageData: string;
  roomNo: string;
  hallName: string;
}

type HallDetails=
{
  hallId: number;
  hallName: string;
  institution: string;
  totalSeats: number;
  hallType: string;
  imageData: string;
  occupiedSeats: number;
  availableSeats: number;
  established: string;
}

const LoginPage = () => {
  const[hallDetails,setHallDetails]=useState<HallDetails>({hallId:0,hallName:'',institution:'',totalSeats:0,hallType:'',imageData:'',occupiedSeats:0,availableSeats:0,established:''});
  const [StudentDetails, setStudentDetails] = useState<StudentDetails>({ email: '', role: '', name: '', department: '', imageData: '', roomNo: '', hallName: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // New state for login process
  const [token, setToken] = useState<string | null>(null);
  const [checkRole, setCheckRole] = useState<string | null>(null);

  
  useEffect(() => {
    // Fetch initial data if needed
    const token = localStorage.getItem('token');
    setToken(token);
    if (token) {

      const decodedToken: any = jwtDecode(token);
      setCheckRole(decodedToken.role);
      console.log(checkRole);

      fetch('https://localhost:7057/Profile/GetUserData', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data &&  checkRole==='Student') {
            setStudentDetails(data);
            setIsLoggedIn(true);
          }
          else if(data && checkRole==='HallAdmin')
          {
            setHallDetails(data);
            setIsLoggedIn(true);
          }
        })
        .catch((error) => {
          console.error(`Error fetching user data: ${error.message}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [checkRole]);

  const handleLogin = () => {
    if (email.length === 0 || password.length === 0) {
      alert('Empty Input Field Found.');
      return;
    }

    setIsLoggingIn(true); // Set login process state to true

    const payload = {
      email,
      password,
      role,
    };

    fetch('https://localhost:7057/Login/Login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) =>
        response.json().then((data) => {
          if (response.ok) {
            // Store the token in local storage
            localStorage.setItem('token', data.token);
            setIsLoggedIn(true);
            window.location.href = '/'; // Redirect to home page
          } else {
            alert(data.message || 'Login failed.');
            setIsLoggingIn(false); // Reset login process state
          }
        })
      )
      .catch((error) => {
        console.error('Error:', error);
        alert(`Login failed: ${error.message}`);
        setIsLoggingIn(false); // Reset login process state
      });
  };

  if (isLoading || isLoggingIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Loading...</h1>
        </div>
      </div>
    );
  }
  
   if(!checkRole)
   {
    return (

        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
        <>
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Login</h1>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
                <Mail className="ml-2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 block w-full p-2 border-none focus:ring-0"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
                <Lock className="ml-2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1 block w-full p-2 border-none focus:ring-0"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Student">Student</option>
                <option value="HallAdmin">HallAdmin</option>
                <option value="DSW">DSW</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <a href="/signup" className="text-indigo-600 hover:underline">Sign Up</a>
          </p>
        </>
      </div>
    </div>
    );

   };


  if(checkRole === 'Student'){
    return (
      (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 w-full max-w-2xl bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">User Profile</h1>
          {StudentDetails.imageData && (
            <img
              src={`data:image/jpeg;base64,${StudentDetails.imageData}`}
              alt="User"
              className="mx-auto mt-4 rounded-full w-40 h-40 object-cover shadow-md border border-gray-300"
              onError={(e) => {
                console.error('Error loading image:', e);
                e.currentTarget.src = 'default-image-path'; // Fallback image
              }}
            />
          )}
          <div className="mt-8 space-y-6">
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-sm font-semibold text-gray-600">Name</p>
              <p className="text-lg font-bold text-gray-800">{StudentDetails.name}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-sm font-semibold text-gray-600">Email</p>
              <p className="text-lg font-bold text-gray-800">{StudentDetails.email}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-sm font-semibold text-gray-600">Department</p>
              <p className="text-lg font-bold text-gray-800">{StudentDetails.department}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-sm font-semibold text-gray-600">Room No</p>
              <p className="text-lg font-bold text-gray-800">{StudentDetails.roomNo}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-sm font-semibold text-gray-600">Hall Name</p>
              <p className="text-lg font-bold text-gray-800">{StudentDetails.hallName}</p>
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => {
                localStorage.removeItem('token'); // Remove token
                setIsLoggedIn(false); // Log out
                window.location.href = '/login'; // Redirect to login page
              }}
              className="py-2 px-4 bg-red-500 text-white font-bold rounded-lg shadow-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
            <button
              onClick={() => alert('Edit Profile functionality is under development.')}
              className="py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-sm hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      </div>
      </div>
        )
    );
  }

  if(checkRole==="HallAdmin")
  {
    return(
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 w-full max-w-2xl bg-white shadow-lg rounded-lg">
              <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Your Hall</h1>
              {hallDetails.imageData && (
                <img
                  src={`data:image/jpeg;base64,${hallDetails.imageData}`}
                  alt="Hall"
                  className="mx-auto mt-4 rounded-full w-40 h-40 object-cover shadow-md border border-gray-300"
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    e.currentTarget.src = 'default-image-path'; // Fallback image
                  }}
                />
              )}
              <div className="mt-8 space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-gray-600">Hall Name</p>
                  <p className="text-lg font-bold text-gray-800">{hallDetails.hallName}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-gray-600">Institution</p>
                  <p className="text-lg font-bold text-gray-800">{hallDetails.institution}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-gray-600">Eshtablished</p>
                  <p className="text-lg font-bold text-gray-800">{hallDetails.established}</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-gray-600">Total Seats</p>
                  <p className="text-lg font-bold text-gray-800">{hallDetails.totalSeats}</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-gray-600">Hall Type</p>
                  <p className="text-lg font-bold text-gray-800">{hallDetails.hallType}</p>
                </div>
              </div>
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => {
                    localStorage.removeItem('token'); // Remove token
                    setIsLoggedIn(false); // Log out
                    window.location.href = '/login'; // Redirect to login page
                  }}
                  className="py-2 px-4 bg-red-500 text-white font-bold rounded-lg shadow-sm hover:bg-red-600 transition"
                >
                  Logout
                </button>
                <button
                  onClick={() => alert('Edit Hall functionality is under development.')}
                  className="py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-sm hover:bg-blue-600 transition"
                >
                  Edit Hall
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }




};

export default LoginPage;