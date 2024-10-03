import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Events"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again.")
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

    return (
      <div className="flex flex-wrap justify-center mx-5 my-5">
        {" "}
        {events.map((event) => (
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
                {new Date(event.date).toLocaleString()}
              </p>
            </Link>
          </div>
        ))}
      </div>
    );
  };

export default EventList;