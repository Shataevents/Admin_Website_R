import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import back icon

const Inperson = () => {
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

  // Handler for Approve button (status: "Approve")
  const handleApprove = () => {
    fetch(`https://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
      },
      body: JSON.stringify({
        status: "approved", // Existing status field
        ipvStatus: "approved", // New field to indicate In person status
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner approved for In-person Verification!");
        navigate(-1); // Navigate back after approval
      })
      .catch((error) => {
        console.error("Error approving planner:", error);
        alert("Failed to approve planner.");
      });
  };



  // Handler for Decline button (status: "Decline")
  const handleDecline = () => {
    fetch(`https://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
      },
      body: JSON.stringify({
        status: "decline", // Existing status field
        ipvStatus: "decline", // New field to indicate Inperson status
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner declined for In-person Verification!");
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
        <h3 className="text-3xl font-semibold mb-4">Planner Details</h3>
        <p className="text-xl"><strong>Name:</strong> {planner.name}</p>
        <p className="text-xl"><strong>Company:</strong> {planner.companyName}</p>
        <p className="text-xl"><strong>Planner Phone:</strong> {planner.mobileNo}</p>
        <p className="text-xl"><strong>Company Email:</strong> {planner.companyEmail}</p>
        <p className="text-xl"><strong>Company Location:</strong> {planner.companyLocation}</p>
      </div>

      {/* Approve, Reupload, Decline Buttons at the Bottom */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 flex justify-center gap-6">
        
      {planner.status != "approved" ? (
        <>
        <button 
          className="bg-green-500 text-white px-6 py-3 text-xl font-semibold rounded-md hover:bg-green-600 transition-all"
          onClick={handleApprove}
        >
          Approve
        </button>
        <button 
          className="bg-red-500 text-white px-6 py-3 text-xl font-semibold rounded-md hover:bg-red-600 transition-all"
          onClick={handleDecline}
        >
          Decline
        </button>
        </>  ) : (
          <div className="text-green-300 font-bold">
            {" "}
            In-Person verification is Approved .{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inperson;