import React, { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const MyEvents = () => {
  const { user } = useContext(AuthContext);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelEventId, setCancelEventId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }

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

    fetchRegisteredEvents();
  }, [user, navigate]);

  const handleCancellation = async (eventId) => {
    if (!user) return;

    setCancelEventId(eventId);

    try {
      const registrationsQuery = query(
        collection(db, "Registrations"),
        where("userId", "==", user.uid),
        where("eventId", "==", eventId)
      );
      const registrationsSnapshot = await getDocs(registrationsQuery);

      if (!registrationsSnapshot.empty) {
        await deleteDoc(registrationsSnapshot.docs[0].ref);

        const userDocRef = doc(db, "Users", user.uid);
        await updateDoc(userDocRef, {
          eventsRegistered: arrayRemove(eventId),
        });

        setRegisteredEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
      alert("An error occurred while cancelling the event. Please try again.");
    } finally {
      setCancelEventId(null);
    }
  };

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
            <button
              onClick={() => handleCancellation(event.id)}
              disabled={cancelEventId === event.id}
            >
              {cancelEventId === event.id
                ? "Cancelling..."
                : "Cancel Registration"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default MyEvents;
