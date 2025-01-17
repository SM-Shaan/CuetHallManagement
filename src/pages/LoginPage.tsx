import React, { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [imageData, setImageData] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data if needed
    const token = localStorage.getItem('token');
    if (token) {
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
          if (data && data.email) {
            setEmail(data.email);
            setRole(data.role);
            setName(data.name);
            setDepartment(data.department);
            setImageData(data.imageData);
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
  }, []);

  const handleLogin = () => {
    if (email.length === 0 || password.length === 0) {
      alert('Empty Input Field Found.');
      return;
    }

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
            alert(data.message);
            // Store the token in local storage
            localStorage.setItem('token', data.token);
            setIsLoggedIn(true);
          } else {
            alert(data.message || 'Login failed.');
            return;
          }
        })
      )
      .catch((error) => {
        console.error('Error:', error);
        alert(`Login failed: ${error.message}`);
      });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
        {isLoggedIn ? (
          <div>
            <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">User Details</h1>
            {imageData && (
              <img
                src={`data:image/jpeg;base64,${imageData}`}
                alt="User"
                className="mx-auto mt-4 rounded-full w-40 h-40 object-cover"
                onError={(e) => {
                  console.error('Error loading image:', e);
                  e.currentTarget.src = 'default-image-path'; // Fallback image
                }}
              />
            )}
            <p className="text-center text-lg">Name: {name}</p>
            <p className="text-center text-lg">Email: {email}</p>
            <p className="text-center text-lg">Department: {department}</p>
            <p className="text-center text-lg">Role: {role}</p>
            
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default LoginPage;