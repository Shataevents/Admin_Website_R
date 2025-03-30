import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import back icon

const CompanyVerification = () => {
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

  // Handler for Approve button (status: "ACV")
  const handleApprove = () => {
    fetch(`http://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
      },
      body: JSON.stringify({ status: "ACV" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner approved for Company Verification!");
        navigate(-1); // Navigate back after approval
      })
      .catch((error) => {
        console.error("Error approving planner:", error);
        alert("Failed to approve planner.");
      });
  };

  // Handler for Reupload button (status: "RCV")
  const handleReupload = () => {
    fetch(`http://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
      },
      body: JSON.stringify({ status: "RCV" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner marked for reupload for Company Verification!");
        navigate(-1); // Navigate back after marking for reupload
      })
      .catch((error) => {
        console.error("Error marking planner for reupload:", error);
        alert("Failed to mark planner for reupload.");
      });
  };

  // Handler for Decline button (status: "DCV")
  const handleDecline = () => {
    fetch(`http://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
      },
      body: JSON.stringify({ status: "DCV" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner declined for Company Verification!");
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
      <button 
        className="flex items-center text-xl font-bold mb-4 hover:underline"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Planner Details Section */}
      <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-3xl font-semibold">Planner Details</h3>
        <p className="text-xl"><strong>Name:</strong> {planner.name}</p>
        <p className="text-xl"><strong>Company:</strong> {planner.companyName}</p>
        <p className="text-xl"><strong>Company Location:</strong> {planner.companyLocation}</p>
      </div>

      {/* Documents Section */}
      <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold mb-4">Company Documents</h3>

        {/* GST Certificate */}
        <div className="mb-6">
          <h4 className="text-xl font-bold">GST Certificate</h4>
          {planner.gstCertificateUrl ? (
            <img 
              src={planner.gstCertificateUrl} 
              alt="GST Certificate" 
              className="w-full h-40 rounded-md border-2 border-gray-500 mt-2"
            />
          ) : (
            <p className="text-gray-600 mt-2">GST Certificate not uploaded.</p>
          )}
        </div>

        {/* Incorporation Certificate */}
        <div>
          <h4 className="text-xl font-bold">Incorporation Certificate</h4>
          {planner.incorporationCertificateUrl ? (
            <img 
              src={planner.incorporationCertificateUrl} 
              alt="Incorporation Certificate" 
              className="w-full h-40 rounded-md border-2 border-gray-500 mt-2"
            />
          ) : (
            <p className="text-gray-600 mt-2">Incorporation Certificate not uploaded.</p>
          )}
        </div>
      </div>

      {/* Approve, Reupload, Decline Buttons at the Bottom */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 flex justify-center gap-6">
        <button 
          className="bg-green-500 text-white px-6 py-3 text-xl font-semibold rounded-md hover:bg-green-600 transition-all"
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
          className="bg-red-500 text-white px-6 py-3 text-xl font-semibold rounded-md hover:bg-red-600 transition-all"
          onClick={handleDecline}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CompanyVerification;