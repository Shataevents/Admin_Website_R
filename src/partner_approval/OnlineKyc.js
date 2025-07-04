import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import LoadingScreen from "../components/LoadingScreen"; // Import the LoadingScreen component

const OnlineKyc = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [planner, setPlanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReuploadPopup, setShowReuploadPopup] = useState(false);
  const [reuploadReason, setReuploadReason] = useState("");
  const [showDeclinePopup, setShowDeclinePopup] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // State for preview image
  const isSuperAdmin = new URLSearchParams(location.search).get("superAdmin") === "true";

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

  const closePreviewImage = () => {
    setPreviewImage(null);
  };

  const handleApprove = () => {
    fetch(`https://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`,
      },
      body: JSON.stringify({
        status: "AKYC",
        kycStatus: "AKYC",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner approved for Online KYC!");
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error approving planner:", error);
        alert("Failed to approve planner.");
      });
  };

  const handleReupload = () => {
    if (!reuploadReason.trim()) {
      alert("Please enter a reason for reuploadation.");
      return;
    }

    fetch(`https://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`,
      },
      body: JSON.stringify({
        status: "RKYC",
        kycStatus: "RKYC",
        reason: `REUPLOAD:- ${reuploadReason}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner marked for reupload for Online KYC!");
        setShowReuploadPopup(false);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error marking planner for reupload:", error);
        alert("Failed to mark planner for reupload.");
      });
  };

  const handleDecline = () => {
    if (!declineReason.trim()) {
      alert("Please enter a reason for declining.");
      return;
    }

    fetch(`https://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`,
      },
      body: JSON.stringify({
        status: "DKYC",
        kycStatus: "DKYC",
        reason: `DECLINE:- ${declineReason}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Planner declined for Online KYC!");
        setShowDeclinePopup(false);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error declining planner:", error);
        alert("Failed to decline planner.");
      });
  };

  if (isLoading) {
    return <LoadingScreen />; // Show the LoadingScreen while the page is loading
  }

  if (error || !planner || !planner.name) {
    return <div className="p-6 text-center text-gray-600 text-xl">{error || "No planner details found."}</div>;
  }

  return (
    <div className="p-6">
      <button className="flex items-center text-xl font-bold mb-4 hover:underline" onClick={() => navigate(-1)}>
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="text-left text-3xl font-bold my-2">Partner: {planner.name}</div>
      <h2 className="text-2xl font-bold">Online KYC Verification</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold mb-2">Video Verification</h3>
          {planner.videoUrl ? (
            <video
              className="w-full h-64 rounded-md border-2"
              controls
            >
              <source src={planner?.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-gray-600">No video available.</p>
          )}
        </div>

        <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold mb-4">Uploaded Documents</h3>
          <div className="mb-4">
            <h4 className="text-xl font-bold">Aadhar Card</h4>
            {planner.aadharUrl ? (
              <img
                src={planner.aadharUrl}
                alt="Aadhar Card"
                className="w-50 h-40 rounded-md border-2 mt-2 cursor-pointer"
                onClick={() => setPreviewImage(planner.aadharUrl)} // Set preview image
              />
            ) : (
              <p className="text-gray-600 mt-2">Aadhar Card not uploaded.</p>
            )}
          </div>
          <div className="mb-4">
            <h4 className="text-xl font-bold">PAN Card</h4>
            {planner.governmentIdUrl ? (
              <img
                src={planner.governmentIdUrl}
                alt="PAN Card"
                className="w-50 h-40 rounded-md border-2 mt-2 cursor-pointer"
                onClick={() => setPreviewImage(planner.governmentIdUrl)} // Set preview image
              />
            ) : (
              <p className="text-gray-600 mt-2">PAN Card not uploaded.</p>
            )}
          </div>
          
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6 flex justify-center gap-6">
        {planner.kycStatus === "AKYC" ? (
          <div className="text-green-500 font-bold text-center mb-6">Online KYC is Approved.</div>
        ) : planner.kycStatus === "RKYC" ? (
          <div className="text-orange-500 font-bold text-center mb-6">
            Planner marked for reupload. <br />
            <span className="text-gray-600 text-lg">{planner.reason || "No reason provided."}</span>
          </div>
        ) : planner.kycStatus === "DKYC" ? (
          <div className="text-red-500 font-bold text-center mb-6">
            Planner declined. <br />
            <span className="text-gray-600 text-lg">{planner.reason || "No reason provided."}</span>
          </div>
        ) : null}
      </div>

      <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md mt-6 flex justify-center gap-6">
        <button
          className={`px-6 py-3 text-xl font-semibold rounded-md transition-all ${
            !isSuperAdmin && ["AKYC", "RKYC", "DKYC"].includes(planner.kycStatus)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          onClick={!isSuperAdmin && ["AKYC", "RKYC", "DKYC"].includes(planner.kycStatus) ? null : handleApprove}
          disabled={!isSuperAdmin && ["AKYC", "RKYC", "DKYC"].includes(planner.kycStatus)}
        >
          Approve
        </button>

        <button
          className={`px-6 py-3 text-xl font-semibold rounded-md transition-all ${
            !isSuperAdmin && ["AKYC", "RKYC", "DKYC"].includes(planner.kycStatus)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-orange-300 text-white hover:bg-orange-400"
          }`}
          onClick={!isSuperAdmin && ["AKYC", "RKYC", "DKYC"].includes(planner.kycStatus) ? null : () => setShowReuploadPopup(true)}
          disabled={!isSuperAdmin && ["AKYC", "RKYC", "DKYC"].includes(planner.kycStatus)}
        >
          Reupload
        </button>

        <button
          className={`px-6 py-3 text-xl font-semibold rounded-md transition-all ${
            !isSuperAdmin && ["AKYC", "RKYC", "DKYC"].includes(planner.kycStatus)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          onClick={!isSuperAdmin && ["AKYC", "RKYC", "DKYC"].includes(planner.kycStatus) ? null : () => setShowDeclinePopup(true)}
          disabled={!isSuperAdmin && ["AKYC", "RKYC", "DKYC"].includes(planner.kycStatus)}
        >
          Decline
        </button>
      </div>

      {showReuploadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">What is the reason for reuploadation?</h2>
            <textarea
              className="w-full p-2 border rounded-md mb-4"
              rows="4"
              placeholder="Enter the reason here..."
              value={reuploadReason}
              onChange={(e) => setReuploadReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setShowReuploadPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                onClick={handleReupload}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeclinePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">What is the reason for declining?</h2>
            <textarea
              className="w-full p-2 border rounded-md mb-4"
              rows="4"
              placeholder="Enter the reason here..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setShowDeclinePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDecline}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Image container */}
          <div className="flex-1 overflow-auto flex items-center justify-center bg-white relative py-6">
            <button
              className="absolute top-6 right-6 w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center text-lg font-bold transition-colors z-10"
              onClick={closePreviewImage}
            >
              <GrClose />
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineKyc;