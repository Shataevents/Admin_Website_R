import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen'; // Import the LoadingScreen component

function BookingDetails() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [partners, setPartners] = useState([]); // Renamed from planners to partners for clarity
  const [dateFilter, setDateFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all'); // Renamed from plannerFilter
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true); // Add loading state
  const [activeTab, setActiveTab] = useState('Booked'); // Default active tab
  const [fromDate, setFromDate] = useState(''); // New state for fromDate
  const [toDate, setToDate] = useState(''); // New state for toDate
  const [categoryFilter, setCategoryFilter] = useState('all'); // New state for categoryFilter

  // Function to map eventType to service category
  const getServiceCategory = (eventType) => {
    const cateringTypes = [
      "Shushi Counter",
      "BBQ Grill Station",
      "Premium Wedding Catering",
      "Desert Counter",
      "Live Pasta Station"
    ];
    const photographyTypes = [
      "Maternity",
      "Post Wedding",
      "Professional Photography",
      "Self Photography",
      "Pre Wedding",
      "Wedding Photography",
      "Baby Shower"
    ];

    if (!eventType) {
      console.warn(`Missing eventType in booking`);
      return "Events";
    }

    if (cateringTypes.includes(eventType)) return "Catering";
    if (photographyTypes.includes(eventType)) return "Photography";
    return "Events";
  };

  // Function to filter bookings based on the active tab
  const getFilteredBookingsByTab = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case 'Booked':
        return bookings.filter(booking =>
          ['pending', 'partnerVisited', 'userConfirmVisit', 'visited', 'cancelVisit'].includes(booking.status)
        );
      case 'Inprogress':
        return bookings.filter(
          booking =>
            booking.status === 'confirmEvent' &&
            new Date(booking.dateFrom) <= today &&
            new Date(booking.dateTo) >= today
        );
      case 'Completed':
        return bookings.filter(booking => booking.status === 'completed');
      case 'Upcoming':
        return bookings.filter(
          booking =>
            booking.status === 'confirmEvent' &&
            new Date(booking.dateFrom) > today
        );
      case 'Cancelled':
        return bookings.filter(booking =>
          ['Cancel', 'cancel'].includes(booking.status)
        );
      default:
        return bookings;
    }
  };

  const filteredBookingsByTab = getFilteredBookingsByTab();

  // Fetch booking details
  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    fetch("https://shatabackend.in/bookings")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("All booking data fetched:", data); // Log all bookings
        const uniqueEventTypes = [...new Set(data.map(booking => booking.eventType))];
        console.log("Unique eventType values from backend:", uniqueEventTypes);
        const uniquePartners = [...new Set(data.map(booking => booking.partnerName).filter(partner => partner && typeof partner === 'string'))];
        console.log("Unique partnerName values from bookings:", uniquePartners);
        const enhancedBookings = data.map(booking => ({
          ...booking,
          derivedService: getServiceCategory(booking.eventType)
        }));
        setBookings(enhancedBookings);
      })
      .catch((error) => {
        console.error("Error fetching booking details:", error);
        setBookings([]);
      })
      .finally(() => setLoading(false)); // Set loading to false after fetching
  }, []);

  // Fetch partner names
  useEffect(() => {
    fetch("https://shatabackend.in/partners")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Partners data fetched successfully:", data);
        const partnerNames = data
          .filter(partner => partner.name && typeof partner.name === 'string')
          .map(partner => partner.name.trim());
        console.log("Fetched partner names (trimmed):", partnerNames);
        if (partnerNames.length === 0) {
          console.warn("No valid partner names found in partners API response");
        }
        setPartners(partnerNames);
      })
      .catch((error) => {
        console.error("Error fetching partners data:", error);
        setPartners([]);
      });
  }, []);

  // Fallback to unique partners from bookings
  const uniquePartners = partners.length > 0 
    ? partners 
    : [...new Set(bookings?.map(booking => booking.partnerName).filter(partner => partner && typeof partner === 'string'))];

  const handleCardClick = (booking) => {
    navigate('/booking-details/card', { state: booking });
  };

  if (loading) {
    return <LoadingScreen />; // Show loading screen while data is being fetched
  }

  return (
    <section className="bg-[#fcfcfc] flex items-center justify-center w-full">
      <div className="w-full">
        <Navbar />
        <h2 className="text-2xl font-bold my-6 text-center">Booking Details</h2>

        {/* Tabs Section */}
        <div className="flex justify-center space-x-4 mb-6">
          {['Booked', 'Inprogress', 'Completed', 'Upcoming', 'Cancelled'].map(tab => (
            <button
              key={tab}
              className={`px-4  rounded-full ${
                activeTab === tab ? 'bg-orange-500 text-black' : 'bg-white text-orange-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter and Sort Section */}
        <div className="bg-white mx-1 p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Date</label>
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Dates</option>
                <option value="thisWeek">This Week</option>
                <option value="nextWeek">Next Week</option>
                <option value="thisMonth">This Month</option>
                <option value="nextMonth">Next Month</option>
              </select>
            </div>

            {/* New Booked Date Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Booked Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="From Date"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="To Date"
              />
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Service</label>
              <select 
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Services</option>
                <option value="Catering">Catering</option>
                <option value="Photography">Photography</option>
                <option value="Events">Events</option>
              </select>
            </div>

            {/* New Categories Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Categories</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Categories</option>
                <option value="Catering">Catering</option>
                <option value="Photography">Photography</option>
                <option value="Events">Events</option>
              </select>
            </div>

            {/* Partner Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Partner</label>
              <select 
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Partners</option>
                {uniquePartners?.map((partner, index) => (
                  <option key={index} value={partner}>{partner}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort by Date</label>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Booking Cards Section */}
        <div className="grid px-3 grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {filteredBookingsByTab.length > 0 ? (
            filteredBookingsByTab.map((booking, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 cursor-pointer hover:shadow-lg w-full"
                onClick={() => handleCardClick(booking)}
              >
                <h3 className="text-xl font-semibold">{booking.eventType || "Not Available"}</h3>
                
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{booking?.dateFrom ? booking.dateFrom.split("T")[0] : "No Date"}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-medium">Service Category:</p>
                  <div className="flex items-center gap-2">
                    {booking.derivedService === "Catering" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    )}
                    {booking.derivedService === "Photography" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {booking.derivedService === "Events" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
                      </svg>
                    )}
                    <span>{booking.derivedService}</span>
                  </div>
                  {booking.services?.length > 0 && (
                    <>
                      <p className="font-medium mt-2">Additional Services:</p>
                      {booking.services.map((service, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span>{service}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 00-7-7z" />
                  </svg>
                  <span>{booking.partnerName || "Not Available"}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center text-gray-600">
              No bookings match the selected tab.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BookingDetails;