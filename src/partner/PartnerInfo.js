import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component

const PartnerInfo = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Add the Navbar component */}
      <div className="p-6 max-w-full mx-auto">
        <div className="flex justify-start mb-4">
          <button 
            className="bg-white text-orange-500 px-4 py-2 rounded hover:bg-orange-500 hover:text-white"
            onClick={() => navigate('/dashboard')}
          >
            <img 
              src="/icons/chevron-left.svg" 
              alt="Chevron Left" 
              className="w-6 h-6 inline-block" 
            />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Approved Partner Details</h2>
        
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
        ) : partners.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500">No approved partners found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <div 
                key={partner._id} 
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 relative"
                onClick={() => navigate(`/partner/${partner._id}`)} // Navigate to PartnerDetails
              >
                <h3 className="text-lg font-semibold text-gray-800">{partner.name}</h3>
                <p className="text-black mt-1">
                  <span className="font-medium">Mobile:</span> {partner.mobileNo}
                </p>
                <p className="text-black  mt-1">
                  <span className="font-medium">Company:</span> {partner.companyName}
                </p>
                <p className="text-black  mt-1">
                  <span className="font-medium">Location:</span> {partner.companyLocation}
                </p>
                <div className="absolute bottom-4 right-4">
                  <img 
                    src="/icons/chevron-right.svg" 
                    alt="Chevron Right" 
                    className="w-4 h-4 text-orange-500" 
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