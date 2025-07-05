import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';

function BookingDetails() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [partners, setPartners] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Booked');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchNumberId, setSearchNumberId] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const getBookingServices = (booking) => {
    const services = [];
    
    // Check if photographyEvent matches eventId
    if (booking?.photographyEvent && booking?.eventId && booking.photographyEvent === booking.eventId) {
      services.push("Photography");
    }
    
    // Check if cateringEvent matches eventId
    if (booking?.cateringEvent && booking?.eventId && booking.cateringEvent === booking.eventId) {
      services.push("Catering");
    }
    
    // If neither photography nor catering matches, then it's an Event service
    if (services.length === 0) {
      services.push("Event");
    }
    
    return services;
  };

  const getFilteredBookingsByTab = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (activeTab) {
      case 'Booked':
        return bookings.filter(b => ['pending', 'partnerVisited', 'userConfirmVisit', 'cancelVisit'].includes(b.status));
      case 'Partner Visited':
        return bookings.filter(b => b.status === 'visited');
      case 'Inprogress':
        return bookings.filter(b => b.status === 'confirmEvent' && new Date(b.dateFrom) <= today && new Date(b.dateTo) >= today);
      case 'Upcoming':
        return bookings.filter(b => b.status === 'confirmEvent' && new Date(b.dateFrom) > today);
      case 'Completed':
        return bookings.filter(b => b.status === 'completed');
      case 'Cancelled':
        return bookings.filter(b => ['Cancel', 'cancel'].includes(b.status));
      default:
        return bookings;
    }
  };

  const getFinalFilteredBookings = () => {
    // If searching by numberId, use search results instead
    if (searchNumberId && searchResults.length > 0) {
      return searchResults.map(b => ({
        ...b,
        derivedServices: getBookingServices(b)
      }));
    }
    
    // If searching by numberId but no results, return empty array
    if (searchNumberId && searchResults.length === 0) {
      return [];
    }
    
    let result = [...getFilteredBookingsByTab()];
    const now = new Date();

    // Date range filter
    if (fromDate) result = result.filter(b => new Date(b.dateFrom) >= new Date(fromDate));

    // Preset date filter
    switch (dateFilter) {
      case 'thisWeek': {
        const end = new Date(now);
        end.setDate(end.getDate() + (7 - now.getDay()));
        result = result.filter(b => {
          const date = new Date(b.dateFrom);
          return date >= now && date <= end;
        });
        break;
      }
      case 'nextWeek': {
        const start = new Date(now);
        start.setDate(start.getDate() + (7 - now.getDay()) + 1);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        result = result.filter(b => {
          const date = new Date(b.dateFrom);
          return date >= start && date <= end;
        });
        break;
      }
      case 'thisMonth': {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        result = result.filter(b => {
          const date = new Date(b.dateFrom);
          return date >= start && date <= end;
        });
        break;
      }
      case 'nextMonth': {
        const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        result = result.filter(b => {
          const date = new Date(b.dateFrom);
          return date >= start && date <= end;
        });
        break;
      }
      default: break;
    }

    if (serviceFilter !== 'all') {
      result = result.filter(b => {
        const services = getBookingServices(b);
        return services.includes(serviceFilter);
      });
    }
    if (partnerFilter !== 'all') result = result.filter(b => b.partnerName === partnerFilter);

    result.sort((a, b) => sortOrder === 'newest'
      ? new Date(b.dateFrom) - new Date(a.dateFrom)
      : new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    return result;
  };

  useEffect(() => {
    setLoading(true);
    fetch("https://shatabackend.in/bookings")
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => {
        const enhanced = data.map(b => ({
          ...b,
          derivedServices: getBookingServices(b)
        }));
        setBookings(enhanced);
      })
      .catch(err => {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("https://shatabackend.in/partners")
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => {
        const names = data
          .filter(p => p.name && typeof p.name === 'string')
          .map(p => p.name.trim());
        setPartners(names);
      })
      .catch(err => {
        console.error("Error fetching partners:", err);
        setPartners([]);
      });
  }, []);

  // Auto-search by numberId with debounce
  useEffect(() => {
    if (!searchNumberId) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetch(`https://shatabackend.in/bookings?numberId=${searchNumberId}`)
        .then(res => res.ok ? res.json() : Promise.reject(res.status))
        .then(data => {
          // Filter the results to only include exact numberId matches
          const filteredResults = Array.isArray(data) 
            ? data.filter(booking => booking.numberId === searchNumberId)
            : [];
          setSearchResults(filteredResults);
        })
        .catch(err => {
          console.error("Error searching bookings by numberId:", err);
          setSearchResults([]);
        });
    }, 500); // 500ms delay after user stops typing

    return () => clearTimeout(debounceTimer);
  }, [searchNumberId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Clear all filters when switching tabs
    setDateFilter('all');
    setServiceFilter('all');
    setPartnerFilter('all');
    setSortOrder('newest');
    setFromDate('');
    setSearchNumberId('');
    setSearchResults([]);
  };

  const uniquePartners = partners.length > 0
    ? partners
    : [...new Set(bookings.map(b => b.partnerName).filter(p => typeof p === 'string'))];

  const handleCardClick = (booking) => {
    navigate('/booking-details/card', { state: booking });
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        };
      case 'partnerVisited':
        return {
          text: 'Waiting for the user to confirm the Visit',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'userConfirmVisit':
        return {
          text: 'User Confirmed Visit',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'cancelVisit':
        return {
          text: 'Visit is cancel by the User.',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
      case 'visited':
        return {
          text: 'Partner is Visited',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800'
        };
      case 'confirmEvent':
        return {
          text: 'Event Service is Confirmed.',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'completed':
        return {
          text: 'Event Service is Completed',
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-800'
        };
      case 'cancel':
      case 'Cancel':
        return {
          text: 'Event Service is Cancelled',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
      default:
        return {
          text: status || 'Unknown Status',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
    }
  };

  if (loading) return <LoadingScreen />;

  const filteredBookings = getFinalFilteredBookings();

  return (
    <section className="bg-[#fcfcfc] flex items-center justify-center w-full">
      <div className="w-full">
        <Navbar />
        <h2 className="text-2xl font-bold my-6 text-center">Booking Details</h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6 px-2">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-full">
            {['Booked', 'Partner Visited', 'Inprogress',  'Upcoming', 'Completed', 'Cancelled'].map(tab => (
              <button
                key={tab}
                className={`px-3  sm:px-4 rounded-full text-sm sm:text-base whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'bg-orange-500 text-black' : 'bg-white text-orange-500 border border-orange-500'
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white mx-1 p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
            <div>
              <label className="block text-sm font-medium mb-2">Search by Number ID</label>
              <input
                type="text"
                value={searchNumberId}
                onChange={e => setSearchNumberId(e.target.value)}
                placeholder="Enter number ID..."
                className="w-full p-2 border rounded"
              />
              {searchNumberId && (
                <small className="text-gray-500 text-xs mt-1 block">
                  {searchResults.length > 0 ? `Found ${searchResults.length} result(s)` : 'Searching...'}
                </small>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Date</label>
              <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border rounded">
                <option value="all">All Dates</option>
                <option value="thisWeek">This Week</option>
                <option value="nextWeek">Next Week</option>
                <option value="thisMonth">This Month</option>
                <option value="nextMonth">Next Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Booked Date</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Service</label>
              <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} className="w-full p-2 border rounded">
                <option value="all">All Services</option>
                <option value="Catering">Catering</option>
                <option value="Photography">Photography</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Partner</label>
              <select value={partnerFilter} onChange={e => setPartnerFilter(e.target.value)} className="w-full p-2 border rounded">
                <option value="all">All Partners</option>
                {uniquePartners.map((partner, i) => (
                  <option key={i} value={partner}>{partner}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort by Date</label>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full p-2 border rounded">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid px-3 grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => {
              const statusInfo = getStatusDisplay(booking.status);
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 cursor-pointer hover:shadow-lg relative"
                  onClick={() => handleCardClick(booking)}
                >
                  <h3 className="text-xl font-semibold">{booking.eventType || "Not Available"}</h3>
                  <div className="flex items-center gap-2">
                    <p><strong>Event Date:</strong></p>
                    <span>{booking?.dateFrom?.split("T")[0] || "No Date"}</span>
                  </div>
                  <div className="flex gap-2">
                    <p><strong>Service Category:</strong></p>
                    <span>{getBookingServices(booking).join(', ')}</span>
                  </div>
                  {booking.services?.length > 0 && (
                    <>
                      <p className="font-medium mt-2">Additional Services:</p>
                      {booking.services.map((s, i) => <span key={i}>{s}</span>)}
                    </>
                  )}
                  <div className="flex items-start gap-2 ">
                    <p><strong>Partner Name:</strong></p>
                    <span>{booking.partnerName || "Not Available"}</span>
                    {/* Status Badge - Bottom Right */}
                    <div className={`px-3 ml-20 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                      {statusInfo.text}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-3 text-center text-gray-600">
              No bookings match the selected filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BookingDetails;
