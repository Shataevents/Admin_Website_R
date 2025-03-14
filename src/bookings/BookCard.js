import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state || {};
  const [status, setStatus] = useState('upcoming'); // Default status

  const statusOptions = [
    'to visit',
    'in progress',
    'confirmed',
    'cancelled',
    'upcoming',
    'completed'
  ];

  return (
    <div className="min-h-screen bg-black py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6">{booking.eventTitle}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Client Details - Left Side */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Client Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {booking.clientDetails?.name || 'N/A'}</p>
              <p><strong>Phone Number:</strong> {booking.clientDetails?.phone || 'N/A'}</p>
              <p><strong>Event Date:</strong> {booking.date}</p>
              <p><strong>No. of People:</strong> {booking.clientDetails?.people || 'N/A'}</p>
              <p><strong>Budget:</strong> ${booking.clientDetails?.budget?.toLocaleString() || 'N/A'}</p>
              <p><strong>Location:</strong> {booking.clientDetails?.location || 'N/A'}</p>
              <p><strong>Services Booked:</strong> {booking.services?.join(', ') || 'N/A'}</p>
            </div>
          </div>

          {/* Event Planner Details - Right Side */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Event Planner Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {booking.planner}</p>
              <p><strong>Company:</strong> {booking.plannerDetails?.company || 'N/A'}</p>
              <p><strong>Company Location:</strong> {booking.plannerDetails?.companyLocation || 'N/A'}</p>
              <p><strong>Personal Phone:</strong> {booking.plannerDetails?.personalPhone || 'N/A'}</p>
              <p><strong>Company Phone:</strong> {booking.plannerDetails?.companyPhone || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Status - Bottom Centered */}
        <div className="border-t pt-4 text-center">
          <h3 className="text-xl font-semibold mb-3">Booking Status</h3>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full max-w-xs p-2 border rounded mx-auto block"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default BookCard;