import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function BookingDetails() {
  const navigate = useNavigate();
  const [bookings] = useState([
    {
      eventTitle: "Wedding Celebration",
      date: "2025-04-15",
      services: ["Photography", "Catering"],
      planner: "Jane Smith",
      clientDetails: {
        name: "Sarah Williams",
        phone: "555-0123",
        people: 150,
        budget: 10000,
        location: "New York"
      },
      plannerDetails: {
        company: "Smith Events",
        companyLocation: "New York",
        personalPhone: "555-0124",
        companyPhone: "555-0125"
      }
    },
    {
      eventTitle: "Corporate Gala",
      date: "2025-05-20",
      services: ["Photography", "Event"],
      planner: "John Doe",
      clientDetails: {
        name: "Mark Thompson",
        phone: "555-0126",
        people: 200,
        budget: 15000,
        location: "Chicago"
      },
      plannerDetails: {
        company: "Doe Enterprises",
        companyLocation: "Chicago",
        personalPhone: "555-0127",
        companyPhone: "555-0128"
      }
    },
    {
      eventTitle: "Birthday Party",
      date: "2025-06-10",
      services: ["Catering", "Event"],
      planner: "Emily Johnson",
      clientDetails: {
        name: "Lisa Brown",
        phone: "555-0129",
        people: 50,
        budget: 3000,
        location: "Los Angeles"
      },
      plannerDetails: {
        company: "Johnson Events",
        companyLocation: "Los Angeles",
        personalPhone: "555-0130",
        companyPhone: "555-0131"
      }
    },
    {
      eventTitle: "Birthday Party",
      date: "2025-06-10",
      services: ["Catering", "Event"],
      planner: "Emily Johnson",
      clientDetails: {
        name: "Lisa Brown",
        phone: "555-0129",
        people: 50,
        budget: 3000,
        location: "Los Angeles"
      },
      plannerDetails: {
        company: "Johnson Events",
        companyLocation: "Los Angeles",
        personalPhone: "555-0130",
        companyPhone: "555-0131"
      }
    }
  ]);

  const [dateFilter, setDateFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [plannerFilter, setPlannerFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Get unique planners for dropdown
  const uniquePlanners = [...new Set(bookings.map(booking => booking.planner))];

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      // Date filter
      const today = new Date('2025-03-09'); // Using current date from system
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
    <section className="bg-black min-h-screen flex items-center justify-center w-full">
      <div className="container py-6 px-4 w-full">
        <Navbar />
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Booking Details</h2>

        {/* Filter and Sort Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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

        {/* Booking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {filteredBookings.map((booking, index) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}

export default BookingDetails;