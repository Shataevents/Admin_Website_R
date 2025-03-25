import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const statusTabs = {
  pending: ["pending"],
  kyc: ["AKYC", "RKYC", "DKYC"],
  companyVerification: ["ACV", "RCV", "DCV"],
  declined: ["Decline"],
  approved: ["Approve"],
};

const statusLabels = {
  pending: "Pending",
  kyc: "KYC",
  companyVerification: "Company Verification",
  declined: "Declined",
  approved: "Approved",
};

const PartnerDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [planners, setPlanners] = useState([]);
  const [filteredPlanners, setFilteredPlanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://shata-app-alb-933188665.ap-south-2.elb.amazonaws.com/partners")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        setPlanners(data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching partner details:", error);
        setPlanners([]);
      });
  }, []);

  useEffect(() => {
    setFilteredPlanners(
      planners.filter((planner) => statusTabs[activeTab].includes(planner.status))
    );
  }, [planners, activeTab]);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex flex-wrap bg-white text-sm p-2 rounded-lg w-full items-center justify-center mx-auto">
          {Object.entries(statusLabels).map(([key, label]) => (
            <div
              key={key}
              className={`px-3 py-1 mx-1 cursor-pointer transition-all duration-300 whitespace-nowrap text-xs text-center ${
                activeTab === key ? "bg-black text-white font-bold rounded-full" : "text-black"
              }`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {loading ? (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center text-gray-600 text-xl">
              Loading...
            </div>
          ) : filteredPlanners.length > 0 ? (
            filteredPlanners.map((planner, index) => (
              <div
                key={index}
                className="p-4 rounded-lg shadow-lg shadow-black/25 bg-white border-2 border-white"
              >
                <h3 className="font-bold text-lg">{planner.name || "Not Available"}</h3>
                <p className="text-black/70 text-sm">{planner.companyName || "Not Available"}</p>
                <p className="text-sm">Location: {planner.companyLocation || "Not Available"}</p>
                <p className="text-sm font-semibold">
                  Status: {planner.status}
                </p>
                {activeTab !== "declined" && (
                  <button
                    className="px-3 py-1 bg-orange-400 text-black text-sm rounded-md mt-2"
                    onClick={() => navigate(`/partner-details/kyc/${planner._id}`)}
                  >
                    Check Details
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center text-gray-600 text-xl">
              No partner found.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PartnerDetails;
