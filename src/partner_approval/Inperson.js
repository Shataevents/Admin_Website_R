import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Inperson = () => {
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
        <h3 className="text-3xl font-semibold mb-4">Planner Details</h3>
        <p className="text-xl"><strong>Name:</strong> {planner.name}</p>
        <p className="text-xl"><strong>Company:</strong> {planner.company}</p>
        <p className="text-xl"><strong>Planner Phone:</strong> {planner.personalPhone}</p>
        <p className="text-xl"><strong>Company Phone:</strong> {planner.companyPhone}</p>
        <p className="text-xl"><strong>Company Location:</strong> {planner.companyLocation}</p>
      </div>

      {/* Status Dropdown Section */}
      <div className="bg-black text-white border-2 border-white p-6 rounded-lg shadow-md flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Update Status:</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-black px-3 py-2 text-xl cursor-pointer rounded border border-gray-300"
        >
          <option value="Pending">Pending</option>
          <option value="KYC Done">KYC Done</option>
        </select>
      </div>
    </div>
  );
};

export default Inperson;
