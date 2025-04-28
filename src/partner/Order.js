import React from 'react';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <p className="text-gray-500">This feature will be coming soon.</p>

          <div className="flex justify-end mt-4">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate('/requests')}
            >
              Back to Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;