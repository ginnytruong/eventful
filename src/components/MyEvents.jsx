import React, { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const MyEvents = () => {
  const { user } = useContext(AuthContext);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const registrationsQuery = query(
          collection(db, "Registrations"),
          where("userId", "==", user.uid)
        );
        const registrationsSnapshot = await getDocs(registrationsQuery);

        const eventIds = registrationsSnapshot.docs.map(
          (doc) => doc.data().eventId
        );

        const eventsPromises = eventIds.map((id) =>
          getDoc(doc(db, "Events", id))
        );
        const eventsSnapshot = await Promise.all(eventsPromises);

        const eventsData = eventsSnapshot.map((eventDoc) => ({
          id: eventDoc.id,
          ...eventDoc.data(),
        }));

        setRegisteredEvents(eventsData);
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRegisteredEvents();
    }
  }, [user]);

  if (loading) {
    return <div>Loading your registered events...</div>;
  }

  if (registeredEvents.length === 0) {
    return <div>You have not registered for any events.</div>;
  }

  return (
    <div>
      <h2>Your Events</h2>
      <ul>
        {registeredEvents.map((event) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {event.date.toDate().toString()}</p>
            <p>Price: £{event.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyEvents;
