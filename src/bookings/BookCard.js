import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const BookCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state || {};
  const [status, setStatus] = useState("upcoming"); // Default status
  const [partnerDetails, setPartnerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [editedDetails, setEditedDetails] = useState({});

  const statusOptions = [
    "to visit",
    "in progress",
    "confirmed",
    "cancelled",
    "upcoming",
    "completed",
  ];

  useEffect(() => {
    if (!booking?.partnerId) {
      setLoading(false);
      return;
    }

    axios
      .get(`https://shatabackend.in/partners/${booking?.partnerId}`)
      .then((response) => {
        setPartnerDetails(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch partner details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [booking]);

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setEditedDetails({ ...editedDetails, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (Object.keys(editedDetails).length === 0) {
      alert("Please fill in the details to save.");
      return;
    }
    axios
      .post("https://shatabackend.in/temp-partner", {
        ...editedDetails,
      })
      .then((response) => {
        console.log("Details saved successfully:", response.data);
        alert("Details saved successfully!");
        setEditedDetails({});
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error saving details:", error);
        alert("Error saving details. Please try again.");
      });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white rounded hover:bg-orange-100"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6">{booking.eventType}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Client Details</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {booking.clientDetails?.name || "N/A"}
              </p>
              <p>
                <strong>Phone Number:</strong>{" "}
                {booking.clientDetails?.phone || "N/A"}
              </p>
              <p>
                <strong>Event Date:</strong>{" "}
                {booking?.dateFrom?.split("T")[0] || "N/A"}
              </p>
              <p>
                <strong>Email: </strong> {booking?.email || "NA"}
              </p>
              <p>
                <strong>Budget:</strong> ₹{booking?.budget || "N/A"}
              </p>
              <p>
                <strong>Location:</strong> {booking?.location || "N/A"}
              </p>
              <p>
                <strong>Services Booked:</strong>{" "}
                {booking.services?.join(", ") || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">
              Event Planner Details
            </h3>
            {loading ? (
              <p>Loading partner details...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : partnerDetails ? (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {booking.partnerName}
                </p>
                <p>
                  <strong>Company:</strong>{" "}
                  {partnerDetails.companyName || "N/A"}
                </p>
                <p>
                  <strong>Company Location:</strong>{" "}
                  {partnerDetails.companyLocation || "N/A"}
                </p>
                <p>
                  <strong>Personal Phone:</strong>{" "}
                  {booking.partnerMobile || "N/A"}
                </p>
                <p>
                  <strong>Company Phone:</strong>{" "}
                  {booking.plannerDetails?.companyPhone || "N/A"}
                </p>
                <p>
                  <strong>Company Email:</strong>{" "}
                  {partnerDetails.companyEmail || "N/A"}
                </p>
                <p>
                  <strong>GST No:</strong> {partnerDetails.gstNo || "N/A"}
                </p>
                <button
                  onClick={handleEditClick}
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <FaEdit className="mr-1" size={20} />
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Partner details not found.</p>
            )}
          </div>
        </div>

        {/* Status - Bottom Centered */}
        <div className="border-t pt-4 text-center">
          <h3 className="text-xl font-semibold mb-3">Booking Status</h3>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full max-w-xs p-2 border rounded mx-auto block"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">
              Edit Event Planner Details
            </h3>
            <div className="space-y-2">
              <label className="block">
                <span className="text-gray-700">Partner Name</span>
                <input
                  type="text"
                  name="PartnerName"
                  value={editedDetails.PartnerName || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Company Name</span>
                <input
                  type="text"
                  name="companyName"
                  value={editedDetails.companyName || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Company Location</span>
                <input
                  type="text"
                  name="companyLocation"
                  value={editedDetails.companyLocation || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Company Phone</span>
                <input
                  type="text"
                  name="companyNumber"
                  value={editedDetails.companyNumber || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Personal Phone</span>
                <input
                  type="text"
                  name="personalNumber"
                  value={editedDetails.personalNumber || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Company Email</span>
                <input
                  type="email"
                  name="companyEmailId"
                  value={editedDetails.companyEmailId || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;
