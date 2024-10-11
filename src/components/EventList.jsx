import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import axios from "axios";

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
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          startDateTime: doc.data().startDateTime.toDate(),
          endDateTime: doc.data().endDateTime.toDate()
        }));

        const ticketmasterEvents = await fetchTicketmasterEvents();

        setEvents([...eventsData, ...ticketmasterEvents]);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

const fetchTicketmasterEvents = async () => {
  try {
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${
        import.meta.env.VITE_TICKETMASTER_API_KEY
      }`
    );

    if (!response.data._embedded || !response.data._embedded.events) {
      return [];
    }

    return response.data._embedded.events
      .map((event) => {
        if (
          !event.dates ||
          !event.dates.start ||
          !event._embedded ||
          !event._embedded.venues ||
          event._embedded.venues.length === 0
        ) {
          console.warn("Event data is missing properties:", event);
          return null;
        }

        return {
          id: event.id,
          title: event.name,
          location: event._embedded.venues[0].name,
          startDateTime: new Date(
            event.dates.start.localDate + "T" + event.dates.start.localTime
          ),
          endDateTime: null,
          imageUrl: event.images[0]?.url,
          url: event.url,
        };
      })
      .filter((event) => event !== null);
  } catch (error) {
    console.error("Error fetching Ticketmaster events:", error);
    return [];
  }
};

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEvents = filteredEvents.sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return a.startDateTime - b.startDateTime;
  });

  if (loading) {
    return <div className="loading-text">Loading events...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center mx-5 my-5">
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="date">Sort by Date</option>
        <option value="title">Sort by Title</option>
      </select>
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
                End: {event.endDateTime ? event.endDateTime.toLocaleString() : "N/A"}{" "}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;