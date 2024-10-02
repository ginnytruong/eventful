import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./EventList.css";

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Events"));
                const eventsData = querySnapshot.docs.map(doc => ({ 
                    id: doc.id,
                     ...doc.data(),
                     date: doc.data().date.toDate(),
                    }));
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <div>Loading events...</div>;
    }

    return (
      <div>
        <div className="event-list">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <Link to={`/events/${event.id}`}>
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="event-image"
                  />
                )}
                <h3>{event.title}</h3>
                <p>{new Date(event.date).toLocaleString()}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
};

export default EventList;