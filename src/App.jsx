import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CreateEvent from "./components/CreateEvent";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import MyEvents from "./components/MyEvents";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
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
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-events" element={<MyEvents />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
