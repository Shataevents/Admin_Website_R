import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen'; // Adjust the path if necessary

const PartnerBookings = () => {
  const { id } = useParams(); // Get the partner ID from the URL
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [userDetails, setUserDetails] = useState(null); // State for user details
  const [bookingUsers, setBookingUsers] = useState({}); // State for booking users
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

        // Fetch user details for each booking
        const bookingUsersData = {};
        console.log('Filtered bookings:', filteredBookings); // Debug log
        for (const booking of filteredBookings) {
          // Check multiple possible field names for user ID
          const userId = booking.userId || booking.user_id || booking.customerId || booking.customer_id;
          console.log('Processing booking:', booking.id, 'userId:', userId, 'Full booking object:', booking); // Debug log
          if (userId) {
            try {
              const userResponse = await fetch(`https://shatabackend.in/user/${userId}`);
              console.log('User response status:', userResponse.status, 'for userId:', userId); // Debug log
              if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log('User data for', userId, ':', userData); // Debug log
                bookingUsersData[userId] = userData;
              } else {
                console.error(`HTTP error ${userResponse.status} for userId ${userId}`);
              }
            } catch (error) {
              console.error(`Error fetching user data for userId ${userId}:`, error);
            }
          } else {
            console.log('No userId found in booking:', booking.id);
          }
        }
        console.log('Final booking users data:', bookingUsersData); // Debug log
        setBookingUsers(bookingUsersData);
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
        onClick={() => navigate('/partner-details')} // Navigate to /partner-details
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
          {bookings.map((booking, index) => {
            // Check multiple possible field names for user ID
            const userId = booking.userId || booking.user_id || booking.customerId || booking.customer_id;
            const bookingUser = bookingUsers[userId];
            console.log('Rendering booking:', booking.id, 'userId:', userId, 'bookingUser:', bookingUser); // Debug log
            return (
              <div key={booking.id || `booking-${index}`} className="bg-white p-6 rounded-lg shadow-md">
                <p><strong>Booking ID:</strong> {booking.numberId}</p>
                {bookingUser ? (
                  <>
                    <p><strong>Customer Name:</strong> {bookingUser.data?.fullName || 'N/A'}</p>
                    <p><strong>Customer Phone:</strong> {bookingUser.data?.phone  || 'N/A'}</p>
                    <p><strong>Customer Email:</strong> {bookingUser.data?.email || 'N/A'}</p>
                  </>
                ) : userId ? (
                  <p><strong>Customer:</strong> Loading user data...</p>
                ) : (
                  <p><strong>Customer:</strong> No user ID found</p>
                )}
                <p><strong>Service:</strong> {booking.eventType || 'N/A'}</p>
                <p><strong>Date of Event:</strong> {booking.dateFrom ? booking.dateFrom.split('T')[0] : 'N/A'}</p>
                <p><strong>Status:</strong> {booking.status || 'N/A'}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-600">No bookings found for this partner.</div>
      )}
    </div>
  );
};

export default PartnerBookings;