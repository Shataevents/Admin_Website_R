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

  const getServiceCategory = (eventType) => {
    const cateringTypes = ["Shushi Counter", "BBQ Grill Station", "Premium Wedding Catering", "Desert Counter", "Live Pasta Station"];
    const photographyTypes = ["Maternity", "Post Wedding", "Professional Photography", "Self Photography", "Pre Wedding", "Wedding Photography", "Baby Shower"];

    if (!eventType) return "Events";
    if (cateringTypes.includes(eventType)) return "Catering";
    if (photographyTypes.includes(eventType)) return "Photography";
    return "Events";
  };

  const getFilteredBookingsByTab = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (activeTab) {
      case 'Booked':
        return bookings.filter(b => ['pending', 'partnerVisited', 'userConfirmVisit', 'visited', 'cancelVisit'].includes(b.status));
      case 'Inprogress':
        return bookings.filter(b => b.status === 'confirmEvent' && new Date(b.dateFrom) <= today && new Date(b.dateTo) >= today);
      case 'Completed':
        return bookings.filter(b => b.status === 'completed');
      case 'Upcoming':
        return bookings.filter(b => b.status === 'confirmEvent' && new Date(b.dateFrom) > today);
      case 'Cancelled':
        return bookings.filter(b => ['Cancel', 'cancel'].includes(b.status));
      default:
        return bookings;
    }
  };

  const getFinalFilteredBookings = () => {
    let result = [...getFilteredBookingsByTab()];
    const now = new Date();

    // Date range filter
    if (fromDate) result = result.filter(b => new Date(b.dateFrom) >= new Date(fromDate));
    if (toDate) result = result.filter(b => new Date(b.dateFrom) <= new Date(toDate));

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

    if (serviceFilter !== 'all') result = result.filter(b => b.derivedService === serviceFilter);
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
          derivedService: getServiceCategory(b.eventType)
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

  const uniquePartners = partners.length > 0
    ? partners
    : [...new Set(bookings.map(b => b.partnerName).filter(p => typeof p === 'string'))];

  const handleCardClick = (booking) => {
    navigate('/booking-details/card', { state: booking });
  };

  if (loading) return <LoadingScreen />;

  const filteredBookings = getFinalFilteredBookings();

  return (
    <section className="bg-[#fcfcfc] flex items-center justify-center w-full">
      <div className="w-full">
        <Navbar />
        <h2 className="text-2xl font-bold my-6 text-center">Booking Details</h2>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          {['Booked', 'Inprogress', 'Completed', 'Upcoming', 'Cancelled'].map(tab => (
            <button
              key={tab}
              className={`px-4 rounded-full ${activeTab === tab ? 'bg-orange-500 text-black' : 'bg-white text-orange-500'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white mx-1 p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
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
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full p-2 border rounded mb-2" />
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Service</label>
              <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} className="w-full p-2 border rounded">
                <option value="all">All Services</option>
                <option value="Catering">Catering</option>
                <option value="Photography">Photography</option>
                <option value="Events">Events</option>
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
            filteredBookings.map((booking, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 cursor-pointer hover:shadow-lg"
                onClick={() => handleCardClick(booking)}
              >
                <h3 className="text-xl font-semibold">{booking.eventType || "Not Available"}</h3>
                <div className="flex items-center gap-2">
                  <span>{booking?.dateFrom?.split("T")[0] || "No Date"}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Service Category:</p>
                  <span>{booking.derivedService}</span>
                </div>
                {booking.services?.length > 0 && (
                  <>
                    <p className="font-medium mt-2">Additional Services:</p>
                    {booking.services.map((s, i) => <span key={i}>{s}</span>)}
                  </>
                )}
                <div className="flex items-center gap-2">
                  <span>{booking.partnerName || "Not Available"}</span>
                </div>
              </div>
            ))
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
