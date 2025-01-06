import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement login logic here
    alert('Login functionality is not implemented yet.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
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
          <div className="mb-6">
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
      </div>
    </div>
  );
};

export default LoginPage; 