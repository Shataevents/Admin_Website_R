import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState('Pages');
  const location = useLocation();

  const pageMap = {
    '/booking-details': 'Booking Details',
    '/partner-details': 'Partner Details',
    '/request': 'Request',
  };

  
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token-shata'); 
    navigate('/'); 
  }
  useEffect(() => {
    const currentPage = pageMap[location.pathname] || 'Pages';
    setSelectedPage(currentPage);
  }, [location.pathname]);

  return (
    <nav className="bg-[#FCFCFC] shadow-sm shadow-black/40 text-black w-full p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side dropdown */}
        <div className="relative text-xl">
          <button
            onClick={() => setIsPagesOpen(!isPagesOpen)}
            className="flex items-center space-x-2 bg-orange hover:bg-orange px-4 py-2 rounded focus:outline-none"
          >
            <span>{selectedPage}</span>
            {/* Chevron arrow that changes direction */}
            <svg
              className={`w-5 h-5 transition-transform ${isPagesOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isPagesOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white text-xl rounded-md shadow-lg py-1 text-black">
              <a
                href="/booking-details"
                className="block px-4 py-2 hover:bg-orange-400"
                onClick={() => {
                  setSelectedPage('Booking Details');
                  setIsPagesOpen(false);
                }}
              >
                Booking Details
              </a>
              <a
                href="/partner-details"
                className="block px-4 py-2 hover:bg-orange-400"
                onClick={() => {
                  setSelectedPage('Partner Details');
                  setIsPagesOpen(false);
                }}
              >
                Partner Details
              </a>
              <a
                href="/request"
                className="block px-4 py-2 hover:bg-orange-400"
                onClick={() => {
                  setSelectedPage('Request');
                  setIsPagesOpen(false);
                }}
              >
                Request
              </a>
              <a
                href="/user-count"
                className="block px-4 py-2 hover:bg-orange-400"
                onClick={() => {
                  setSelectedPage('Request');
                  setIsPagesOpen(false);
                }}
              >
                User Count
              </a>
            </div>
          )}
        </div>

        {/* Centered Logo and Admin Text */}
        <div className="absolute left-1/2 flex-col transform -translate-x-1/2 flex items-center cursor-pointer space-x-2" 
         onClick={() => navigate('/dashboard')}>
          <img
            src="/logo.png" // Reference the logo directly from the public folder
            alt="Shata Logo"
            className="w-14 h-8 bg-white"
          />
          <h1 className="font-semibold text-3xl text-gray-800">
            Admin
          </h1>
        </div>

        {/* Right side dropdown */}
        <div className="relative text-2xl">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Account</span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black">
              <a href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                Dashboard
              </a>
              <div onClick={()=> handleLogout()} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;