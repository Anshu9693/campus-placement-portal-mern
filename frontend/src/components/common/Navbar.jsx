import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/react.svg';

export default function Navbar() {
  const authContextValue = useContext(AuthContext);
  const { isAuthenticated, user, logout, loading } = authContextValue || { isAuthenticated: false, user: null, logout: () => {}, loading: true };
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  const getProfileRoute = () => {
    if (!user?.role) return '/login';
    const routeMap = {
      student: '/student/profile',
      recruiter: '/recruiter/dashboard',
      admin: '/admin/dashboard',
    };
    return routeMap[user.role] || '/login';
  };

  return (
    <nav className="w-full bg-[#F8EFE2] shadow-md py-2 px-4 flex items-center justify-between">
      <Link to={isAuthenticated ? getProfileRoute() : "/"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src={"/image.png"} alt="Avani Enterprises Logo" className="h-12 w-12 rounded-full border-2 border-[#B08B5E] bg-[#fff]" />
        <span className="text-2xl font-extrabold tracking-wider text-[#7B4F1D] font-[Montserrat]">AVANI ENTERPRISES</span>
      </Link>
      
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-[#B08B5E] text-white font-bold px-6 py-2 rounded-full shadow-md hover:bg-[#7B4F1D] transition-all font-[Montserrat]"
            >
              <span className="text-xl">👤</span>
              <span className="text-sm">{user?.name || 'Profile'}</span>
            </button>

            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-[#B08B5E] rounded-xl shadow-lg z-50 min-w-[200px]">
                <Link
                  to={getProfileRoute()}
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-3 text-[#7B4F1D] font-semibold hover:bg-[#F8EFE2] border-b border-gray-200 transition-colors"
                >
                  👤 View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 font-semibold hover:bg-red-50 transition-colors rounded-b-xl"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">
              <button className="bg-[#B08B5E] text-white font-bold px-7 py-2 rounded-full shadow-md hover:bg-[#7B4F1D] transition-all text-lg font-[Montserrat]">Login</button>
            </Link>
            <Link to="/register">
              <button className="bg-[#B08B5E] text-white font-bold px-7 py-2 rounded-full shadow-md hover:bg-[#7B4F1D] transition-all text-lg font-[Montserrat]">Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
