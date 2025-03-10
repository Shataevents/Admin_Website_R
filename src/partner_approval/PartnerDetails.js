import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const PartnerDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);

  const planners = [
    {
      name: "John Doe",
      company: "ABC Corp",
      companyLocation: "New York, USA",
      personalPhone: "+1 234 567 890",
      companyPhone: "+1 987 654 321",
      status: "Approved",
    },
    {
      name: "Jane Smith",
      company: "XYZ Inc",
      companyLocation: "San Francisco, USA",
      personalPhone: "+1 555 123 456",
      companyPhone: "+1 444 654 789",
      status: "Pending",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex bg-black text-xl p-2 rounded-lg w-full items-center justify-center mx-auto">
          {["Pending", "Approved"].map((tab, index) => (
            <div
              key={index}
              className={`px-6 py-2 mx-1 cursor-pointer transition-all duration-300 ${
                activeTab === index + 1 ? "bg-white text-black font-bold rounded-full" : "text-white"
              }`}
              onClick={() => setActiveTab(index + 1)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {planners
            .filter((planner) => (activeTab === 1 ? planner.status === "Pending" : planner.status === "Approved"))
            .map((planner, index) => (
              <div key={index} className=" p-4 rounded-lg shadow-lg bg-black text-white border-2 border-white">
                <h3 className="font-bold text-3xl">{planner.name}</h3>
                <p className="text-gray-300 text-xl">{planner.company}</p>
                <p className="text-xl">Location: {planner.companyLocation}</p>

                {/* Show Check Details button only when status is Pending */}
                {planner.status === "Pending" && (
                  <button
                    className="px-4 py-2 bg-white text-black text-xl items-end justify-end rounded mt-2"
                    onClick={() => navigate(`/partner-details/kyc`, { state: planner })}
                  >
                    Check Details
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default PartnerDetails;
