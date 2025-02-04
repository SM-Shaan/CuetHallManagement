import React, { useState, useEffect } from 'react';
import { Filter, Search, AlertCircle, MessageCircle, Paperclip, Camera, Calendar } from 'lucide-react';

type comment = {
  commentText: string,
  complaintId: number,
  commentedAt: string
  commentedBy: string
}


type Complaints = {
  complaintId: number,
  title: string,
  catagory: string,
  priority: string,
  status: string,
  description: string,
  location: string,
  imageData: string,
  fileData: string,
  complaintDate: string,
  comments: comment[]
}



const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaints[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | Complaints['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newComplaint, setNewComplaint] = useState('');
  const [priority, setPriority] = useState<Complaints['priority']>('Medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fileData, setFileData] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [formCategory, setFormCategory] = useState('all');
  const [visibleComments, setVisibleComments] = useState<{ [key: number]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    fetch(`https://localhost:7057/Complaint/GetComplaints?pageNumber=${pageNumber}&pageSize=5`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 401) {
            window.location.href = '/login';
            alert(`Unauthorized: ${errorMessage}`);
            return;
          }
          if (response.status === 400) {
            window.location.href = '/';
            alert(`${errorMessage}`);
            setIsLoading(false);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (!data) {
          throw new Error('No data available');
        }
        setComplaints((prevComplaints) => {
          const newComplaints = data.filter(
            (newComplaint: Complaints) => !prevComplaints.some(
              (prevComplaint) => prevComplaint.complaintId === newComplaint.complaintId
            )
          );
          return [...prevComplaints, ...newComplaints];
        });
        setHasMore(data.length > 0);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching complaints data:', error);
        setIsLoading(false);
      });
  }, [pageNumber]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading || !hasMore) {
        return;
      }
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);
  const categories = [
    'Plumbing',
    'Electrical',
    'Furniture',
    'Cleaning',
    'Security',
    'Internet',
    'Others'
  ];

  // Filter and search logic
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || complaint.catagory === selectedCategory;
    return matchesStatus && matchesSearch && matchesCategory;
  });

  const handleSubmitComplaint = () => {
    if (!newComplaint.trim() || !location.trim() || !description.trim() || formCategory === 'all') {
      alert('Please fill in all required fields and select a category');
      return;
    }

    const token = localStorage.getItem('token');
    const complaintData = {
      title: newComplaint,
      catagory: formCategory,
      priority,
      location,
      description,
      fileData,
      imageData,
    };

    fetch('https://localhost:7057/Complaint/AddComplaint', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(complaintData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 401) {
            window.location.href = '/login';
            alert(`Unauthorized: Please Login First`);
            return;
          }
          if (response.status === 400) {
            alert(`${errorMessage}`);
            resetForm();
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Complaints) => {
        if(data)
        {
          alert('Complaint submitted successfully!');
          setComplaints(complaints=>[data,...complaints]);
          resetForm();
          return;
        }
        //return;
      })
      .catch((error) => {
        console.error('Error submitting complaint:', error);
      });
  };

  const resetForm = () => {
    setNewComplaint('');
    setPriority('Medium');
    setFormCategory('all');
    setLocation('');
    setDescription('');
    setFileData(null);
    setImageData(null);
  };

  const handleAddComment = (complaintId: number) => {
    const newComment = commentInputs[complaintId];
    if (!newComment?.trim()) return;
  
    const token = localStorage.getItem('token');
    const commentData = {
      complaintId,
      commentText: newComment,
    };
  
    fetch(`https://localhost:7057/Complaint/AddComment/${complaintId}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 401) {
            window.location.href = '/login';
            alert(`Unauthorized: Please Login First`);
            return;
          }
          if (response.status === 400) {
            alert(`${errorMessage}`);
            return;
          }
          throw new Error('Network response was not ok');
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then((data) => {
        if(data)
        {
        const updatedComplaints = complaints.map(complaint => {
          if (complaint.complaintId === complaintId) {
            return {
              ...complaint,
              comments: [...complaint.comments, data],
            };
          }
          return complaint;
        });
        setComplaints(updatedComplaints);
        setCommentInputs(prevState => ({
          ...prevState,
          [complaintId]: ''
        }));
  }})
      
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  const toggleCommentsVisibility = (complaintId: number) => {
    setVisibleComments(prevState => ({
      ...prevState,
      [complaintId]: !prevState[complaintId]
    }));
  };

  const openImageModal = (imageData: string) => {
    setSelectedImage(imageData);
    setIsImageModalOpen(true);
  };
  const closeImageModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  const getStatusColor = (status: Complaints['status']): string => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getPriorityBadge = (priority: Complaints['priority']): string => {
    const colors: Record<Complaints['priority'], string> = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };
    return colors[priority];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">Complaint Management</h1>
        
       

        {/* Submission Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Submit a New Complaint</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={newComplaint}
              onChange={(e) => setNewComplaint(e.target.value)}
              placeholder="Complaint Title"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Complaints['priority'])}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g., Block A, Room 101)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the complaint..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />
            <div className="flex gap-4">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <Paperclip size={20} />
                Attach File
              </label>
              {fileData && (
                <div className="text-sm text-gray-600 mt-2">
                  File attached: {fileData.substring(fileData.indexOf(',') + 1, fileData.indexOf(',') + 20)}...
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageInput"
              />
              <label htmlFor="imageInput" className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <Camera size={20} />
                Add Photo
              </label>
              {imageData && (
                <div className="mt-2">
                  <img src={imageData} alt="Selected" className="h-20 w-20 object-cover rounded-lg" />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleSubmitComplaint}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Submit Complaint
              </button>
            </div>
          </div>
        </div>
         {/* Search and Filter Bar */}
         <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | Complaints['status'])}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.complaintId}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{complaint.title}</h3>
                  <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {complaint.complaintDate}
                    </span>
                    {complaint.location && (
                      <span className="flex items-center gap-1">
                        • Location: {complaint.location}
                      </span>
                    )}
                    {complaint.catagory && (
                      <span className="flex items-center gap-1">
                        • Category: {complaint.catagory}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getPriorityBadge(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
              
              {complaint.description && (
                <p className="text-gray-600 mb-4">{complaint.description}</p>
              )}
             {complaint.imageData && (
  <div className="mt-2">
    <img
      src={`data:image/jpeg;base64,${complaint.imageData}`}
      alt="Complaint"
      className="h-40 w-40 object-cover rounded-lg cursor-pointer"
      onClick={() => openImageModal(complaint.imageData)}
    />
  </div>
)}

{complaint.fileData && (
  <div className="mt-2 flex items-center gap-4">
    <a
      href={URL.createObjectURL(new Blob([Uint8Array.from(atob(complaint.fileData), c => c.charCodeAt(0))], { type: 'application/pdf' }))}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 hover:underline flex items-center gap-2"
    >
      <span>View Attached PDF</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" />
      </svg>
    </a>
    <a
      href={URL.createObjectURL(new Blob([Uint8Array.from(atob(complaint.fileData), c => c.charCodeAt(0))], { type: 'application/pdf' }))}
      download={`${complaint.title}.pdf`}
      className="text-indigo-600 hover:underline flex items-center gap-2"
    >
      <span>Download PDF</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" />
      </svg>
    </a>
  </div>
)}
              {/* Comments Section */}
              <div className="mt-4 pt-4 border-t">
              <button
                  onClick={() => toggleCommentsVisibility(complaint.complaintId)}
                  className="text-indigo-600 hover:underline"
              >
              {complaint.comments && visibleComments[complaint.complaintId] ? 'Hide Comments' : `Show Comments ${complaint.comments ? complaint.comments.length : 0}`}
              </button>
              {visibleComments[complaint.complaintId] && (
                <div className="space-y-2 mt-2">
                  <h4 className="font-semibold mb-2">Comments</h4>
      {complaint.comments?.map((comment, index) => (
        <div key={index} className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm">{comment.commentText}</p>
          <div className="text-xs text-gray-500 mt-1">
            At {comment.commentedAt} by {comment.commentedBy}
          </div>
        </div>
      ))}
    </div>
  )}
  <div className="mt-3 flex gap-2">
  <input
  type="text"
  value={commentInputs[complaint.complaintId] || ''}
  onChange={(e) => setCommentInputs({
    ...commentInputs,
    [complaint.complaintId]: e.target.value
  })}
  placeholder="Add a comment..."
  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"

/>
    <button
      onClick={() => handleAddComment(complaint.complaintId)}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
    >
      Comment
    </button>
  </div>
</div>
            </div>
          ))}
        </div>
        {isImageModalOpen && selectedImage && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full">
      <button
        className="absolute top-1 right-1 text-gray-600 hover:text-gray-800"
        onClick={closeImageModal}
      >
        &times;
      </button>
      <img
        src={`data:image/jpeg;base64,${selectedImage}`}
        alt="Complaint"
        className="max-h-[80vh] w-full object-cover rounded-lg"
      />
    </div>
  </div>
)}
{isLoading && <p className="text-center mt-4">Loading...</p>}
{!hasMore && <p className="text-center mt-4">No more complaints to load</p>}
      </div>
    </div>
  );
};

export default ComplaintsPage;