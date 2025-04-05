import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const CompanyVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [planner, setPlanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showReuploadPopup, setShowReuploadPopup] = useState(false);
  const [showDeclinePopup, setShowDeclinePopup] = useState(false);
  const [reuploadReason, setReuploadReason] = useState("");
  const [declineReason, setDeclineReason] = useState("");
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

  const handleApprove = (status, successMessage) => {
    fetch(`https://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`,
      },
      body: JSON.stringify({
        status,
        cvStatus: "ACV",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert(successMessage);
        navigate(-1);
      })
      .catch((error) => {
        console.error(`Error updating status to ${status}:`, error);
        alert(`Failed to update status to ${status}.`);
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
        status: "RCV",
        cvStatus: "RCV",
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
        alert("Planner marked for reupload!");
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
        status: "DCV",
        cvStatus: "DCV",
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
        alert("Planner declined!");
        setShowDeclinePopup(false);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error declining planner:", error);
        alert("Failed to decline planner.");
      });
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-600 text-xl">Loading planner details...</div>;
  }

  if (error || !planner || !planner.name) {
    return <div className="p-6 text-center text-gray-600 text-xl">{error || "No planner details found."}</div>;
  }

  return (
    <div className="p-6">
      <button className="flex items-center text-xl font-bold mb-4 hover:underline" onClick={() => navigate(-1)}>
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-3xl font-semibold">Planner Details</h3>
        <p className="text-xl"><strong>Name:</strong> {planner.name}</p>
        <p className="text-xl"><strong>Company:</strong> {planner.companyName}</p>
        <p className="text-xl"><strong>Company Location:</strong> {planner.companyLocation}</p>
      </div>

      <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold mb-4">Company Documents</h3>
        <div className="mb-6">
          <h4 className="text-xl font-bold">GST Certificate</h4>
          {planner.gstCertificateUrl ? (
            <img
              src={planner.gstCertificateUrl}
              alt="GST Certificate"
              className="w-50 h-40 rounded-md border-2 border-gray-500 mt-2 cursor-pointer"
              onClick={() => setPreviewImage(planner.gstCertificateUrl)}
            />
          ) : (
            <p className="text-gray-600 mt-2">GST Certificate not uploaded.</p>
          )}
        </div>
        <div>
          <h4 className="text-xl font-bold">Incorporation Certificate</h4>
          {planner.incorporationCertificateUrl ? (
            <img
              src={planner.incorporationCertificateUrl}
              alt="Incorporation Certificate"
              className="w-50 h-40 rounded-md border-2 border-gray-500 mt-2 cursor-pointer"
              onClick={() => setPreviewImage(planner.incorporationCertificateUrl)}
            />
          ) : (
            <p className="text-gray-600 mt-2">Incorporation Certificate not uploaded.</p>
          )}
        </div>
        <div>
          <h4 className="text-xl font-bold">LIN Certificate</h4>
          {planner.LINCertificateUrl ? (
            <img
              src={planner.LINCertificateUrl}
              alt="LIN Certificate"
              className="w-50 h-40 rounded-md border-2 border-gray-500 mt-2 cursor-pointer"
              onClick={() => setPreviewImage(planner.LINCertificateUrl)}
            />
          ) : (
            <p className="text-gray-600 mt-2">LIN Certificate not uploaded.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6 flex justify-center gap-6">
        {planner.cvStatus === "ACV" || planner.status === "ACV" ? (
          <div className="text-green-500 font-bold text-center mb-6">Company verification is Approved.</div>
        ) : planner.cvStatus === "RCV" || planner.status === "RCV" ? (
          <div className="text-orange-500 font-bold text-center mb-6">
            Planner marked for reupload. <br />
            <span className="text-gray-600 text-lg">{planner.reason || "No reason provided."}</span>
          </div>
        ) : planner.cvStatus === "DCV" || planner.status === "DCV" ? (
          <div className="text-red-500 font-bold text-center mb-6">
            Planner declined. <br />
            <span className="text-gray-600 text-lg">{planner.reason || "No reason provided."}</span>
          </div>
        ) : null}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6 flex justify-center gap-6">
        <button
          className={`px-6 py-3 text-xl font-semibold rounded-md transition-all ${
            !isSuperAdmin && ["ACV", "RCV", "DCV"].includes(planner.cvStatus)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          onClick={!isSuperAdmin && ["ACV", "RCV", "DCV"].includes(planner.cvStatus) ? null : () => handleApprove("ACV", "Planner approved successfully!")}
          disabled={!isSuperAdmin && ["ACV", "RCV", "DCV"].includes(planner.cvStatus)}
        >
          Approve
        </button>

        <button
          className={`px-6 py-3 text-xl font-semibold rounded-md transition-all ${
            !isSuperAdmin && ["ACV", "RCV", "DCV"].includes(planner.cvStatus)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-orange-300 text-white hover:bg-orange-400"
          }`}
          onClick={!isSuperAdmin && ["ACV", "RCV", "DCV"].includes(planner.cvStatus) ? null : () => setShowReuploadPopup(true)}
          disabled={!isSuperAdmin && ["ACV", "RCV", "DCV"].includes(planner.cvStatus)}
        >
          Reupload
        </button>

        <button
          className={`px-6 py-3 text-xl font-semibold rounded-md transition-all ${
            !isSuperAdmin && ["ACV", "RCV", "DCV"].includes(planner.cvStatus)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          onClick={!isSuperAdmin && ["ACV", "RCV", "DCV"].includes(planner.cvStatus) ? null : () => setShowDeclinePopup(true)}
          disabled={!isSuperAdmin && ["ACV", "RCV", "DCV"].includes(planner.cvStatus)}
        >
          Decline
        </button>
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img src={previewImage} alt="Preview" className="max-w-[400px] max-h-screen rounded-md" />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => setPreviewImage(null)} // Close preview
            >
              Close
            </button>
          </div>
        </div>
      )}

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
            <h2 className="text-2xl font-bold mbInfra-4">What is the reason for declining?</h2>
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
    </div>
  );
};

export default CompanyVerification;