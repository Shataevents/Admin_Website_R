import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const UserCount = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openStatus, setOpenStatus] = useState({});
  const [activeTab, setActiveTab] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [bookingDate, setBookingDate] = useState(""); // For Booking Date filter
  const [eventDate, setEventDate] = useState(""); // For Event Date filter
  const navigate = useNavigate();

  // Check if any filters are active
  const areFiltersActive = searchQuery || bookingDate || eventDate;

  // Clear all filters
  const handleClearAll = () => {
    setSearchQuery("");
    setBookingDate("");
    setEventDate("");
  };

  useEffect(() => {
    setIsLoading(true); // Start loading
    Promise.all([
      fetch("https://shatabackend.in/user/all")
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
        }),
      fetch("https://shatabackend.in/bookings")
        .then((response) => response.json())
        .then((data) => {
          setBookings(data || []);
        }),
    ])
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setIsLoading(false)); // End loading
  }, []);

  // Helper to group confirmEvent bookings by date
  const groupConfirmEventByDate = (bookings) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = [], ongoing = [], completed = [];
    bookings.forEach((b) => {
      if (!b.dateFrom) return completed.push(b); // fallback
      const d = new Date(b.dateFrom);
      d.setHours(0, 0, 0, 0);
      if (d > today) upcoming.push(b);
      else if (d.getTime() === today.getTime()) ongoing.push(b);
      else completed.push(b);
    });
    return { upcoming, ongoing, completed };
  };

  // Filtered users based on search and date filters
  const filteredUsers = users.filter((user) => {
    const userBookings = bookings.filter((b) => b.userId === user.id);
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBookingDate =
      !bookingDate ||
      userBookings.some((b) => b.dateFrom && b.dateFrom.split("T")[0] === bookingDate);

    const matchesEventDate =
      !eventDate ||
      userBookings.some((b) => b.eventDate && b.eventDate.split("T")[0] === eventDate);

    return matchesSearch && matchesBookingDate && matchesEventDate;
  });

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />
      {/* Back Button */}
      <div className="lg:max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <button
          onClick={() => navigate(-1)}
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

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex space-x-4">
            <div
              className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-4 h-4 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Section */}
          <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Filters
                </h2>
                {areFiltersActive && (
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-orange-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              {/* Responsive Grid for Filters */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Search Input */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, email, phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                  />
                </div>
                {/* Booking Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                  />
                </div>
                {/* Event Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Container */}
          <div className="lg:max-w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {/* User Details Card */}
            <div className="mb-6 bg-white rounded-lg shadow-md">
              <div className="p-4 sm:p-5 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  User Details
                </h2>
              </div>
              <div className="p-4 sm:p-5 max-h-96 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const userBookings = bookings.filter((b) => b.userId === user.id);
                    // Group bookings by status
                    const pending = userBookings.filter((b) => b.status === "pending");
                    const visited = userBookings.filter((b) => b.status === "visited");
                    const confirmEvent = userBookings.filter((b) => b.status === "confirmEvent");
                    const confirmEventGroups = groupConfirmEventByDate(confirmEvent);
                    const isOpen = selectedUserId === user.id;
                    const userOpenStatus = openStatus[user.id] || {};
                    return (
                      <div key={user.id} className={isOpen ? 'border-2 border-[#ff9000] rounded-lg ' : ''}>
                        <div
                          className={`w-full flex flex-row items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer${isOpen ? '' : ''}`}
                          onClick={() => setSelectedUserId(isOpen ? null : user.id)}
                        >
                          <div className="flex flex-col">
                            <p className="font-medium text-black">{user.name}</p>
                            <p className="text-sm text-black">{user.email}</p>
                            <span className="text-black text-sm sm:text-base">{user.phone}</span>
                          </div>
                          <img
                            src="/icons/chevron-down.svg"
                            alt="Toggle"
                            className={`w-4 h-4 text-orange-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </div>
                        {isOpen && (
                          <div className="p-4 ">
                            {/* Tabs */}
                            <div className="flex space-x-4 mb-4">
                              {[
                                { label: "Booked", key: "Pending" },
                                { label: "Events status", key: "Confirmed" },
                                { label: "Cancelled", key: "Cancelled" },
                              ].map((tab) => (
                                <button
                                  key={tab.key}
                                  className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                                    (activeTab[user.id] || "Pending") === tab.key
                                      ? "bg-[#ff9000] text-black" // 50% opacity
                                      : "bg-transparent text-black hover:bg-[#ff900040]"
                                  }`}
                                  onClick={() => setActiveTab((prev) => ({ ...prev, [user.id]: tab.key }))}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>
                            {/* Tab Content */}
                            {(() => {
                              switch (activeTab[user.id] || "Pending") {
                                case "Pending":
                                  return (
                                    <div>
                                      {pending.length > 0 ? pending.map((booking, idx) => (
                                        <div key={booking._id || idx} className="mb-4 pb-4 border-b border-orange-200 last:border-b-0">
                                          <div className="mb-1"><span className="font-semibold">Event Name:</span> {booking.eventType || "N/A"}</div>
                                          <div className="mb-1"><span className="font-semibold">Date:</span> {booking.dateFrom ? booking.dateFrom.split("T")[0] : "N/A"}</div>
                                          <div className="mb-1"><span className="font-semibold">Status:</span> {booking.status || "N/A"}</div>
                                          <div className="mb-1"><span className="font-semibold">Partner Name:</span> {booking.partnerName || "N/A"}</div>
                                          <div className="mb-1"><span className="font-semibold">Location:</span> {booking.location || "N/A"}</div>
                                        </div>
                                      )) : <div className="text-gray-500">No pending bookings.</div>}
                                    </div>
                                  );
                                case "Confirmed":
                                  return (
                                    <div>
                                      {/* Directly show sub-collapses for Upcoming, Ongoing, Completed */}
                                      <div className="pl-0 pt-0">
                                        {/* Upcoming */}
                                        <div className="mb-2">
                                          <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenStatus((prev) => ({ ...prev, [user.id]: { ...userOpenStatus, confirmEvent: { ...userOpenStatus.confirmEvent, upcoming: !(userOpenStatus.confirmEvent?.upcoming) } } }))}>
                                            <span className="text-sm">Upcoming</span>
                                            <img
                                              src="/icons/chevron-down.svg"
                                              alt="Toggle"
                                              className={`w-4 h-4 text-orange-500 transition-transform duration-300 ${userOpenStatus.confirmEvent?.upcoming ? 'rotate-180' : ''}`}
                                            />
                                          </div>
                                          {userOpenStatus.confirmEvent?.upcoming && (
                                            <div className="pl-4 pt-2">
                                              {confirmEventGroups.upcoming.length > 0 ? confirmEventGroups.upcoming.map((booking, idx) => (
                                                <div key={booking._id || idx} className="mb-4 pb-4 border-b border-orange-200 last:border-b-0">
                                                  <div className="mb-1"><span className="font-semibold">Event Name:</span> {booking.eventType || "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Date:</span> {booking.dateFrom ? booking.dateFrom.split("T")[0] : "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Status:</span> {booking.status || "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Partner Name:</span> {booking.partnerName || "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Location:</span> {booking.location || "N/A"}</div>
                                                </div>
                                              )) : <div className="text-gray-500">No upcoming events.</div>}
                                            </div>
                                          )}
                                        </div>
                                        {/* Ongoing */}
                                        <div className="mb-2">
                                          <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenStatus((prev) => ({ ...prev, [user.id]: { ...userOpenStatus, confirmEvent: { ...userOpenStatus.confirmEvent, ongoing: !(userOpenStatus.confirmEvent?.ongoing) } } }))}>
                                            <span className="text-sm">Ongoing</span>
                                            <img
                                              src="/icons/chevron-down.svg"
                                              alt="Toggle"
                                              className={`w-4 h-4 text-orange-500 transition-transform duration-300 ${userOpenStatus.confirmEvent?.ongoing ? 'rotate-180' : ''}`}
                                            />
                                          </div>
                                          {userOpenStatus.confirmEvent?.ongoing && (
                                            <div className="pl-4 pt-2">
                                              {confirmEventGroups.ongoing.length > 0 ? confirmEventGroups.ongoing.map((booking, idx) => (
                                                <div key={booking._id || idx} className="mb-4 pb-4 border-b border-orange-200 last:border-b-0">
                                                  <div className="mb-1"><span className="font-semibold">Event Name:</span> {booking.eventType || "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Date:</span> {booking.dateFrom ? booking.dateFrom.split("T")[0] : "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Status:</span> {booking.status || "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Partner Name:</span> {booking.partnerName || "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Location:</span> {booking.location || "N/A"}</div>
                                                </div>
                                              )) : <div className="text-gray-500">No ongoing events.</div>}
                                            </div>
                                          )}
                                        </div>
                                        {/* Completed */}
                                        <div className="mb-2">
                                          <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenStatus((prev) => ({ ...prev, [user.id]: { ...userOpenStatus, confirmEvent: { ...userOpenStatus.confirmEvent, completed: !(userOpenStatus.confirmEvent?.completed) } } }))}>
                                            <span className="text-sm">Completed</span>
                                            <img
                                              src="/icons/chevron-down.svg"
                                              alt="Toggle"
                                              className={`w-4 h-4 text-orange-500 transition-transform duration-300 ${userOpenStatus.confirmEvent?.completed ? 'rotate-180' : ''}`}
                                            />
                                          </div>
                                          {userOpenStatus.confirmEvent?.completed && (
                                            <div className="pl-4 pt-2">
                                              {confirmEventGroups.completed.length > 0 ? confirmEventGroups.completed.map((booking, idx) => (
                                                <div key={booking._id || idx} className="mb-4 pb-4 border-b border-orange-200 last:border-b-0">
                                                  <div className="mb-1"><span className="font-semibold">Event Name:</span> {booking.eventType || "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Date:</span> {booking.dateFrom ? booking.dateFrom.split("T")[0] : "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Status:</span> {booking.status || "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Partner Name:</span> {booking.partnerName || "N/A"}</div>
                                                  <div className="mb-1"><span className="font-semibold">Location:</span> {booking.location || "N/A"}</div>
                                                </div>
                                              )) : <div className="text-gray-500">No completed events.</div>}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                case "Cancelled":
                                  // Show all cancelled bookings directly
                                  const cancelled = userBookings.filter((b) => b.status === "Cancel");
                                  return (
                                    <div>
                                      {cancelled.length > 0 ? cancelled.map((booking, idx) => (
                                        <div key={booking._id || idx} className="mb-4 pb-4 border-b border-orange-200 last:border-b-0">
                                          <div className="mb-1"><span className="font-semibold">Event Name:</span> {booking.eventType || "N/A"}</div>
                                          <div className="mb-1"><span className="font-semibold">Date:</span> {booking.dateFrom ? booking.dateFrom.split("T")[0] : "N/A"}</div>
                                          <div className="mb-1"><span className="font-semibold">Status:</span> {booking.status || "N/A"}</div>
                                          <div className="mb-1"><span className="font-semibold">Partner Name:</span> {booking.partnerName || "N/A"}</div>
                                          <div className="mb-1"><span className="font-semibold">Location:</span> {booking.location || "N/A"}</div>
                                        </div>
                                      )) : <div className="text-gray-500">No cancelled bookings.</div>}
                                    </div>
                                  );
                                default:
                                  return null;
                              }
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-600">No users found.</p>
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

            {/* Total Users and Events Summary Card */}
            <div className="lg:max-w-full mx-auto mt-6">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  Summary
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Users */}
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
                    <p className="text-2xl font-bold text-orange-500">{users.length}</p>
                  </div>
                  {/* Total Booked Events */}
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-gray-800">Booked Events</h3>
                    <p className="text-2xl font-bold text-orange-500">
                      {bookings.filter((b) => b.status === "pending").length}
                    </p>
                  </div>
                  {/* Total Confirmed Events */}
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-gray-800">Confirmed Events</h3>
                    <p className="text-2xl font-bold text-orange-500">
                      {bookings.filter((b) => b.status === "confirmEvent").length}
                    </p>
                  </div>
                  {/* Total Cancelled Events */}
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-gray-800">Cancelled Events</h3>
                    <p className="text-2xl font-bold text-orange-500">
                      {bookings.filter((b) => b.status === "Cancel").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCount;