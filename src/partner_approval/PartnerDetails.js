import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";

const statusTabs = {
  pending: ["pending"],
  kyc: ["AKYC", "RKYC", "DKYC"],
  companyVerification: ["ACV", "RCV", "DCV"],
  declined: ["decline"],
  approved: ["approved"],
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
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input

  useEffect(() => {
    fetch("https://shatabackend.in/partners")
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

  // This useEffect now handles filtering by both tab and search query
  useEffect(() => {
    // 1. Filter by the active tab first
    const plannersByTab = planners.filter((planner) =>
      statusTabs[activeTab].includes(planner.status)
    );

    // 2. If there's no search query, just use the tab-filtered list
    if (!searchQuery.trim()) {
      setFilteredPlanners(plannersByTab);
      return;
    }

    // 3. Process the search query for multi-term search
    const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

    // 4. Filter by all search terms
    const searchedPlanners = plannersByTab.filter((planner) => {
      // Combine all searchable fields into one string for easier searching
      const searchableContent = [
        planner.name,
        planner.email,
        planner.mobileNo,
      ]
        .join(" ")
        .toLowerCase();

      // Ensure every search term is included in the partner's details
      return searchTerms.every(term => searchableContent.includes(term));
    });

    setFilteredPlanners(searchedPlanners);
  }, [planners, activeTab, searchQuery]); // Re-run whenever the source data, tab, or query changes

  if (loading) {
    return <LoadingScreen />;
  }

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

        {/* Search Bar */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {filteredPlanners.length > 0 ? (
            filteredPlanners.map((planner) => (
              <div
                key={planner._id}
                className="p-4 rounded-lg shadow-lg shadow-black/25 bg-white border-2 border-white cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => navigate(`/approval-panel/kyc/${planner._id}`)}
              >
                <h3 className="font-bold text-lg">{planner.name || "Not Available"}</h3>
                <p className="text-black/70 text-sm">{planner.companyName || "Not Available"}</p>
                <p className="text-sm">Location: {planner.companyLocation || "Not Available"}</p>
                <p className="text-sm font-semibold">
                  Status: {planner.status}
                </p>
                <button
                  className="px-3 py-1 bg-orange-400 text-black text-sm rounded-md mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/approval-panel/kyc/${planner._id}`);
                  }}
                >
                  Check Details
                </button>
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