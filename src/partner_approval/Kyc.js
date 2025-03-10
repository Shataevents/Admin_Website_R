import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import back icon

const verificationSteps = [
  { title: "Online KYC", description: "See the Video file and uploaded documents", path: "online-kyc" },
  { title: "Company Verification", description: "Verify the company documents", path: "company-kyc" },
  { title: "In-person Verification", description: "Schedule an in-person verification with a partner.", path: "in-person" },
];

const Kyc = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const planner = location.state;

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
      <h2 className="text-2xl font-bold mb-4">KYC Verification</h2>

      <div className="bg-black text-white border-2 border-white p-6 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold mb-2">Planner Details</h3>
        <p className="text-xl"><strong>Name:</strong> {planner.name}</p>
        <p className="text-xl"><strong>Company:</strong> {planner.company}</p>
        <p className="text-xl"><strong>Company Location:</strong> {planner.companyLocation}</p>
        <p className="text-xl"><strong>Personal Phone:</strong> {planner.personalPhone}</p>
        <p className="text-xl"><strong>Company Phone:</strong> {planner.companyPhone}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {verificationSteps.map((step, index) => (
          <div 
            key={index} 
            className="bg-black text-white border-white p-4 rounded-lg shadow-lg border-2 cursor-pointer hover:bg-gray-900 transition-all"
            onClick={() => navigate(`/partner-details/kyc/${step.path}`, { state: planner })}
          >
            <h3 className="font-bold text-2xl">{step.title}</h3>
            <p className="text-gray-400 text-lg">{step.description}</p>
          </div>
        ))}
      </div>


    </div>
  );
};

export default Kyc;
