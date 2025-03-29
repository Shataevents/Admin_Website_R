import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BookingDetails from './bookings/BookingDetails';
import PartnerDetails from './partner_approval/PartnerDetails';
import Request from './order_request/Request';
import Login from './components/Login';
import BookCard from './bookings/BookCard';
import Order from './order_request/Order';
import Kyc from './partner_approval/Kyc';
import OnlineKyc from './partner_approval/OnlineKyc';
import CompanyVerification from './partner_approval/CompanyVerification';
import Inperson from './partner_approval/Inperson';
import UserCount from './UserCount/UserCount';
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/booking-details" element={<ProtectedRoute element={<BookingDetails />} />} />
            <Route path="/partner-details" element={<ProtectedRoute element={<PartnerDetails />} />} />
            <Route path="/request" element={<ProtectedRoute element={<Request />} />} />
            <Route path="/partner-details/kyc/:id" element={<ProtectedRoute element={<Kyc />} />} />
            <Route path="/partner-details/kyc/online-kyc/:id" element={<ProtectedRoute element={<OnlineKyc />} />} />
            <Route path="/partner-details/kyc/company-kyc/:id" element={<ProtectedRoute element={<CompanyVerification />} />} />
            <Route path="/partner-details/kyc/in-person/:id" element={<ProtectedRoute element={<Inperson />} />} />
            <Route path="/booking-details/card" element={<ProtectedRoute element={<BookCard />} />} />
            <Route path="/request/order" element={<ProtectedRoute element={<Order />} />} />
            <Route path="/user-count" element={<ProtectedRoute element={<UserCount />} />} />

            {/* Default route to redirect to login if no token */}
            <Route path="/" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
