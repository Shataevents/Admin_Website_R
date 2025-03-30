import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const UserCount = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetch("http://shatabackend.in/user/all")
      .then((response) => response.json())
      .then((data) => {
        const userData = data.data || [];
        const formattedUsers = userData.map((user, index) => ({
          id: user._id,
          name: user.fullName || `User ${index + 1}`,
          email: user.email || "No email provided",
          phone: user.phone || "No phone provided",
        }));
        setUsers(formattedUsers);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Function to navigate back to the previous section
  const handleBack = () => {
    navigate(-1); // Go back to the previous page in history
    // Alternatively, you can navigate to a specific route:
    // navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
        <Navbar/>
      {/* Back Button */}
      <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
        User Dashboard
      </h1>

      {/* Main Container */}
      <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* User Details Card */}
        <div className="mb-6 bg-white rounded-lg shadow-md">
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              User Details
            </h2>
          </div>
          <div className="p-4 sm:p-5 max-h-96 overflow-y-auto">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="text-gray-600 mb-2 sm:mb-0">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base">
                    {user.phone}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Loading users...</p>
            )}
          </div>
        </div>

        {/* Revenue and User Services Cards */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Revenue Card */}
          <div className="flex-1 mb-6 md:mb-0 bg-white rounded-lg shadow-md">
            <div className="p-4 sm:p-5 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Revenue
              </h2>
            </div>
            <div className="p-4 sm:p-5 text-gray-600">
              <p>No revenue data available at this time.</p>
            </div>
          </div>

          {/* User Services Card */}
          <div className="flex-1 bg-white rounded-lg shadow-md">
            <div className="p-4 sm:p-5 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                User Services
              </h2>
            </div>
            <div className="p-4 sm:p-5 text-gray-600">
              <p>No user services data available at this time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCount;