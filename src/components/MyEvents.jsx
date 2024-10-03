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
    return (
      <div className="loading-text">Loading your registered events...</div>
    );
  }

  if (registeredEvents.length === 0) {
    return (
      <div className="text-center py-4">
        You have not registered for any events.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
      <ul className="space-y-6">
        {registeredEvents.map((event) => (
          <li key={event.id} className="border rounded-lg p-4 shadow-md">
            {event.imageUrl && (
              <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-700 text-md mb-2">{event.description}</p>
            <p className="text-gray-600 text-md mb-2">{event.location}</p>
            <p className="text-gray-600 text-md mb-2">{event.date.toDate().toString()}</p>
            <p className="text-gray-600 text-md mb-4">Price: £{event.price}</p>
            <button
              onClick={() => handleCancellation(event.id)}
              disabled={cancelEventId === event.id}
              className={`button button-danger ${
                cancelEventId === event.id
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
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
