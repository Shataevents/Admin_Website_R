import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const PartnerDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [planners, setPlanners] = useState([]);
  const [filteredPlanners, setFilteredPlanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "http://shata-app-alb-933188665.ap-south-2.elb.amazonaws.com/partners"
    )
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
      planners.filter((planner) =>
        activeTab === 1
          ? planner.status === "pending"
          : planner.status === "approved"
      )
    );
  }, [planners, activeTab]);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex bg-white text-xl p-2 rounded-lg w-full items-center justify-center mx-auto">
          {["Pending", "Approved"].map((tab, index) => (
            <div
              key={index}
              className={`px-6 py-2 mx-1 cursor-pointer transition-all duration-300 ${
                activeTab === index + 1
                  ? "bg-black text-white font-bold rounded-full"
                  : "text-black"
              }`}
              onClick={() => setActiveTab(index + 1)}
            >
              {tab}
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
                <h3 className="font-bold text-3xl">{planner.name}</h3>
                <p className="text-black/70 text-xl">{planner.company}</p>
                <p className="text-xl">Location: {planner.companyLocation}</p>

                {/* Show Check Details button only when status is Pending */}
                {planner.status === "Pending" && (
                  <button
                    className="px-4 py-2 bg-orange-400 text-black text-xl items-end justify-end rounded-md mt-2"
                    onClick={() =>
                      navigate(`/partner-details/kyc/${planner.id}`)
                    }
                  >
                    Check Details
                  </button>
                )}
              </div>
            ))
          ) : !loading && planners.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center text-gray-600 text-xl">
              No partner found.
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default PartnerDetails;
