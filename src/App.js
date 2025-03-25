import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import BookingDetails from "./bookings/BookingDetails";
import PartnerDetails from "./partner_approval/PartnerDetails";
import Request from "./order_request/Request";
import Login from "./components/Login";
import BookCard from "./bookings/BookCard";
import Order from "./order_request/Order";
import Kyc from "./partner_approval/Kyc";
import OnlineKyc from "./partner_approval/OnlineKyc";
import CompanyVerification from "./partner_approval/CompanyVerification";
import Inperson from "./partner_approval/Inperson";
import UserCount from "./UserCount/UserCount";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <div>
          <main>
            <Routes>
              {/* Unprotected Route */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Login />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/booking-details" element={<BookingDetails />} />
                <Route path="/partner-details" element={<PartnerDetails />} />
                <Route path="/request" element={<Request />} />
                <Route path="/partner-details/kyc/:id" element={<Kyc />} />
                <Route path="/partner-details/kyc/online-kyc/:id" element={<OnlineKyc />} />
                <Route path="/partner-details/kyc/company-kyc/:id" element={<CompanyVerification />} />
                <Route path="/partner-details/kyc/in-person/:id" element={<Inperson />} />
                <Route path="/booking-details/card" element={<BookCard />} />
                <Route path="/request/order" element={<Order />} />
                <Route path="/user-count" element={<UserCount />} />
              </Route>
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;