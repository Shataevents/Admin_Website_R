import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component

const PartnerInfo = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPartners, setFilteredPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://shatabackend.in/partners', {
          headers: {
            'api-key': 'name, mobileNo, personalEmail, companyName, companyLocation'
          }
        });
        const data = await response.json();
        const approvedPartners = data.filter(partner => partner.status === 'approved');
        setPartners(approvedPartners);
        setFilteredPartners(approvedPartners);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Filter partners based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPartners(partners);
    } else {
      const filtered = partners.filter(partner =>
        partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.mobileNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.personalEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPartners(filtered);
    }
  }, [searchTerm, partners]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Add the Navbar component */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-full mx-auto">
        <div className="flex justify-start mb-4 sm:mb-6">
          <button 
            className="bg-white text-orange-500 px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-orange-500 hover:text-white transition-colors duration-200 shadow-sm"
            onClick={() => navigate('/dashboard')}
          >
            <img 
              src="/icons/chevron-left.svg" 
              alt="Chevron Left" 
              className="w-5 h-5 sm:w-6 sm:h-6 inline-block" 
            />
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Approved Partner Details</h2>
        
        {/* Search Filter */}
        <div className="mb-6">
          <div className="relative max-w-full sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <input
              type="text"
              placeholder="Search by name, mobile, email, or company..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {!searchTerm && (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              Found {filteredPartners.length} partner{filteredPartners.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </p>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex space-x-4">
              <div 
                className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: '0s' }}
              ></div>
              <div 
                className="w-4 h-4 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div 
                className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500">
              {searchTerm ? `No partners found matching "${searchTerm}".` : 'No approved partners found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPartners.map((partner) => (
              <div 
                key={partner._id} 
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 hover:shadow-lg transition-all duration-200 relative"
                onClick={() => navigate(`/partner-details/${partner._id}`)} // Navigate to PartnerDetails
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 pr-8">{partner.name}</h3>
                <div className="space-y-2">
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-medium">Mobile:</span> {partner.mobileNo}
                  </p>
                  {partner.personalEmail && (
                    <p className="text-gray-700 text-sm sm:text-base">
                      <span className="font-medium">Email:</span> {partner.personalEmail}
                    </p>
                  )}
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-medium">Company:</span> {partner.companyName}
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-medium">Location:</span> {partner.companyLocation}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <img 
                    src="/icons/chevron-right.svg" 
                    alt="Chevron Right" 
                    className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerInfo;