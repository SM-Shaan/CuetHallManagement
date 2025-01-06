import { LogIn, UserPlus } from 'lucide-react';

const AuthButtons = () => {
  return (
    <div className="flex items-center space-x-4">
      <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200">
        <LogIn size={18} />
        <span>Login</span>
      </button>
      <button className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-indigo-700 text-white hover:bg-indigo-800 transition-colors duration-200">
        <UserPlus size={18} />
        <span>Sign Up</span>
      </button>
    </div>
  );
};

export default AuthButtons;