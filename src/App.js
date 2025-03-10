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

function App() {

  return (
    <Router>
      <div className="flex flex-col h-screen">
        <div >
          <main>
            <Routes>
              <Route path="/login" element={ <Login /> } />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/booking-details" element={<BookingDetails />  } />
              <Route path="/partner-details" element={ <PartnerDetails /> } />
              <Route path="/request" element={ <Request /> } />
              <Route path='/partner-details/kyc' element={<Kyc/>}/>
              <Route path='/partner-details/kyc/online-kyc' element={<OnlineKyc/>}/>
              <Route path='/partner-details/kyc/company-kyc' element={<CompanyVerification/>}/>
              <Route path='/partner-details/kyc/in-person' element={<Inperson/>}/>
              <Route path="/" element={<Login  />} />
              <Route path='/booking-details/card' element={<BookCard/>}/>
              <Route path='/request/order' element={<Order/>}/>
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;