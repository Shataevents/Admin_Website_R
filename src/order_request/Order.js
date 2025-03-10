import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { request } = location.state || {};
  
  const [status, setStatus] = useState('Pending');

  if (!request) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">No Request Selected</h2>
        <div className="flex justify-end">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate('/requests')}
          >
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order Details - Request #{request.id}</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <p className="font-medium">Requested Items:</p>
            <ul className="list-disc list-inside">
              {request.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <p>
            <span className="font-medium">Description:</span> {request.description}
          </p>

          <p>
            <span className="font-medium">Planner Name:</span> {request.plannerName}
          </p>

          <p>
            <span className="font-medium">Company Name:</span> {request.company}
          </p>

          <div>
            <p>
              <span className="font-medium">Personal Phone:</span> {request.personalPhone}
            </p>
            <p>
              <span className="font-medium">Company Phone:</span> {request.companyPhone}
            </p>
          </div>

          <p>
            <span className="font-medium">Quantity:</span> {request.quantity}
          </p>

          <div>
            <label className="font-medium block mb-1">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Rejected">Delivered</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Departed">Departed</option>
            </select>
          </div>

          <div className="flex justify-end mt-4">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate('/request')}
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