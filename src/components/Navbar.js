import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState('Pages');
  const location = useLocation();

  const pageMap = {
    '/booking-details': 'Booking Details',
    '/partner-details': 'Partner Details',
    '/request': 'Request'
  };

  useEffect(() => {
    const currentPage = pageMap[location.pathname] || 'Pages';
    setSelectedPage(currentPage);
  }, [location.pathname]);

  return (
    <nav className="bg-black shadow-lg shadow-white/20 text-white  w-full p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side dropdown */}
        <div className="relative text-2xl">
          <button
            onClick={() => setIsPagesOpen(!isPagesOpen)}
            className="flex items-center space-x-2 bg-black hover:bg-gray-900 px-4 py-2 rounded focus:outline-none"
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
            <div className="absolute left-0 mt-2 w-48 bg-black text-xl rounded-md shadow-lg py-1 text-white">
              <a
                href="/booking-details"
                className="block px-4 py-2 hover:bg-gray-900"
                onClick={() => {
                  setSelectedPage('Booking Details');
                  setIsPagesOpen(false);
                }}
              >
                Booking Details
              </a>
              <a
                href="/partner-details"
                className="block px-4 py-2 hover:bg-gray-900"
                onClick={() => {
                  setSelectedPage('Partner Details');
                  setIsPagesOpen(false);
                }}
              >
                Partner Details
              </a>
              <a
                href="/request"
                className="block px-4 py-2 hover:bg-gray-900"
                onClick={() => {
                  setSelectedPage('Request');
                  setIsPagesOpen(false);
                }}
              >
                Request
              </a>
            </div>
          )}
        </div>

        {/* Centered Admin Panel */}
        <h1 className=" font-bold absolute text-2xl left-1/2 transform -translate-x-1/2">
          Shata Admin
        </h1>
        
        {/* Right side dropdown */}
        <div className="relative text-3xl">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 bg-black hover:bg-gray-900 px-4 py-2 rounded focus:outline-none"
          >
            <svg
              className="w-8 h-8"
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
              <a
                href="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </a>
              <a
                href="/login"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;