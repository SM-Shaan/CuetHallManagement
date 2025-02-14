import React, { useState, useEffect } from 'react';
import { MessageSquare, Bell, Home, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for routing
import AuthButtons from '../auth/AuthButtons';
import DashboardIcon from '../icons/DashboardIcon';
import {jwtDecode} from 'jwt-decode';

const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // const storedToken = localStorage.getItem('token');
  // setToken(storedToken);
  

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    console.log('Stored token:', storedToken);


    if (storedToken) {
      const decodedToken: any = jwtDecode(storedToken);
      setRole(decodedToken.role);
      console.log('Role:', decodedToken.role);
      fetch('https://localhost:7057/HomePage/GetHomePageData', {
        method: 'GET',
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
        .then((data) => {
          if (data && data.imageData) {
            setProfileImage(data.imageData);
            //console.log('Profile image data:', data.imageData);
          }
        })
        .catch((error) => {
          localStorage.removeItem('token');
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 font-bold text-xl">
            Hall Management
          </Link>
          <div className="hidden md:flex space-x-8">
           {role === 'HallAdmin' ? <NavItem icon={<DashboardIcon size={20} />} text="Dashboard" route="/manager" /> : null}
           
            {/* <NavItem icon={<DashboardIcon size={20} />} text="Dashboard" route="/manager" /> */}
            
            {role==="DSW" ? <NavItem icon={<Users size={20} />} text="Halls" route="/adminOverview" /> : <NavItem
              icon={<Home size={20} />}
              text="Rooms"
              route={role === "HallAdmin" ? "/room-management" : "/rooms"}
            />}


            
            
            {role === 'HallAdmin' ? (
              <NavItem icon={<Users size={20} />} text="Student" route="/student-management" />
            ): (role === 'DSW' ? (
              <NavItem icon={<Users size={20} />} text="Student" route="/adminStudents" />
            ):null)}
            {/* <NavItem icon={<Home size={20} />} text="Rooms" route="/rooms" /> */}
            {/* <NavItem icon={<MessageSquare size={20} />} text="Complain" route="/complaints" />
            <NavItem icon={<Bell size={20} />} text="Notices" route="/notices" /> */}
            {role !== "DSW" && (
  <>
    <NavItem
      icon={<MessageSquare size={20} />}
      text="Complaints"
      route={role === "HallAdmin" ? "/complaint-management" : "/complaints"}
    />
    <NavItem
      icon={<Bell size={20} />}
      text="Notices"
      route={role === "HallAdmin" ? "/notice-management" : "/notices"}
    />
    <NavItem
      icon={<DollarSign size={20} />}
      text="Payments"
      route={role === "HallAdmin" ? "/payment-management" : "/payment"}
    />
  </>
)}
{role === "DSW" && (
  <>
    <NavItem
      icon={<MessageSquare size={20} />}
      text="Manage Halls"
      route="/addHall"
    />
  </>
)}
          </div>
        



        <div className="hidden md:block">
          <AuthButtons token={token} profileImage={profileImage} />
        </div>
        
          
          <button className="md:hidden p-2 rounded-md hover:bg-indigo-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* <MobileNavItem icon={<Home size={20} />} text="Rooms" route="/rooms" /> */}
          <MobileNavItem
            icon={<Home size={20} />}
            text="Rooms"
            route={role === "HallAdmin" ? "/room-management" : "/rooms"}
          />
          {/* <MobileNavItem icon={<MessageSquare size={20} />} text="Complain" route="/complaints" />
          <MobileNavItem icon={<Bell size={20} />} text="Notices" route="/notices" /> */}
          <MobileNavItem
            icon={<MessageSquare size={20} />}
            text="Complain"
            route={role === "HallAdmin" ? "/complaint-management" : "/complaints"}
          />
          <MobileNavItem
            icon={<Bell size={20} />}
            text="Notices"
            route={role === "HallAdmin" ? "/notice-management" : "/notices"}
          />
          <MobileNavItem icon={<DollarSign size={20} />} text="Payment" route='#' />
          {
            profileImage ? (
              <div className="pt-4 flex flex-col space-y-4 ml-20">
              <AuthButtons token={token} profileImage={profileImage} />
            </div>
           ) : null
          }
        </div>
             
          
      </div>
    </nav>
  );
};

const NavItem = ({ icon, text, route }: { icon: React.ReactNode; text: string; route: string }) => (
  <Link
    to={route}
    className="flex items-center space-x-1 hover:text-indigo-200 transition-colors duration-200"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

const MobileNavItem = ({ icon, text, route }: { icon: React.ReactNode; text: string; route: string }) => (
  <Link
    to={route}
    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 hover:text-white transition-colors duration-200"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;