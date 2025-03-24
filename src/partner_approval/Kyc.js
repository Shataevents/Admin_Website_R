import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import back icon

const verificationSteps = [
  { title: "Online KYC", description: "See the Video file and uploaded documents", path: "online-kyc" },
  { title: "Company Verification", description: "Verify the company documents", path: "company-kyc" },
  { title: "In-person Verification", description: "Schedule an in-person verification with a partner.", path: "in-person" },
];

const Kyc = () => {
  const { id } = useParams(); // Get planner ID from URL
  const navigate = useNavigate();
  const [planner, setPlanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch planner details using the ID
  useEffect(() => {
    if (!id) {
      setError("No planner ID provided.");
      setIsLoading(false);
      return;
    }

    fetch(`http://shata-app-alb-933188665.ap-south-2.elb.amazonaws.com/partners/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the API returns the planner object directly (not wrapped in a "data" field)
        setPlanner(data);
      })
      .catch((error) => {
        console.error("Error fetching planner details:", error);
        setError("Failed to fetch planner details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-600 text-xl">
        Loading planner details...
      </div>
    );
  }

  // Handle error or no planner data
  if (error || !planner || !planner.name) {
    return (
      <div className="p-6 text-center text-gray-600 text-xl">
        {error || "No partner done till now."}
      </div>
    );
  }

  return (
    <div className="p-6">
      <button 
        className="flex items-center text-xl font-bold mb-4 hover:underline"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <h2 className="text-2xl font-bold mb-4">KYC Verification</h2>

      <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md">
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
            className="bg-white border-white p-4 rounded-lg shadow-lg border-2 cursor-pointer hover:bg-orange-100 transition-all"
            onClick={() => navigate(`/partner-details/kyc/${step.path}/${id}`)} // Pass ID in URL for further navigation
          >
            <h3 className="font-bold text-2xl">{step.title}</h3>
            <p className="text-black/80 text-lg">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kyc;