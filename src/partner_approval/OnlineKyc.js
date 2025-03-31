import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import back icon

const OnlineKyc = () => {
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

    fetch(`http://shatabackend.in/partners/${id}`)
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

  // Handler for Approve button (status: "AKYC")
  const handleApprove = () => {
    fetch(`http://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
      },
      body: JSON.stringify({ status: "AKYC" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner approved for Online KYC!");
        navigate(-1); // Navigate back after approval
      })
      .catch((error) => {
        console.error("Error approving planner:", error);
        alert("Failed to approve planner.");
      });
  };

  // Handler for Reupload button (status: "RKYC")
  const handleReupload = () => {
    fetch(`http://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
      },
      body: JSON.stringify({ status: "RKYC" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner marked for reupload for Online KYC!");
        navigate(-1); // Navigate back after marking for reupload
      })
      .catch((error) => {
        console.error("Error marking planner for reupload:", error);
        alert("Failed to mark planner for reupload.");
      });
  };

  // Handler for Decline button (status: "DKYC")
  const handleDecline = () => {
    fetch(`https://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
      },
      body: JSON.stringify({ status: "DKYC" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner declined for Online KYC!");
        navigate(-1); // Navigate back after declining
      })
      .catch((error) => {
        console.error("Error declining planner:", error);
        alert("Failed to decline planner.");
      });
  };

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
        {error || "No planner details found."}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <button 
        className="flex items-center text-xl font-bold mb-4 hover:underline"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Planner Name at Top */}
      <div className="text-left text-3xl font-bold my-2">
        Planner: {planner.name}
      </div>

      <h2 className="text-2xl font-bold">Online KYC Verification</h2>

      {/* Two-column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Left Side - Video Section */}
        <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold mb-2">Video Verification</h3>
          {planner.videoUrl ? (
            <video className="w-full h-64 rounded-md border-2" controls>
              <source src={planner.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-gray-600">No video available.</p>
          )}
        </div>

        {/* Right Side - Documents Section */}
        <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold mb-4">Uploaded Documents</h3>

          {/* Aadhar Card (Government ID) */}
          <div className="mb-4">
            <h4 className="text-xl font-bold">Aadhar Card</h4>
            {planner.governmentIdUrl ? (
              <img 
                src={planner.governmentIdUrl} 
                alt="Aadhar Card" 
                className="w-full h-40 rounded-md border-2 mt-2"
              />
            ) : (
              <p className="text-gray-600 mt-2">Aadhar Card not uploaded.</p>
            )}
          </div>

          {/* PAN Card (Company ID Card) */}
          <div>
            <h4 className="text-xl font-bold">PAN Card</h4>
            {planner.companyIdCardUrl ? (
              <img 
                src={planner.companyIdCardUrl} 
                alt="PAN Card" 
                className="w-full h-40 rounded-md border-2 mt-2"
              />
            ) : (
              <p className="text-gray-600 mt-2">PAN Card not uploaded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Approve, Reupload, Decline Buttons at the Bottom */}
      <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md mt-6 flex justify-center gap-6">
        <button 
          className="bg-green-500 text-white px-6 py-3 text-xl font-semibold rounded hover:bg-green-600 transition-all"
          onClick={handleApprove}
        >
          Approve
        </button>
        <button 
          className="bg-orange-300 text-white px-6 py-3 text-xl font-semibold rounded hover:bg-orange-400 transition-all"
          onClick={handleReupload}
        >
          Reupload
        </button>
        <button 
          className="bg-red-500 text-white px-6 py-3 text-xl font-semibold rounded hover:bg-red-600 transition-all"
          onClick={handleDecline}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default OnlineKyc;