import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const CompanyVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [planner, setPlanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); 

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
              className="w-50 h-40 rounded-md border-2 border-gray-500 mt-2 cursor-pointer"
              onClick={() => setPreviewImage(planner.gstCertificateUrl)}
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
              className="w-50 h-40 rounded-md border-2 border-gray-500 mt-2 cursor-pointer"
              onClick={() => setPreviewImage(planner.incorporationCertificateUrl)}
            />
          ) : (
            <p className="text-gray-600 mt-2">Incorporation Certificate not uploaded.</p>
          )}
        </div>
      </div>

      {/* Approve, Reupload, Decline Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 flex justify-center gap-6">
        {planner.status !== "approved" ? (
          <>
            <button className="bg-green-500 text-white px-6 py-3 text-xl font-semibold rounded-md hover:bg-green-600 transition-all">
              Approve
            </button>
            <button className="bg-orange-300 text-white px-6 py-3 text-xl font-semibold rounded hover:bg-orange-400 transition-all">
              Reupload
            </button>
            <button className="bg-red-500 text-white px-6 py-3 text-xl font-semibold rounded-md hover:bg-red-600 transition-all">
              Decline
            </button>
          </>
        ) : (
          <div className="text-green-300 font-bold">Company verification is Approved.</div>
        )}
      </div>

      {previewImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] rounded-md border-4 border-white" />
        </div>
      )}
    </div>
  );
};

export default CompanyVerification;
