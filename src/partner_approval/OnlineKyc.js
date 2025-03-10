import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OnlineKyc = () => {
  const location = useLocation();
  const planner = location.state;
  const navigate = useNavigate();

  // Status state, initialized to "Pending"
  const [status, setStatus] = useState("Pending");

  if (!planner) {
    return <div className="p-6 text-red-500">No planner details found.</div>;
  }

  return (
    <div className="p-6">
      {/* Planner Name at Top */}
      <div className="text-left text-white text-3xl font-bold my-2">
        Planner: {planner.name}
      </div>

      <h2 className="text-2xl font-bold text-white">Online KYC Verification</h2>

      {/* Two-column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Left Side - Video Section */}
        <div className="bg-black text-white border-2 border-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold mb-2">Video Verification</h3>
          <video className="w-full h-64 rounded-md border-2 border-gray-500" controls>
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right Side - Documents Section */}
        <div className="bg-black text-white border-2 border-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold mb-4">Uploaded Documents</h3>

          {/* Aadhar Card */}
          <div className="mb-4">
            <h4 className="text-xl font-bold">Aadhar Card</h4>
            <img 
              src="https://via.placeholder.com/300x200?text=Aadhar+Card" 
              alt="Aadhar Card" 
              className="w-full h-40 rounded-md border-2 border-gray-500 mt-2"
            />
          </div>

          {/* PAN Card */}
          <div>
            <h4 className="text-xl font-bold">PAN Card</h4>
            <img 
              src="https://via.placeholder.com/300x200?text=PAN+Card" 
              alt="PAN Card" 
              className="w-full h-40 rounded-md border-2 border-gray-500 mt-2"
            />
          </div>
        </div>

      </div>

      {/* Status Dropdown at the Bottom */}
      <div className="bg-black text-white border-2 border-white p-6 rounded-lg shadow-md mt-6 flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Update Status:</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-black  px-3 py-2 text-xl cursor-pointer rounded "
        >
          <option value="Pending" >Pending</option>
          <option value="KYC Done">KYC Done</option>
        </select>
      </div>
    </div>
  );
};

export default OnlineKyc;
