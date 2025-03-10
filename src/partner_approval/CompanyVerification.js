import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const CompanyVerification = () => {
  const location = useLocation();
  const planner = location.state;

  // Status state, initialized to "Pending"
  const [status, setStatus] = useState("Pending");

  if (!planner) {
    return <div className="p-6 text-red-500">No planner details found.</div>;
  }

  return (
    <div className="p-6">
      {/* Planner Details Section */}
      <div className="bg-black text-white border-2 border-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-3xl font-semibold">Planner Details</h3>
        <p className="text-xl"><strong>Name:</strong> {planner.name}</p>
        <p className="text-xl"><strong>Company:</strong> {planner.company}</p>
        <p className="text-xl"><strong>Company Location:</strong> {planner.companyLocation}</p>
      </div>

      {/* Documents Section */}
      <div className="bg-black text-white border-2 border-white p-6 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold mb-4">Company Documents</h3>

        {/* Company PAN Card */}
        <div className="mb-6">
          <h4 className="text-xl font-bold">Company PAN Card</h4>
          <img 
            src="https://via.placeholder.com/300x200?text=Company+PAN+Card" 
            alt="Company PAN Card" 
            className="w-full h-40 rounded-md border-2 border-gray-500 mt-2"
          />
        </div>

        {/* Company LLR */}
        <div>
          <h4 className="text-xl font-bold">Company LLR</h4>
          <img 
            src="https://via.placeholder.com/300x200?text=Company+LLR" 
            alt="Company LLR" 
            className="w-full h-40 rounded-md border-2 border-gray-500 mt-2"
          />
        </div>
      </div>

      {/* Status Dropdown at the Bottom */}
      <div className="bg-black text-white border-2 border-white p-6 rounded-lg shadow-md mt-6 flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Update Status:</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-black text-xl px-3 py-2 rounded cursor-pointer border border-gray-300"
        >
          <option value="Pending">Pending</option>
          <option value="KYC Done">KYC Done</option>
        </select>
      </div>
    </div>
  );
};

export default CompanyVerification;
