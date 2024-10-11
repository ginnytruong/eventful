import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate} from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import GoogleCalendarIcon from "../assets/google-cal-icon.svg";

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

      if (event.price > 0) {
        navigate("/payment/" + id, { state: { price: event.price } });
      } else {

      await addDoc(collection(db, "Registrations"), {
        eventId: id,
        userId: user.uid,
        eventTitle: event.title,
        registrationDate: new Date(),
        paymentStatus: "completed",
      });

      const userDocRef = doc(db, "Users", user.uid);
      await updateDoc(userDocRef, {
        eventsRegistered: arrayUnion(id),
      });

      setIsRegistered(true);
      alert("Registered successfully for this event!");
      }
    } catch (error) {
      console.error("Error registering for event:", error);
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
        alert("An error occurred while deleting the event. Please try again.");
      } finally {
        setDeleting(false);
      }
    }
  };

  const addToGoogleCalendar = () => {
    if (!event) return;

    const { title, description, location, startDateTime, endDateTime } = event;

    const start = startDateTime
      .toDate()
      .toISOString()
      .replace(/-|:|\.|Z/g, "");
    const end = endDateTime
      .toDate()
      .toISOString()
      .replace(/-|:|\.|Z/g, "");

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(
      location
    )}&dates=${start}/${end}`;

    window.open(calendarUrl, "_blank");
  };

  if (loading) {
    return <div className="loading-text">Loading event details...</div>;
  }
  if (!event) {
    return <div className="loading-text">Event not found.</div>;
  }

  return (
    <div className="event-details-container">
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.title} className="event-image" />
      )}
      <h2 className="event-title">{event.title}</h2>
      <p className="event-location">{event.location}</p>
      <p className="event-datetime">
        Start: {event.startDateTime.toDate().toString()} <br />
        End: {event.endDateTime.toDate().toString()}
      </p>
      <hr className="my-4" />
      <p className="event-description">{event.description}</p>
      <hr className="my-4" />
      <p className="event-price">Price: £{event.price}</p>

      <div className="button-container">
        {role === "staff" && (
          <div className="staff-actions mb-4">
            <p className="registration-count">
              Guests Registered: {registrationCount}
            </p>
            <button
              onClick={() => navigate(`/events/${id}/edit`)}
              className="button button-primary mr-2"
            >
              Edit Event
            </button>
            <button
              onClick={handleDeleteEvent}
              disabled={deleting}
              className={`button button-danger ${
                deleting ? "button-disabled" : ""
              }`}
            >
              {deleting ? "Deleting..." : "Delete Event"}
            </button>
          </div>
        )}

        {user && role !== "staff" && !isRegistered && (
          <button
            onClick={handleRegistration}
            disabled={registering}
            className={`button button-primary ${
              registering ? "button-disabled" : ""
            }`}
          >
            {registering ? "Signing up..." : "Sign Up for Event"}
          </button>
        )}

        {isRegistered && (
          <div className="registration-info">
            <p className="success-message">
              You have registered for this event!
            </p>
            <button
              onClick={addToGoogleCalendar}
              className="button button-primary flex items-center"
            >
              <img
                src={GoogleCalendarIcon}
                alt="Google Calendar Icon"
                className="w-5 h-5 inline-block mr-2"
              />
              Add to Google Calendar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
