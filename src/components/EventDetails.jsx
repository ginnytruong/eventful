import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "Events", id));
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          console.log("Fetched event data:", eventData);
          setEvent(eventData);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkRegistration = async () => {
      if (user) {
        const q = query(
          collection(db, "Registrations"),
          where("eventId", "==", id),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        setIsRegistered(!querySnapshot.empty);
      }
    };

    const fetchRegistrationCount = async () => {
      const q = query(
        collection(db, "Registrations"),
        where("eventId", "==", id)
      );
      const querySnapshot = await getDocs(q);
      setRegistrationCount(querySnapshot.size);
    };

    fetchEvent();
    checkRegistration();

    if (role === "staff") {
      fetchRegistrationCount();
    }
  }, [id, user, role]);

  const handleRegistration = async () => {
    if (!user) {
      alert("You must be logged in to register for an event.");
      return;
    }
    try {
      setRegistering(true);
      if (isRegistered) {
        setRegistering(false);
        return;
      }

      await addDoc(collection(db, "Registrations"), {
        eventId: id,
        userId: user.uid,
        eventTitle: event.title,
        registrationDate: new Date(),
      });

      const userDocRef = doc(db, "Users", user.uid);
      await updateDoc(userDocRef, {
        eventsRegistered: arrayUnion(id),
      });

      setIsRegistered(true);
    } catch (error) {
      console.error("Error registering for event:".error);
      alert(
        "An error occurred while registering for the event. Please try again."
      );
    } finally {
      setRegistering(false);
    }
  };

    const handleDeleteEvent = async () => {
      if (window.confirm("Are you sure you want to delete this event?")) {
        setDeleting(true);
        try {
          const registrationQuery = query(
            collection(db, "Registrations"),
            where("eventId", "==", id)
          );
          const registrationsSnapshot = await getDocs(registrationQuery);
          const deletePromises = registrationsSnapshot.docs.map((docSnap) =>
            deleteDoc(docSnap.ref)
          );
          await Promise.all(deletePromises);

          await deleteDoc(doc(db, "Events", id));

          navigate("/events");
        } catch (error) {
          console.error("Error deleting event:", error);
          alert(
            "An error occurred while deleting the event. Please try again."
          );
        } finally {
          setDeleting(false);
        }
      }
    };

  if (loading) {
    return <div>Loading event details...</div>;
  }
  if (!event) {
    return <div>Event not found.</div>;
  }

  return (
    <div>
      <h2>{event.title}</h2>
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          style={{ maxWidth: "50%", height: "auto" }}
        />
      )}
      <p>{event.description}</p>
      <p>Date: {event.date.toDate().toString()}</p>
      <p>Price: £{event.price}</p>
      {role === "staff" && (
        <>
          <p>No. of Registrations: {registrationCount}</p>
          <button onClick={() => navigate(`/events/${id}/edit`)}>
            Edit Event
          </button>
          <button onClick={handleDeleteEvent} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Event"}
          </button>
        </>
      )}
      {user && !isRegistered && (
        <button onClick={handleRegistration} disabled={registering}>
          {registering ? "Signing up..." : "Sign Up for Event"}
        </button>
      )}
      {isRegistered && <p>You have successfully registered for this event!</p>}
    </div>
  );
};

export default EventDetails;