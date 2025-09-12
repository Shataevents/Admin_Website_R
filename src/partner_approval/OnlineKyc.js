import React, { useState, useEffect, useRef } from "react";
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
  const [reuploadFileTypes, setReuploadFileTypes] = useState([]); // Multi-select for file types
  const [showDropdown, setShowDropdown] = useState(false); // For custom dropdown
  const dropdownRef = useRef(null);
  const [declineFileTypes, setDeclineFileTypes] = useState([]); // Add this state
  const [showDeclineDropdown, setShowDeclineDropdown] = useState(false); // For custom dropdown
  const declineDropdownRef = useRef(null); // Ref for decline dropdown
  const isSuperAdmin = new URLSearchParams(location.search).get("superAdmin") === "true";

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Close decline dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (declineDropdownRef.current && !declineDropdownRef.current.contains(event.target)) {
        setShowDeclineDropdown(false);
      }
    }
    if (showDeclineDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeclineDropdown]);

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
    if (!reuploadFileTypes.length) {
      alert("Please select at least one file to be reuploaded.");
      return;
    }
    if (!reuploadReason.trim()) {
      alert("Please enter a reason for reuploadation.");
      return;
    }

    // Compose the message as "AADHAR, PANCARD : reason"
    const fileLabels = {
      aadhar: "AADHAR",
      pancard: "PANCARD",
      video: "VIDEO",
    };
    const selectedLabels = reuploadFileTypes.map((type) => fileLabels[type] || type.toUpperCase()).join(", ");
    const reasonMessage = `${selectedLabels} : ${reuploadReason}`;

    fetch(`https://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`,
      },
      body: JSON.stringify({
        status: "RKYC",
        kycStatus: "RKYC",
        reason: reasonMessage,
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
        setReuploadFileTypes([]);
        setReuploadReason("");
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error marking planner for reupload:", error);
        alert("Failed to mark planner for reupload.");
      });
  };

  const handleDecline = () => {
    if (!declineFileTypes.length) {
      alert("Please select at least one file to decline.");
      return;
    }
    if (!declineReason.trim()) {
      alert("Please enter a reason for declining.");
      return;
    }
    const fileLabels = {
      aadhar: "AADHAR",
      pancard: "PANCARD",
      video: "VIDEO",
    };
    const selectedLabels = declineFileTypes.map((type) => fileLabels[type] || type.toUpperCase()).join(", ");
    const reasonMessage = `${selectedLabels} : ${declineReason}`;

    fetch(`https://shatabackend.in/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_TOKEN_HERE`,
      },
      body: JSON.stringify({
        status: "DKYC",
        kycStatus: "DKYC",
        reason: reasonMessage, // <-- removed DECLINE:-
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
        setDeclineFileTypes([]);
        setDeclineReason("");
        setShowDeclineDropdown(false);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error declining planner:", error);
        alert("Failed to decline planner.");
      });
  };

  // Helper to get file extension
  const getFileExtension = (url) => {
    if (!url) return "";
    return url.split(".").pop().toLowerCase().split(/\#|\?/)[0];
  };

  // Helper to check file type
  const getFileType = (url) => {
    const ext = getFileExtension(url);
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx"].includes(ext)) return "doc";
    return "other";
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
          )
          }
        </div>

        <div className="bg-white border-2 border-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold mb-4">Uploaded Documents</h3>
          <div className="mb-4">
            <h4 className="text-xl font-bold">Aadhar Card</h4>
            {planner.aadharUrl ? (
              <div
                className="w-50 h-40 rounded-md border-2 mt-2 cursor-pointer flex items-center justify-center bg-gray-50"
                onClick={() => setPreviewImage(planner.aadharUrl)}
                style={{ minHeight: "10rem" }}
              >
                {getFileType(planner.aadharUrl) === "image" ? (
                  <img src={planner.aadharUrl} alt="Aadhar Card" className="max-h-40 max-w-full object-contain" />
                ) : getFileType(planner.aadharUrl) === "pdf" ? (
                  <span className="text-red-600 font-bold text-lg">PDF Preview</span>
                ) : getFileType(planner.aadharUrl) === "doc" ? (
                  <span className="text-blue-600 font-bold text-lg">DOC Preview</span>
                ) : (
                  <span className="text-gray-600 font-bold text-lg">File Preview</span>
                )}
              </div>
            ) : (
              <p className="text-gray-600 mt-2">Aadhar Card not uploaded.</p>
            )}
          </div>
          <div className="mb-4">
            <h4 className="text-xl font-bold">PAN Card</h4>
            {planner.panCardUrl ? (
              <div
                className="w-50 h-40 rounded-md border-2 mt-2 cursor-pointer flex items-center justify-center bg-gray-50"
                onClick={() => setPreviewImage(planner.panCardUrl)}
                style={{ minHeight: "10rem" }}
              >
                {getFileType(planner.panCardUrl) === "image" ? (
                  <img src={planner.panCardUrl} alt="PAN Card" className="max-h-40 max-w-full object-contain" />
                ) : getFileType(planner.panCardUrl) === "pdf" ? (
                  <span className="text-red-600 font-bold text-lg">PDF Preview</span>
                ) : getFileType(planner.panCardUrl) === "doc" ? (
                  <span className="text-blue-600 font-bold text-lg">DOC Preview</span>
                ) : (
                  <span className="text-gray-600 font-bold text-lg">File Preview</span>
                )}
              </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Select file(s) to reupload</h2>
            <div className="mb-4" ref={dropdownRef}>
              <label className="block mb-2 font-semibold">Files to reupload</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-2 border rounded-md bg-white text-left"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  {reuploadFileTypes.length === 0
                    ? "Select file(s)..."
                    : reuploadFileTypes
                        .map((type) =>
                          ({
                            aadhar: "AADHAR",
                            pancard: "PANCARD",
                            video: "VIDEO",
                          }[type])
                        )
                        .join(", ")}
                  <span className="float-right">&#9662;</span>
                </button>
                {showDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
                    {["aadhar", "pancard", "video"].map((type) => (
                      <div
                        key={type}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                          reuploadFileTypes.includes(type) ? "bg-gray-200" : ""
                        }`}
                        onClick={() => {
                          setReuploadFileTypes((prev) =>
                            prev.includes(type)
                              ? prev.filter((t) => t !== type)
                              : [...prev, type]
                          );
                          setShowDropdown(false); // Close dropdown after selection
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={reuploadFileTypes.includes(type)}
                          readOnly
                          className="mr-2"
                        />
                        {({
                          aadhar: "AADHAR",
                          pancard: "PANCARD",
                          video: "VIDEO",
                        }[type])}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Show selected options below dropdown */}
              {reuploadFileTypes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {reuploadFileTypes.map((type) => (
                    <span
                      key={type}
                      className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {{
                        aadhar: "AADHAR",
                        pancard: "PANCARD",
                        video: "VIDEO",
                      }[type]}
                      <button
                        className="ml-2 text-orange-700 hover:text-orange-900 font-bold"
                        onClick={() =>
                          setReuploadFileTypes((prev) => prev.filter((t) => t !== type))
                        }
                        title="Remove"
                        type="button"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {reuploadFileTypes.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-2">Enter the reason for reuploadation</h2>
                <textarea
                  className="w-full p-2 border rounded-md mb-4"
                  rows="4"
                  placeholder="Enter the reason here..."
                  value={reuploadReason}
                  onChange={(e) => setReuploadReason(e.target.value)}
                ></textarea>
              </>
            )}
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setShowReuploadPopup(false);
                  setReuploadFileTypes([]);
                  setReuploadReason("");
                  setShowDropdown(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                onClick={handleReupload}
                disabled={!reuploadFileTypes.length || !reuploadReason.trim()}
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
            <h2 className="text-2xl font-bold mb-4">Select file(s) to decline</h2>
            <div className="mb-4" ref={declineDropdownRef}>
              <label className="block mb-2 font-semibold">Files to decline</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-2 border rounded-md bg-white text-left"
                  onClick={() => setShowDeclineDropdown((prev) => !prev)}
                >
                  {declineFileTypes.length === 0
                    ? "Select file(s)..."
                    : declineFileTypes
                        .map((type) =>
                          ({
                            aadhar: "AADHAR",
                            pancard: "PANCARD",
                            video: "VIDEO",
                          }[type])
                        )
                        .join(", ")}
                  <span className="float-right">&#9662;</span>
                </button>
                {showDeclineDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
                    {["aadhar", "pancard", "video"].map((type) => (
                      <div
                        key={type}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                          declineFileTypes.includes(type) ? "bg-gray-200" : ""
                        }`}
                        onClick={() => {
                          setDeclineFileTypes((prev) =>
                            prev.includes(type)
                              ? prev.filter((t) => t !== type)
                              : [...prev, type]
                          );
                          setShowDeclineDropdown(false); // Close dropdown after selection
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={declineFileTypes.includes(type)}
                          readOnly
                          className="mr-2"
                        />
                        {({
                          aadhar: "AADHAR",
                          pancard: "PANCARD",
                          video: "VIDEO",
                        }[type])}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Show selected options below dropdown */}
              {declineFileTypes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {declineFileTypes.map((type) => (
                    <span
                      key={type}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {{
                        aadhar: "AADHAR",
                        pancard: "PANCARD",
                        video: "VIDEO",
                      }[type]}
                      <button
                        className="ml-2 text-red-700 hover:text-red-900 font-bold"
                        onClick={() =>
                          setDeclineFileTypes((prev) => prev.filter((t) => t !== type))
                        }
                        title="Remove"
                        type="button"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {declineFileTypes.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-2">Enter the reason for declining</h2>
                <textarea
                  className="w-full p-2 border rounded-md mb-4"
                  rows="4"
                  placeholder="Enter the reason here..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                ></textarea>
              </>
            )}
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setShowDeclinePopup(false);
                  setDeclineFileTypes([]);
                  setDeclineReason("");
                  setShowDeclineDropdown(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDecline}
                disabled={!declineFileTypes.length || !declineReason.trim()}
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
          <div className="flex-1 overflow-auto flex items-center justify-center bg-white relative py-6">
            <button
              className="absolute top-6 right-6 w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center text-lg font-bold transition-colors z-10"
              onClick={closePreviewImage}
            >
              <GrClose />
            </button>
            {getFileType(previewImage) === "image" ? (
              <img src={previewImage} alt="Preview" className="max-w-full max-h-full object-contain shadow-lg" />
            ) : getFileType(previewImage) === "pdf" ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(previewImage)}&embedded=true`}
                title="PDF Preview"
                className="w-[90vw] h-[80vh] border-2 rounded shadow-lg"
              />
            ) : getFileType(previewImage) === "doc" ? (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewImage)}`}
                title="DOC Preview"
                className="w-[90vw] h-[80vh] border-2 rounded shadow-lg"
              />
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-gray-700 mb-4">
                  Preview not supported. <br />
                  <a href={previewImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Download File
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineKyc;