import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Dashboard from './components/Dashboard';
import BookingDetails from './bookings/BookingDetails';
import PartnerDetails from './partner_approval/PartnerDetails';
import Request from './partner/Request';
import Login from './components/Login';
import BookCard from './bookings/BookCard';
import Order from './partner/Order';
import Kyc from './partner_approval/Kyc';
import OnlineKyc from './partner_approval/OnlineKyc';
import CompanyVerification from './partner_approval/CompanyVerification';
import Inperson from './partner_approval/Inperson';
import UserCount from './UserCount/UserCount';
import ProtectedRoute from './components/ProtectedRoutes';
import PartnerInfo from './partner/PartnerInfo';
import PartnerBookings from './partner/PartnerBookings';
import AutoLogoutProvider from './components/AutoLogoutProvider'; // ✅ new

function App() {
  return (
    <Router>
      <AutoLogoutProvider>
        <div className="flex flex-col h-screen">
          <main>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/booking-details" element={<ProtectedRoute element={<BookingDetails />} />} />
              <Route path="/approval-panel" element={<ProtectedRoute element={<PartnerDetails />} />} />
              <Route path="/partner-details" element={<ProtectedRoute element={<PartnerInfo />} />} />
              <Route path="/partner/:id" element={<ProtectedRoute element={<PartnerBookings />} />} />
              <Route path="/approval-panel/kyc/:id" element={<ProtectedRoute element={<Kyc />} />} />
              <Route path="/approval-panel/kyc/online-kyc/:id" element={<ProtectedRoute element={<OnlineKyc />} />} />
              <Route path="/approval-panel/kyc/company-kyc/:id" element={<ProtectedRoute element={<CompanyVerification />} />} />
              <Route path="/approval-panel/kyc/in-person/:id" element={<ProtectedRoute element={<Inperson />} />} />
              <Route path="/booking-details/card" element={<ProtectedRoute element={<BookCard />} />} />
              <Route path="/partner/order" element={<ProtectedRoute element={<Order />} />} />
              <Route path="/user-count" element={<ProtectedRoute element={<UserCount />} />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </main>
        </div>
      </AutoLogoutProvider>
    </Router>
  );
}

export default App;
