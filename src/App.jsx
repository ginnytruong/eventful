import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateEvent from "./components/CreateEvent";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import MyEvents from "./components/MyEvents";
import EditEvent from "./components/EditEvent";
import ProtectedRoute from "./ProtectedRoute";
import PaymentPage from "./components/PaymentPage";
import { AuthProvider } from "./context/AuthContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const App = () => {
  const [googleClientId, setGoogleClientId] = useState("");
  const [paypalClientId, setPaypalClientId] = useState("");

  useEffect(() => {
    fetch("../client_id.json")
      .then((response) => response.json())
      .then((data) => {
        setGoogleClientId(data.web.client_id);
      })
      .catch((err) => console.error("Error loading client_id.json:", err));
  }, []);

  useEffect(() => {
    const id = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    setPaypalClientId(id);
  }, []);

  if (!googleClientId || !paypalClientId) {
    return <div className="loading-text">Loading...</div>;
  }

  return (
    <AuthProvider>
      <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id/edit"
              element={
                <ProtectedRoute roleRequired="staff">
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-events" element={<MyEvents />} />
          </Routes>
        </Router>
      </PayPalScriptProvider>
    </AuthProvider>
  );
};

export default App;
