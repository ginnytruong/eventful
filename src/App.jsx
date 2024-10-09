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
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    fetch("/client_id.json")
      .then((response) => response.json())
      .then((data) => {
        setClientId(data.web.client_id); // Set the client_id from the web property
      })
      .catch((err) => console.error("Error loading client_id.json:", err));
  }, []);

  if (!clientId) {
    return <div>Loading...</div>; // Show a loading state while fetching
  }

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
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
    </AuthProvider>
  );
};

export default App;
