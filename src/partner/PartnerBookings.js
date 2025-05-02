import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen'; // Adjust the path if necessary

const PartnerBookings = () => {
  const { id } = useParams(); // Get the partner ID from the URL
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [userDetails, setUserDetails] = useState(null); // State for user details
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        // Fetch partner details
        const partnerResponse = await fetch(`https://shatabackend.in/partners/${id}`);
        const partnerData = await partnerResponse.json();
        setPartner(partnerData);

        // Fetch bookings and filter by partnerId
        const bookingsResponse = await fetch(`https://shatabackend.in/bookings`);
        const bookingsData = await bookingsResponse.json();
        const filteredBookings = bookingsData.filter(booking => booking.partnerId === id);
        setBookings(filteredBookings);

        // Fetch user details using userId from the partner data
        if (partnerData.userId) {
          const userResponse = await fetch(`https://shatabackend.in/user/${partnerData.userId}`);
          const userData = await userResponse.json();
          setUserDetails(userData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerDetails();
  }, [id]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!partner) {
    return <div className="p-6 text-center text-gray-600 text-xl">Partner not found.</div>;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/partner')} // Navigate to /partner
        className="mb-4 flex items-center px-4 py-2 text-white rounded hover:bg-orange-500"
      >
        <img 
          src="/icons/chevron-left.svg" 
          alt="Chevron Left" 
          className="w-4 h-4 mr-2" 
        />
      </button>
      <h2 className="text-2xl font-bold mb-4">Partner Bookings</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p><strong>Name:</strong> {partner.name || 'N/A'}</p>
        <p><strong>Company:</strong> {partner.companyName || 'N/A'}</p>
        <p><strong>Location:</strong> {partner.companyLocation || 'N/A'}</p>
        <p><strong>Phone:</strong> {partner.mobileNo || 'N/A'}</p>
        <p><strong>Email:</strong> {partner.personalEmail || 'N/A'}</p>
      </div>

      {userDetails && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">User Details</h3>
          <p><strong>User Name:</strong> {userDetails.name || 'N/A'}</p>
          <p><strong>Email:</strong> {userDetails.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {userDetails.phone || 'N/A'}</p>
        </div>
      )}

      <h3 className="text-xl font-bold mb-4">Bookings</h3>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
              <p><strong>Booking ID:</strong> {booking._id}</p>
              <p><strong>Service:</strong> {booking.eventType || 'N/A'}</p>
              <p><strong>Date of Event:</strong> {booking.dateFrom ? booking.dateFrom.split('T')[0] : 'N/A'}</p>
              <p><strong>Status:</strong> {booking.status || 'N/A'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">No bookings found for this partner.</div>
      )}
    </div>
  );
};

export default PartnerBookings;