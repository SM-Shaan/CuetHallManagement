import React, { useState, useEffect } from 'react';
import { Plus, Building, X, Wrench } from 'lucide-react';

type HallInfo = {
  hallId: number;
  hallName: string;
  totalSeats: number;
  occupiedSeats: number;
  availableSeats: number;
  hallType: string;
  imageData: string;
};

type HallsToAdd = {
  hallName: string;
  hallType: string;
  imageData: string;
  established: string; // Use string to store date in ISO format
};

type AllHalls = {
  hallsToShow: HallInfo[];
};



const HallManagement: React.FC = () => {
  // State for list of halls and modal open/close
  const [halls, setHalls] = useState<HallsToAdd[]>([]);
  const [allHalls, setAllHalls] = useState<AllHalls>({ hallsToShow: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  // State for the new hall form
  const [newHall, setNewHall] = useState<HallsToAdd>({
    hallName: '',
    hallType: 'male',
    imageData: '',
    established: '', // Initialize with empty string
  });

  // State for the hall assignment form
  const [assignmentForm, setAssignmentForm] = useState({
    hallId: 0,
    hallName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Fetch halls from the backend on component mount.
  // This is useful for populating the select field in the assignment modal.
  useEffect(() => {
    const Token = localStorage.getItem('token');

    fetch('https://localhost:7057/HallManagement/GetHalls', {
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
      .then((data: AllHalls) => {
        console.log(data);
        setAllHalls(data);
        return;
      })
      .catch((error) => {
        console.error('Error fetching halls:', error);
      });
  }, []);
  console.log("Halls", allHalls.hallsToShow);

  // Open/close modal handlers for New Hall
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset the new hall form
    setNewHall({
      hallName: '',
      hallType: 'male',
      imageData: '',
      established: '', // Initialize with empty string
    });
  };

  // Open/close modal handlers for Hall Assignment
  const handleOpenAssignmentModal = () => setIsAssignmentModalOpen(true);
  const handleCloseAssignmentModal = () => {
    setIsAssignmentModalOpen(false);
    // Reset the assignment form
    setAssignmentForm({
      hallId: 0,
      hallName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  // Handle text and number inputs for New Hall
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    const files = (e.target as HTMLInputElement).files;

    if (name === 'imageData' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewHall((prev) => ({
          ...prev,
          imageData: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else if (name === 'established') {
      // Store the date as an ISO string
      setNewHall((prev) => ({
        ...prev,
        established: new Date(value).toISOString(), // Store as ISO string
      }));
    } else {
      setNewHall((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle image file input for New Hall by converting the image to a base64 string
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewHall((prev) => ({
          ...prev,
          imageData: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit handler for the new hall form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const Token = localStorage.getItem('token');

    // Prepare payload for backend
    const payload = {
      hallName: newHall.hallName,
      hallType: newHall.hallType,
      imageData: newHall.imageData,
      //established: newHall.established, // Already in ISO string format
    };
    console.log(payload);
    // Send the payload to your backend.
    fetch('https://localhost:7057/HallManagement/AddHall', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify(payload),
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
      .then((data: AllHalls) => {
        console.log(data);
        setAllHalls(data);
        alert('Hall added successfully!');
        handleCloseModal(); // Close the modal after successful submission
      })
      .catch((error) => {
        console.error('Error adding hall:', error);
      });
  };

  // Handle input changes for the hall assignment form
  const handleAssignmentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssignmentForm((prev) => ({
      ...prev,
      [name]: name === 'hallId' ? parseInt(value) : value,
    }));
  };

  // Submit handler for the hall assignment form
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate password and confirm password match
    if (assignmentForm.password !== assignmentForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Prepare payload for backend
    const payload = {
      hallId: assignmentForm.hallId,
      email: assignmentForm.email,
      password: assignmentForm.password,
      confirmPassword: assignmentForm.confirmPassword,
    };
    console.log(payload);
    const Token=localStorage.getItem('token');
  
    // Send the payload to your backend.
    fetch('https://localhost:7057/Registration/AddAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify(payload),
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
      .then((data) => {
        console.log(data);
        alert('Hall assigned successfully!');
        handleCloseAssignmentModal(); 
        return;// Close the modal after successful submission
      })
      .catch((error) => {
        console.error('Error assigning hall:', error);
      });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Hall Management</h2>
        <div className="flex gap-3">
          {/* Button for Hall Assignment */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={handleOpenAssignmentModal}
          >
            <Wrench size={20} />
            Hall Assignment
          </button>
          {/* New Hall Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={handleOpenModal}
          >
            <Plus size={20} />
            New Hall
          </button>
        </div>
      </div>

      {/* Hall Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allHalls.hallsToShow.map((hall, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center gap-4">
              {hall.imageData ? (
                <img
                  src={`data:image/jpeg;base64,${hall.imageData}`}
                  alt={hall.hallName}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-lg">
                  <Building size={24} className="text-gray-500" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {hall.hallName}
                </h3>
                <p className="text-sm text-gray-600">
                  {hall.hallType === 'Male' ? 'Male Hall' : 'Female Hall'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Total Seats:{' '}
                <span className="font-medium text-gray-800">
                  {hall.totalSeats}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Occupied Seats:{' '}
                <span className="font-medium text-gray-800">
                  {hall.occupiedSeats}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Available Seats:{' '}
                <span className="font-medium text-gray-800">
                  {hall.availableSeats}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding New Hall */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleCloseModal}
          />
          <div className="bg-white rounded-xl shadow-lg p-6 relative z-10 w-full max-w-lg">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={handleCloseModal}
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Add New Hall
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hall Name
                </label>
                <input
                  type="text"
                  name="hallName"
                  value={newHall.hallName}
                  onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  Established
                </label>
                <input
                  type="date"
                  name="established"
                  value={newHall.established ? new Date(newHall.established).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div> */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hall Type
                  </label>
                  <select
                    name="hallType"
                    value={newHall.hallType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hall Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus size={20} />
                  Add Hall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Hall Assignment */}
      {isAssignmentModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    {/* Modal Overlay */}
    <div
      className="absolute inset-0 bg-black opacity-50"
      onClick={handleCloseAssignmentModal}
    />
    <div className="bg-white rounded-xl shadow-lg p-6 relative z-10 w-full max-w-lg">
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        onClick={handleCloseAssignmentModal}
      >
        <X size={24} />
      </button>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Hall Assignment
      </h3>
      <form onSubmit={handleAssignmentSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Hall
          </label>
          <select
            name="hallId"
            value={assignmentForm.hallId}
            onChange={handleAssignmentInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">-- Select a Hall --</option>
            {allHalls.hallsToShow.map((hall, idx) => (
              <option key={idx} value={hall.hallId}>
                {hall.hallName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={assignmentForm.email}
            onChange={handleAssignmentInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={assignmentForm.password}
            onChange={handleAssignmentInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={assignmentForm.confirmPassword}
            onChange={handleAssignmentInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Wrench size={20} />
            Assign Hall
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default HallManagement;