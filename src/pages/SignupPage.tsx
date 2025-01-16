import React, { useState } from 'react';

const SignupPage = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationPopupVisible, setIsVerificationPopupVisible] = useState(false);
  const [signupMessage, setSignupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = () => {
    if (id === '' || name === '' || email === '' || department === '' || image === null || password === '' || confirmPassword === '') {
      alert('Empty Input is found.');
      return;
    }

    if (password.length < 8) {
      alert('Password should be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (name.length < 3) {
      alert('Name should be at least 3 characters.');
      return;
    }

    const payload = {
      id,
      name,
      email,
      department,
      imageData: image, // Base64 string
      password,
      confirmPassword,
    };

    setIsLoading(true);

    fetch('https://localhost:7057/Registration/Registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json().then((data) => {
        if (!response.ok) {
          throw new Error(data.message || 'Signup failed.');
        }
        return data;
      }))
      .then((data) => {
        setSignupMessage(data.message);
        setIsVerificationPopupVisible(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`Signup failed: ${error.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVerification = () => {
    const payload = {
      id,
      name,
      email,
      department,
      imageData: image, // Base64 string
      password,
      confirmPassword,
      verificationCode
    };

    fetch('https://localhost:7057/Registration/Verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json().then((data) => {
        if (!response.ok) {
          setIsVerificationPopupVisible(false);
          throw new Error(data.message || 'Verification failed.');
        }
        return data;
      }))
      .then((data) => {
        alert(data.message);
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`Verification failed: ${error.message}`);
        setSignupMessage('');
        setIsVerificationPopupVisible(false);
        setSignupMessage('');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Sign Up</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Id</label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="block w-full p-2 border-none focus:ring-0"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full p-2 border-none focus:ring-0"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-2 border-none focus:ring-0"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="block w-full p-2 border-none focus:ring-0"
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="URP">URP</option>
                <option value="ETE">ETE</option>
                <option value="BME">BME</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full p-2 border-none focus:ring-0"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full p-2 border-none focus:ring-0"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full p-2 border-none focus:ring-0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLoading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
      </div>

      {isVerificationPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{signupMessage}</h2>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="block w-full p-2 mb-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleVerification}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Verify
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;