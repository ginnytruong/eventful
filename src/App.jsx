import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CreateEvent from "./components/CreateEvent";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import NonStaffCreateAccount from "./components/NonStaffCreateAccount";
import StaffCreateAccount from "./components/StaffCreateAccount";
import NonStaffLogin from "./components/NonStaffLogin";
import StaffLogin from "./components/StaffLogin";


const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/create-account/non-staff" element={<NonStaffCreateAccount />} />
          <Route path="/create-account/staff" element={<StaffCreateAccount />} />
          <Route path="/login/non-staff" element={<NonStaffLogin />} />
          <Route path="/login/staff" element={<StaffLogin />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
