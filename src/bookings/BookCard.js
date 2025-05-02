import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen"; // Import the LoadingScreen component

const BookCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state || {};
  const [status, setStatus] = useState("upcoming");
  const [partnerDetails, setPartnerDetails] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [reload, setReload] = useState(false);

  const statusOptions = [
    "to visit",
    "in progress",
    "confirmed",
    "cancelled",
    "upcoming",
    "completed",
  ];

  useEffect(() => {
    console.log("Booking object:", booking);
    if (!booking?.partnerId || !booking?.userId) {
      console.log("Missing partnerId or userId:", booking);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchPartnerDetails = axios
      .get(`https://shatabackend.in/partners/${booking?.partnerId}`)
      .then((response) => {
        console.log("Partner response:", response.data);
        setPartnerDetails(response.data);
      })
      .catch((err) => {
        return axios
          .get(`https://shatabackend.in/temp-partner/${booking?.partnerId}`)
          .then((response) => {
            console.log("Temp partner response:", response.data);
            setPartnerDetails(response.data);
          })
          .catch((error) => {
            console.error("Partner fetch error:", error);
            setError("Failed to fetch partner details.");
          });
      });

    const fetchClientDetails = axios
      .get(`https://shatabackend.in/user/${booking?.userId}`)
      .then((response) => {
        console.log("Client response:", response.data);
        setClientDetails(response.data); // Set the entire response
      })
      .catch((error) => {
        console.error("Client fetch error:", error);
        setError("Failed to fetch client details.");
      });

    Promise.all([fetchPartnerDetails, fetchClientDetails]).finally(() => {
      setLoading(false);
    });
  }, [booking, reload]);

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
        axios
          .get(`https://shatabackend.in/bookings/${booking._id}`)
          .then((existingBookingResponse) => {
            const existingBookingData = existingBookingResponse.data;
            const updatedData = {
              ...existingBookingData,
              partnerId: response.data._id,
              partnerName: response.data.PartnerName,
              partnerMobile: response.data.personalNumber,
            };
            axios
              .patch(`https://shatabackend.in/bookings/${booking._id}`, updatedData)
              .then(() => {
                console.log("Partner ID updated successfully!");
              })
              .catch((error) => {
                console.error("Error updating Partner ID:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching existing booking data:", error);
          });
        booking.partnerId = response.data._id;
        setReload(!reload);
        alert("Details saved successfully!");
        setEditedDetails({});
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error saving details:", error);
        alert("Error saving details. Please try again.");
      });
  };

  if (loading) {
    return <LoadingScreen />;
  }

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
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : clientDetails && clientDetails.data ? (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {clientDetails.data.fullName || "N/A"}
                </p>
                <p>
                  <strong>Phone Number:</strong> {clientDetails.data.phone || "N/A"}
                </p>
                <p>
                  <strong>Event Date:</strong>{" "}
                  {booking?.dateFrom?.split("T")[0] || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {clientDetails.data.email || "N/A"}
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
            ) : (
              <p className="text-gray-500">Client details not found.</p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">
              Event Planner Details
            </h3>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : partnerDetails ? (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong>{" "}
                  {partnerDetails.PartnerName || booking.partnerName || "N/A"}
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
                  {partnerDetails.personalNumber ||
                    booking.partnerMobile ||
                    "N/A"}
                </p>
                <p>
                  <strong>Company Phone:</strong>{" "}
                  {booking.plannerDetails?.companyPhone ||
                    partnerDetails.companyNumber ||
                    "N/A"}
                </p>
                <p>
                  <strong>Company Email:</strong>{" "}
                  {partnerDetails.companyEmail ||
                    partnerDetails.companyEmailId ||
                    "N/A"}
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