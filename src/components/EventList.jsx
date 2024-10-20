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
  switch (sortBy) {
    case "title":
      return a.title.localeCompare(b.title);
    case "price":
      return (a.price || 0) - (b.price || 0);
    default:
      return (a.startDateTime || 0) - (b.startDateTime || 0);
  }
});

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchEvents();
  };

  const clearSearch = () => {
    setSearchTerm("");
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

  return (
    <section className="flex flex-col items-center mx-5 my-5">
      {loading && (
        <div role="alert" aria-live="assertive" className="loading-text">
          Loading events...
        </div>
      )}

      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
          <button onClick={handleRetry} aria-label="Retry fetching events">
            Retry
          </button>
        </div>
      )}

      <div className="search-sort-container">
        <label htmlFor="search" className="sr-only">
          Search events
        </label>
        <input
          type="text"
          id="search"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar w-2/3"
          aria-label="Search events"
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="button button-primary w-1/3"
            aria-label="Clear search"
          >
            clear
          </button>
        )}

        <label htmlFor="sort" className="sr-only">
          Sort events
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-dropdown w-1/3"
          aria-label="Sort by"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      {filteredEvents.length === 0 && (
        <div className="no-events-message my-4">
          No events found matching your criteria.
        </div>
      )}

      <div className="flex flex-wrap justify-center">
        {sortedEvents.map((event) => (
          <article
            className="bg-white rounded-lg shadow-lg m-4 p-4 w-80 transform transition-transform duration-200 hover:translate-y-1 hover:shadow-2xl"
            key={event.id}
          >
            <Link
              to={`/events/${event.id}`}
              aria-label={`View details for ${event.title}`}
            >
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
                Location: {event.location}
              </p>
              <p className="font-poppins text-sm text-gray-600">
                Start: {event.startDateTime.toLocaleString()}{" "}
              </p>
              <p className="font-poppins text-sm text-gray-600">
                End:{" "}
                {event.endDateTime ? event.endDateTime.toLocaleString() : "N/A"}{" "}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default EventList;
