import React, { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import Modal, { Styles } from 'react-modal';
import { DOMAIN } from '../constants/domain';

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
type StudentDetails =
  {
    email: string;
    role: string;
    name: string;
    department: string;
    imageData: string;
    roomNo: string;
    hallName: string;
  }

type HallDetails =
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
  const [hallDetails, setHallDetails] = useState<HallDetails>({ hallId: 0, hallName: '', institution: '', totalSeats: 0, hallType: '', imageData: '', occupiedSeats: 0, availableSeats: 0, established: '' });
  const [StudentDetails, setStudentDetails] = useState<StudentDetails>({ email: '', role: '', name: '', department: '', imageData: '', roomNo: '', hallName: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // New state for login process
  const [token, setToken] = useState<string | null>(null);
  const [checkRole, setCheckRole] = useState<string | null>(null);
  const [isEditHallModalOpen, setIsEditHallModalOpen] = useState(false);
  const [hallData, setHallData] = useState({
    hallName: hallDetails.hallName,
    imageData: hallDetails.imageData,

    hallType: hallDetails.hallType,
  });
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  //const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };
  
  // const handlePasswordChangeSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (newPassword !== confirmNewPassword) {
  //     alert('New password and confirm password do not match');
  //     return;
  //   }

  const handleEditHall = () => {
    hallData.hallName = hallDetails.hallName;
    //hallData.imageData = hallDetails.imageData;
    // hallData.totalSeats = hallDetails.totalSeats;
    hallData.hallType = hallDetails.hallType;

    setIsEditHallModalOpen(true);
  };


  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm password do not match');
      return;
    }


    fetch(`${DOMAIN}/Profile/ChengePassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ password, newPassword }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          alert(`Error: ${errorMessage}`);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Password changed successfully:', data);
        alert('Password changed successfully');
        setIsChangePasswordModalOpen(false);
        window.location.href = '/login'; // Redirect to login page
        // Optionally, handle additional logic after password change
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };





  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Hall data submitted:', hallData);
    const Token = localStorage.getItem('token');
    fetch(`${DOMAIN}/HallDetailsManagement/EditHall`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify(hallData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Hall data updated:', data);
        alert('Hall data updated successfully');
        setHallDetails(data);
        setIsEditHallModalOpen(false);
      })
      .catch((error) => {
        console.error(`Error updating hall data: ${error.message}`);
      });

    setIsEditHallModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'imageData' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHallData((prevData) => ({
          ...prevData,
          imageData: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setHallData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    // Fetch initial data if needed
    const token = localStorage.getItem('token');
    
    setToken(token);
    if (token) {
      const decodedToken: any = jwtDecode(token);
      setCheckRole(decodedToken.role);
      console.log(checkRole);
      

      fetch(`${DOMAIN}/Profile/GetUserData`, {
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
          if (data && checkRole === 'Student') {
            setStudentDetails(data);
            setIsLoggedIn(true);
          }
          else if (data && checkRole === 'HallAdmin') {
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

    fetch(`${DOMAIN}/Login/Login`, {
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

  if (!checkRole) {
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


  if (checkRole === 'Student') {
    return (
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
                  onClick={handleChangePassword}
                  className="py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-sm hover:bg-blue-600 transition"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
  
          {/* Change Password Modal */}
          <Modal
            isOpen={isChangePasswordModalOpen}
            onRequestClose={() => setIsChangePasswordModalOpen(false)}
            contentLabel="Change Password Modal"
            style={modalStyles}
            ariaHideApp={false}
          >
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChangeSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">Current Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmNewPassword" className="block text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
                <button type="button" onClick={() => setIsChangePasswordModalOpen(false)} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    );
  }

  if (checkRole === "HallAdmin") {
    return (
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
                  onClick={handleEditHall}
                  className="py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-sm hover:bg-blue-600 transition"
                >
                  Edit Hall
                </button>
              </div>
            </div>
          </div>
          <Modal
            isOpen={isEditHallModalOpen}
            onRequestClose={() => setIsEditHallModalOpen(false)}
            contentLabel="Edit Hall Modal"
            style={modalStyles}
            ariaHideApp={false}
          >
            <h2 className="text-xl font-semibold mb-4">Edit Hall Data</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label htmlFor="hallName" className="block text-gray-700">Hall Name</label>
                <input
                  type="text"
                  id="hallName"
                  name="hallName"
                  value={hallData.hallName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="imageData" className="block text-gray-700">Image Data</label>
                <input
                  type="file"
                  id="imageData"
                  name="imageData"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="hallType" className="block text-gray-700">Hall Type</label>
                <input
                  type="text"
                  id="hallType"
                  name="hallType"
                  value={hallData.hallType}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
                <button type="button" onClick={() => setIsEditHallModalOpen(false)} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
              </div>
            </form>
          </Modal>




          <Modal
  isOpen={isChangePasswordModalOpen}
  onRequestClose={() => setIsChangePasswordModalOpen(false)}
  contentLabel="Change Password Modal"
  style={modalStyles}
  ariaHideApp={false}
>
  <h2 className="text-xl font-semibold mb-4">Change Password</h2>
  <form onSubmit={handlePasswordChangeSubmit}>
    <div className="mb-4">
      <label htmlFor="password" className="block text-gray-700">Current Password</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
      <input
        type="password"
        id="newPassword"
        name="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="confirmNewPassword" className="block text-gray-700">Confirm New Password</label>
      <input
        type="password"
        id="confirmNewPassword"
        name="confirmNewPassword"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="flex justify-end space-x-2">
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      <button type="button" onClick={() => setIsChangePasswordModalOpen(false)} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
    </div>
  </form>
</Modal>
        </div>
      </div>
    );
  }




};

export default LoginPage;