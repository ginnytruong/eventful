import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Events"));
                const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
            <h2>Event List</h2>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        <Link to={`/events/${event.id}`}>
                            <h3>{event.title}</h3>
                            <p>{event.date.toDate().toLocaleString()}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;