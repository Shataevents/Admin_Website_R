import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import back icon

const verificationSteps = [
  { title: "Online KYC", description: "See the Video file and uploaded documents", path: "online-kyc", statusKey: "kycStatus", validStatuses: ["AKYC", "RKYC", "DKYC"] },
  { title: "Company Verification", description: "Verify the company documents", path: "company-kyc", statusKey: "cvStatus", validStatuses: ["ACV", "RCV", "DCV"] },
  { title: "In-person Verification", description: "Schedule an in-person verification with a partner.", path: "in-person", statusKey: "ipvStatus", validStatuses: ["decline", "approved"] },
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

    fetch(`https://shatabackend.in/partners/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
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
        {error || "No partner details found."}
      </div>
    );
  }

  // Determine if a step is accessible based on the planner's status
  const isStepAccessible = (index) => {
    if (index === 0) return true; // First step is always accessible
    const previousStep = verificationSteps[index - 1];
    const previousStatus = planner[previousStep.statusKey];

    // If the previous step is in "Reupload" or "Declined" status, block progression
    if (["RKYC", "RCV", "DKYC", "DCV"].includes(previousStatus)) {
      return false;
    }

    // Otherwise, check if the previous step's status is valid
    return previousStep.validStatuses.includes(previousStatus);
  };

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
        <p className="text-xl"><strong>Name:</strong> {planner.name || "Not Available"}</p>
        <p className="text-xl"><strong>Company:</strong> {planner.companyName || "Not Available"}</p>
        <p className="text-xl"><strong>Company Location:</strong> {planner.companyLocation || "Not Available"}</p>
        <p className="text-xl"><strong>Personal Phone:</strong> {planner.mobileNo || "Not Available"}</p>
        <p className="text-xl"><strong>Company Email:</strong> {planner.companyEmail || "Not Available"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {verificationSteps.map((step, index) => (
          <div 
            key={index} 
            className={`bg-white border-white p-4 rounded-lg shadow-lg border-2 transition-all ${
              isStepAccessible(index) ? "cursor-pointer hover:bg-orange-100" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => isStepAccessible(index) && navigate(`/partner-details/kyc/${step.path}/${id}`)} // Navigate only if accessible
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