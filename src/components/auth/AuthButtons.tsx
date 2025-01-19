import React from 'react';
import { LogIn, UserPlus, LogOut } from 'lucide-react';
import { Link, useHistory } from 'react-router-dom';

const AuthButtons = ({ token, profileImage }: { token: string | null; profileImage: string | null }) => {
  //const history = useHistory();

  const handleLogout = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      fetch('https://localhost:7057/Login/Logout', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          localStorage.removeItem('token');
          //history.push('/login');
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('Error logging out:', error);
        });
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {token ? (
        <>
          {profileImage ? (
            <Link to="/login" title="Profile">
              <img
                src={`data:image/jpeg;base64,${profileImage}`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-4 border-blue-500"
              />
            </Link>
          ) : (
            <Link to="/login" title="Profile">
              <div className="w-10 h-10 rounded-full bg-gray-300 border-4 border-blue-500"></div>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-4 py-2 rounded-lg text-white  hover:bg-red-700 transition-colors duration-200"
            title="Logout"
          >
            <LogOut size={18} />
            <span></span>
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="hover:text-indigo-200 transition-colors duration-200">
            <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200">
              <LogIn size={18} />
              <span>Login</span>
            </button>
          </Link>
          <Link to="/signup" className="hover:text-indigo-200 transition-colors duration-200">
            <button className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-indigo-700 text-white hover:bg-indigo-800 transition-colors duration-200">
              <UserPlus size={18} />
              <span>Sign Up</span>
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;