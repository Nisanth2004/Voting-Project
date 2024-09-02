import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; // Add this import

import HomePage from './component/HomePage';
import Signup from './component/Signup';
import SignIn from './component/SignIn';
import Nominal from './MLA/Nominal';
import UserPage from './USER/userPage';
import NominateForm from './MLA/NominateForm';
import PaymentPage from './MLA/PaymentPage';
import NominatorsList from './Nominators/NominatorsList';

import './App.css';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <PayPalScriptProvider options={{ "client-id": "AWid9Zg8O5fK5dZqCPAzd1G6DR1bXRbkFKcFCKIRIQrJs6CirFGYcmKIwfMs3tx8hIeq84GG8OO1Moe_" }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/mlapage/:mlaId" element={<Nominal />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/nominate" element={<NominateForm />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/nominators" element={<NominatorsList />} />
        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
