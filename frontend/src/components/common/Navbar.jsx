import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
  const authContextValue = useContext(AuthContext);
  const { isAuthenticated, user, logout } = authContextValue || {
    isAuthenticated: false,
    user: null,
    logout: () => {},
  };
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const getDashboardRoute = () => {
    if (!isAuthenticated || !user?.role) return '/';
    const routeMap = {
      student: '/student/dashboard',
      recruiter: '/recruiter/dashboard',
      admin: '/admin/dashboard',
    };
    return routeMap[user.role] || '/';
  };

  const getProfileRoute = () => {
    if (user?.role === 'student') return '/student/profile';
    return getDashboardRoute();
  };

  return (
    <nav className="w-full bg-[#F8EFE2] shadow-md sticky top-0 z-[100] font-[Montserrat]">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        
        {/* BRAND LOGO & TEXT */}
        <Link
          to={getDashboardRoute()}
          onClick={() => {
            setShowMobileMenu(false);
            setShowDropdown(false);
          }}
          className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-all shrink-0"
        >
          <img
            src="/image.png"
            alt="Avani Enterprises Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-[#B08B5E] bg-white shadow-sm"
          />
          <span className="text-lg sm:text-2xl font-black tracking-tight text-[#7B4F1D]">
            AVANI ENTERPRISES
          </span>
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-1.5 text-[#7B4F1D] hover:bg-[#EADCC8] rounded-lg transition-colors"
        >
          {showMobileMenu ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 bg-[#B08B5E] text-white font-bold px-5 py-2.5 rounded-full shadow-md hover:bg-[#7B4F1D] transition-all"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="max-w-[150px] truncate">{user?.name || 'Account'}</span>
                <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-[#EADCC8] rounded-xl shadow-xl z-[110] min-w-[180px] overflow-hidden">
                  <Link
                    to={getProfileRoute()}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[#7B4F1D] font-semibold hover:bg-[#F8EFE2] transition-colors border-b border-gray-100"
                  >
                    👤 My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold hover:bg-red-50 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login">
                <button className="text-[#7B4F1D] font-bold px-5 py-2.5 rounded-full hover:bg-[#EADCC8] transition-all">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-[#B08B5E] text-white font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-[#7B4F1D] transition-all">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN (Streamlined Tray) */}
      {showMobileMenu && (
        <div className="md:hidden px-4 pb-4 transition-all duration-300">
          <div className="rounded-xl bg-white shadow-lg border border-[#EADCC8] p-2 flex flex-col gap-1.5">
            {isAuthenticated ? (
              <>
                <Link
                  to={getProfileRoute()}
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#F8EFE2] text-[#7B4F1D] font-bold py-2.5 rounded-lg hover:bg-[#EADCC8]"
                >
                  👤 My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-2.5 rounded-lg active:bg-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full text-center bg-[#F8EFE2] text-[#7B4F1D] font-bold py-2.5 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full text-center bg-[#B08B5E] text-white font-bold py-2.5 rounded-lg shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}