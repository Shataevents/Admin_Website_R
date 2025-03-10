import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import back icon

const CompanyVerification = () => {
  const location = useLocation();
  const planner = location.state;
  const navigate = useNavigate();


  if (!planner) {
    return <div className="p-6 text-red-500">No planner details found.</div>;
  }

  return (
    <div className="p-6">
      <button 
        className="flex items-center text-white text-xl font-bold mb-4 hover:underline"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
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

      {/* Approve & Delete Buttons at the Bottom */}
      <div className="bg-black p-6 rounded-lg shadow-md mt-6 flex justify-center gap-6">
        <button 
          className="bg-green-500 text-white px-6 py-3 text-xl font-semibold rounded-md hover:bg-green-600 transition-all"
          onClick={() => alert("Approved")}
        >
          Approve
        </button>
        <button 
          className="bg-red-500 text-white px-6 py-3 text-xl font-semibold rounded-md hover:bg-red-600 transition-all"
          onClick={() => alert("Deleted")}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CompanyVerification;
