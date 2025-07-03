import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen"; // Import the LoadingScreen component

const verificationSteps = [
  { title: "Online KYC", description: "See the Video file and uploaded documents", path: "online-kyc", statusKey: "kycStatus", validStatuses: ["AKYC", "RKYC", "DKYC"] },
  { title: "Company Verification", description: "Verify the company documents", path: "company-kyc", statusKey: "cvStatus", validStatuses: ["ACV", "RCV", "DCV"] },
  { title: "In-person Verification", description: "Schedule an in-person verification with a partner.", path: "in-person", statusKey: "ipvStatus", validStatuses: ["decline", "approved"] },
];

const SUPER_ADMIN_PASSWORD = "testing"; // Password stored in frontend

const Kyc = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [planner, setPlanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuperAdminPopup, setShowSuperAdminPopup] = useState(false);
  const [superAdminPassword, setSuperAdminPassword] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && showSuperAdminPopup) {
        handleSuperAdminSubmit();
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSuperAdminPopup, superAdminPassword]);

  const handleSuperAdminSubmit = () => {
    if (superAdminPassword === SUPER_ADMIN_PASSWORD) {
      setIsSuperAdmin(true);
      setShowSuperAdminPopup(false);
      fetch(`https://shatabackend.in/partners/${id}/super-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_TOKEN_HERE`,
        },
        body: JSON.stringify({ isSuperAdmin: true }),
      });
    } else {
      alert("Incorrect password!");
      setSuperAdminPassword("");
    }
  };

  if (isLoading) {
    return <LoadingScreen />; // Show the LoadingScreen while the page is loading
  }

  if (error || !planner || !planner.name) {
    return <div className="p-6 text-center text-gray-600 text-xl">{error || "No partner details found."}</div>;
  }

  const isStepAccessible = (index) => {
    if (planner.status === "decline" || isSuperAdmin) return true;
    if (index === 0) return true;
    const previousStep = verificationSteps[index - 1];
    const previousStatus = planner[previousStep.statusKey];
    if (["RKYC", "RCV", "DKYC", "DCV"].includes(previousStatus)) return false;
    return previousStep.validStatuses.includes(previousStatus);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button className="flex items-center text-xl font-bold hover:underline" onClick={() => navigate(-1)}>
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => setShowSuperAdminPopup(true)}
        >
          Super Admin
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">KYC Verification</h2>

      <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold mb-2">Partner Details</h3>
        <p className="text-xl"><strong>Name:</strong> {planner.name || "Not Available"}</p>
        <p className="text-xl"><strong>Company:</strong> {planner.companyName || "Not Available"}</p>
        <p className="text-xl"><strong>Company Location:</strong> {planner.companyLocation || "Not Available"}</p>
        <p className="text-xl"><strong>Personal Phone:</strong> {planner.mobileNo || "Not Available"}</p>
        <p className="text-xl"><strong>Selected Services:</strong> {
          planner.servicesSelected && Array.isArray(planner.servicesSelected) && planner.servicesSelected.length > 0
            ? planner.servicesSelected.join(", ")
            : "Not Available"
        }</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {verificationSteps.map((step, index) => (
          <div
            key={index}
            className={`bg-white border-white p-4 rounded-lg shadow-lg border-2 transition-all ${
              isStepAccessible(index) ? "cursor-pointer hover:bg-orange-100" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => isStepAccessible(index) && navigate(`/partner-details/kyc/${step.path}/${id}?superAdmin=${isSuperAdmin}`)}
          >
            <h3 className="font-bold text-2xl">{step.title}</h3>
            <p className="text-black/80 text-lg">{step.description}</p>
            {isStepAccessible(index) ? "View Details" : "Disabled"}
          </div>
        ))}
      </div>

      {showSuperAdminPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Enter Super Admin Password</h2>
            <input
              type="password"
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Enter password..."
              value={superAdminPassword}
              onChange={(e) => setSuperAdminPassword(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setShowSuperAdminPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleSuperAdminSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kyc;