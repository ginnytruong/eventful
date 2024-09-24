import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
// import EventList from "./components/EventList";
// import EventDetails from "./components/EventDetails";
// import CreateEvent from "./components/CreateEvent";
// import Login from "./components/Login";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* <Route path="/" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/login" element={<Login />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
