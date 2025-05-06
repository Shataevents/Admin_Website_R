import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State
  const [selectedPage, setSelectedPage] = useState('Pages');
  const location = useLocation();
  const navigate = useNavigate();

  const pageMap = {
    '/booking-details': 'Booking Details',
    '/partner-details': 'Partner Details',
    '/partner': 'Approved Partners',
    '/user-count': 'User Count',
  };

  const handleLogout = () => {
    localStorage.removeItem('token-shata'); 
    navigate('/'); 
  };

  useEffect(() => {
    const currentPage = pageMap[location.pathname] || 'Pages';
    setSelectedPage(currentPage);
  }, [location.pathname]);

  return (
    <nav className="bg-[#FCFCFC] shadow-sm shadow-black/40 text-black w-full p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden block focus:outline-none"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Pages Dropdown (Hidden in Mobile) */}
        <div className="relative text-xl hidden md:block">
          <button
            onClick={() => setIsPagesOpen(!isPagesOpen)}
            className="flex items-center space-x-2 bg-orange hover:bg-orange px-4 py-2 rounded focus:outline-none"
          >
            <span>{selectedPage}</span>
            <svg className={`w-5 h-5 transition-transform ${isPagesOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isPagesOpen && (
            <div 
              className="absolute left-0 mt-2 w-50 bg-white text-xl rounded-md shadow-lg py-1 text-black z-50" // Added z-50
            >
              {Object.keys(pageMap).map((path) => (
                <a 
                  key={path} 
                  href={path} 
                  className="block px-4 py-2 hover:bg-orange-400"
                  onClick={() => {
                    setSelectedPage(pageMap[path]);
                    setIsPagesOpen(false);
                  }}
                >
                  {pageMap[path]}
                </a>
              ))}
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

        {/* Right Side Account Dropdown */}
        <div className="relative text-2xl">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 bg-[#FCFCFC] px-4 py-2 rounded focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {/* Hide "Account" text in Mobile */}
            <span className="hidden md:inline">Account</span>
            {/* Down Arrow */}
            <img
              src="/icons/chevron-down.svg" // Use the chevron-down.svg icon
              alt="Down Arrow"
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} // Add rotation effect
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black">
              <a href="/dashboard" className="block px-4 py-2 hover:bg-orange-200">Dashboard</a>
              <div onClick={handleLogout} className="block px-4 py-2 hover:bg-orange-200 cursor-pointer">Logout</div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu (Replaces Pages Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg">
          <div className="px-6 py-4">
            <div className="text-xl font-semibold mb-2">Pages</div>
            {Object.keys(pageMap).map((path) => (
              <a key={path} href={path} className="block px-4 py-2 hover:bg-orange-400"
                onClick={() => setIsMobileMenuOpen(false)}>
                {pageMap[path]}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
