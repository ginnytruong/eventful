import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Events"));
      const eventsData = querySnapshot.docs.map((doc) => {
        const startDateTime = doc.data().startDateTime;
        const endDateTime = doc.data().endDateTime;

        return {
          id: doc.id,
          ...doc.data(),
          startDateTime: startDateTime?.toDate(),
          endDateTime: endDateTime?.toDate(),
        };
      });

      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);


  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEvents = filteredEvents.sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return (a.startDateTime || 0) - (b.startDateTime || 0);
  });

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchEvents();
  };

  if (loading) {
    return <div className="loading-text">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="no-events-message">
        No events found matching your criteria.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mx-5 my-5">
      <div className="search-sort-container">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-dropdown"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
      <div className="flex flex-wrap justify-center">
        {sortedEvents.map((event) => (
          <div
            className="bg-white rounded-lg shadow-lg m-4 p-4 w-80 transform transition-transform duration-200 hover:translate-y-1 hover:shadow-2xl"
            key={event.id}
          >
            <Link to={`/events/${event.id}`}>
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              )}
              <h3 className="font-poppins text-xl text-gray-800 my-2">
                {event.title}
              </h3>
              <p className="font-poppins text-sm text-gray-600">
                {event.location}
              </p>
              <p className="font-poppins text-sm text-gray-600">
                Start: {event.startDateTime.toLocaleString()}{" "}
              </p>
              <p className="font-poppins text-sm text-gray-600">
                End:{" "}
                {event.endDateTime ? event.endDateTime.toLocaleString() : "N/A"}{" "}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
