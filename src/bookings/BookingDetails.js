import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function BookingDetails() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [plannerFilter, setPlannerFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Fetch booking details from the API
  useEffect(() => {
    fetch("http://shata-app-alb-933188665.ap-south-2.elb.amazonaws.com/bookings")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the API returns a "data" field with an array of bookings
        const bookingData = data.data || [];
        setBookings(bookingData);
      })
      .catch((error) => {
        console.error("Error fetching booking details:", error);
        setBookings([]); // Set to empty array on error
      });
  }, []);

  // Get unique planners for dropdown
  const uniquePlanners = [...new Set(bookings.map(booking => booking.planner))];

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      // Date filter
      const today = new Date('2025-03-24'); // Using current date (March 24, 2025)
      const bookingDate = new Date(booking.date);
      if (dateFilter === 'thisWeek') {
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        return bookingDate >= today && bookingDate <= weekEnd;
      }
      if (dateFilter === 'nextWeek') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() + 7);
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 14);
        return bookingDate >= weekStart && bookingDate <= weekEnd;
      }
      if (dateFilter === 'thisMonth') {
        const monthEnd = new Date(today);
        monthEnd.setMonth(today.getMonth() + 1);
        return bookingDate >= today && bookingDate <= monthEnd;
      }
      if (dateFilter === 'nextMonth') {
        const nextMonthStart = new Date(today);
        nextMonthStart.setMonth(today.getMonth() + 1);
        const nextMonthEnd = new Date(today);
        nextMonthEnd.setMonth(today.getMonth() + 2);
        return bookingDate >= nextMonthStart && bookingDate <= nextMonthEnd;
      }
      return true;
    })
    .filter(booking => {
      // Service filter
      if (serviceFilter === 'all') return true;
      return booking.services.includes(serviceFilter);
    })
    .filter(booking => {
      // Planner filter
      if (plannerFilter === 'all') return true;
      return booking.planner === plannerFilter;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const handleCardClick = (booking) => {
    navigate('/booking-details/card', { state: booking });
  };

  return (
    <section className="bg-[#fcfcfc] flex items-center justify-center w-full">
      <div className="w-full">
        <Navbar />
        <h2 className="text-2xl font-bold my-6 text-center">Booking Details</h2>

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

            {/* Service Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Service</label>
              <select 
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Services</option>
                <option value="Photography">Photography</option>
                <option value="Catering">Catering</option>
                <option value="Event">Event</option>
              </select>
            </div>

            {/* Planner Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Planner</label>
              <select 
                value={plannerFilter}
                onChange={(e) => setPlannerFilter(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Planners</option>
                {uniquePlanners.map((planner, index) => (
                  <option key={index} value={planner}>{planner}</option>
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
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 cursor-pointer hover:shadow-lg w-full"
                onClick={() => handleCardClick(booking)}
              >
                <h3 className="text-xl font-semibold">{booking.eventTitle}</h3>
                
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{booking.date}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-medium">Selected Services:</p>
                  {booking.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {service === "Photography" && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {service === "Catering" && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                      {service === "Event" && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
                        </svg>
                      )}
                      <span>{service}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{booking.planner}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center text-gray-600">
              No bookings done till now.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BookingDetails;