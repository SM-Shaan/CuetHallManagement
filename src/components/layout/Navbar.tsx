import React from 'react';
import { MessageSquare, Bell, Home, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for routing
import AuthButtons from '../auth/AuthButtons';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 font-bold text-xl">
            Hall Management
          </Link>
          <div className="hidden md:flex space-x-8">
            <NavItem icon={<Home size={20} />} text="Rooms" route="/rooms" />
            <NavItem icon={<MessageSquare size={20} />} text="Complain" route="/complaints" />
            <NavItem icon={<Bell size={20} />} text="Notices" route="/notices" />
            <NavItem icon={<DollarSign size={20} />} text="Payment" route='#'/>
          </div>
          <div className="hidden md:block">
            <AuthButtons />
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
          <MobileNavItem icon={<Home size={20} />} text="Rooms" route="/rooms" />
          <MobileNavItem icon={<MessageSquare size={20} />} text="Complain" route="/complaints" />
          <MobileNavItem icon={<Bell size={20} />} text="Notices" route="/notices" />
          <MobileNavItem icon={<DollarSign size={20} />} text="Payment" route='#' />
          <div className="pt-4 flex flex-col space-y-2">
            <AuthButtons />
          </div>
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
