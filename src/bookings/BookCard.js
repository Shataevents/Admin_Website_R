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
  const [partnersList, setPartnersList] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Helper function to get partner name safely
  const getPartnerName = (partner) => {
    return partner?.PartnerName || partner?.partnerName || partner?.name || partner?.fullName || 'Unknown Partner';
  };

  // Helper function to get partner phone safely
  const getPartnerPhone = (partner) => {
    return partner?.personalNumber || partner?.phone || partner?.mobile || partner?.mobileNo || partner?.phoneNumber || 'No Phone';
  };

  // Helper function to determine services based on booking criteria
  const getBookingServices = (booking) => {
    const services = [];
    
    // Check if photographyEvent matches eventId
    if (booking?.photographyEvent && booking?.eventId && booking.photographyEvent === booking.eventId) {
      services.push("Photography");
    }
    
    // Check if cateringEvent matches eventId
    if (booking?.cateringEvent && booking?.eventId && booking.cateringEvent === booking.eventId) {
      services.push("Catering");
    }
    
    // If neither photography nor catering matches, then it's an Event service
    if (services.length === 0) {
      services.push("Event");
    }
    
    return services;
  };

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
    fetchPartnersList();
  };

  const fetchPartnersList = async () => {
    setLoadingPartners(true);
    try {
      const response = await axios.get("https://shatabackend.in/partners");
      const partnersData = response.data;
      console.log("Partners data:", partnersData); // Debug log
      
      // Filter partners to only show approved ones
      const approvedPartners = partnersData.filter(partner => partner.status === "approved");
      console.log("Approved partners:", approvedPartners); // Debug log
      setPartnersList(approvedPartners);
      
      // If there's a current partner in the booking, set it as selected
      if (booking?.partnerId) {
        const currentPartner = approvedPartners.find(partner => partner._id === booking.partnerId);
        console.log("Current partner found:", currentPartner); // Debug log
        if (currentPartner) {
          setSelectedPartner(booking.partnerId);
          setEditedDetails({
            partnerId: currentPartner._id,
            partnerName: getPartnerName(currentPartner),
            partnerMobile: getPartnerPhone(currentPartner)
          });
        }
      }
    } catch (error) {
      console.error("Error fetching partners list:", error);
      setError("Failed to fetch partners list.");
    } finally {
      setLoadingPartners(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPartner("");
    setIsManualEntry(false);
    setEditedDetails({});
    setPartnersList([]);
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    setEditedDetails({ ...editedDetails, [e.target.name]: e.target.value });
  };

  const handlePartnerSelection = (e) => {
    const partnerId = e.target.value;
    setSelectedPartner(partnerId);
    
    if (partnerId === "manual") {
      setIsManualEntry(true);
      setEditedDetails({});
    } else if (partnerId) {
      setIsManualEntry(false);
      const selectedPartnerData = partnersList.find(partner => partner._id === partnerId);
      console.log("Selected partner data:", selectedPartnerData); // Debug log
      if (selectedPartnerData) {
        setEditedDetails({
          partnerId: selectedPartnerData._id,
          partnerName: getPartnerName(selectedPartnerData),
          partnerMobile: getPartnerPhone(selectedPartnerData)
        });
      }
    } else {
      setIsManualEntry(false);
      setEditedDetails({});
    }
  };

  const handleSave = () => {
    if (selectedPartner && selectedPartner !== "manual") {
      // Update booking with selected partner
      const selectedPartnerData = partnersList.find(partner => partner._id === selectedPartner);
      if (selectedPartnerData) {
        const updatedBookingData = {
          ...booking,
          partnerId: selectedPartnerData._id,
          partnerName: getPartnerName(selectedPartnerData),
          partnerMobile: getPartnerPhone(selectedPartnerData),
        };
        
        axios
          .patch(`https://shatabackend.in/bookings/${booking._id}`, updatedBookingData)
          .then(() => {
            console.log("Partner updated successfully!");
            // Update local booking object
            booking.partnerId = selectedPartnerData._id;
            booking.partnerName = getPartnerName(selectedPartnerData);
            booking.partnerMobile = getPartnerPhone(selectedPartnerData);
            setReload(!reload);
            
            // Show success animation
            setShowSuccess(true);
            setTimeout(() => {
              handleClose();
            }, 1500);
          })
          .catch((error) => {
            console.error("Error updating partner:", error);
            setErrorMessage("Error updating partner. Please try again.");
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
          });
      }
    } else if (isManualEntry && Object.keys(editedDetails).length > 0) {
      // Handle manual entry as before
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
          
          // Show success animation
          setShowSuccess(true);
          setTimeout(() => {
            handleClose();
          }, 1500);
        })
        .catch((error) => {
          console.error("Error saving details:", error);
          setErrorMessage("Error saving details. Please try again.");
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        });
    } else {
      setErrorMessage("Please select a partner or fill in the manual details to save.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
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
                  {getBookingServices(booking).join(", ") || "N/A"}
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
                  <strong>Company Service:</strong>{" "}
                  {partnerDetails.servicesSelected ||
                    partnerDetails.servicesSelected ||
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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
            
            {/* Success Animation Overlay */}
            {showSuccess && (
              <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center rounded-lg z-10">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <svg 
                    className="w-8 h-8 text-white animate-bounce" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-green-600 font-medium text-lg">Partner Updated Successfully!</p>
              </div>
            )}

            {/* Error Animation Overlay */}
            {showError && (
              <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center rounded-lg z-10">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <svg 
                    className="w-8 h-8 text-white animate-bounce" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-red-600 font-medium text-lg text-center px-4">{errorMessage}</p>
              </div>
            )}
            
            <h3 className="text-xl font-semibold mb-4">
              Edit Event Planner Details
            </h3>
            
            {/* Partner Selection Dropdown */}
            <div className="mb-4">
              <label className="block">
                <span className="text-gray-700 font-medium">Select Partner</span>
                <select
                  value={selectedPartner}
                  onChange={handlePartnerSelection}
                  className="w-full p-2 border rounded mt-1"
                  disabled={loadingPartners}
                >
                  <option value="">-- Select a Partner --</option>
                  {loadingPartners ? (
                    <option value="">Loading partners...</option>
                  ) : (
                    <>
                      {/* Show current partner first if it exists and is in the list */}
                      {booking?.partnerId && partnersList.find(p => p._id === booking.partnerId) && (
                        <option value={booking.partnerId} style={{backgroundColor: '#e3f2fd'}}>
                          ✓ {getPartnerName(partnersList.find(p => p._id === booking.partnerId))} - {getPartnerPhone(partnersList.find(p => p._id === booking.partnerId))} (Current)
                        </option>
                      )}
                      {/* Show all other partners */}
                      {partnersList
                        .filter(partner => partner._id !== booking?.partnerId)
                        .map((partner) => (
                          <option key={partner._id} value={partner._id}>
                            {getPartnerName(partner)} - {getPartnerPhone(partner)}
                          </option>
                        ))}
                    </>
                  )}
                  <option value="manual">+ Enter Manual Details</option>
                </select>
              </label>
              {/* Show current partner info if it's not in the main partners list */}
              {booking?.partnerId && !partnersList.find(p => p._id === booking.partnerId) && partnerDetails && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <strong>Current Partner:</strong> {partnerDetails.PartnerName || booking.partnerName} - {partnerDetails.personalNumber || booking.partnerMobile}
                  <br />
                  <span className="text-yellow-600">Note: This partner is not in the main partners list (possibly a temp partner)</span>
                </div>
              )}
            </div>

            {/* Show selected partner preview */}
            {selectedPartner && selectedPartner !== "manual" && !isManualEntry && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Selected Partner:</h4>
                <p><strong>Name:</strong> {editedDetails.partnerName}</p>
                <p><strong>Phone:</strong> {editedDetails.partnerMobile}</p>
              </div>
            )}

            {/* Manual Entry Form */}
            {isManualEntry && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Manual Partner Details</h4>
                <label className="block">
                  <span className="text-gray-700">Partner Name</span>
                  <input
                    type="text"
                    name="PartnerName"
                    value={editedDetails.PartnerName || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter partner name"
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
                    placeholder="Enter company name"
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
                    placeholder="Enter company location"
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
                    placeholder="Enter company phone"
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
                    placeholder="Enter personal phone"
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
                    placeholder="Enter company email"
                  />
                </label>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!selectedPartner}
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