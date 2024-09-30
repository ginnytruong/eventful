import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            const eventDoc = await getDoc(doc(db, "Events", id));
            if (eventDoc.exists()) {
                setEvent(eventDoc.data());
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
    
        fetchEvent();
        checkRegistration();
        setLoading(false);
    }, [id, user]);

    const handleRegistration = async () => {
        if (!user) {
            alert("You must be logged in to register for an event.");
            return;
        }
        try {
            if(isRegistered) {
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
                eventsRegistered: arrayUnion(id)
            });

            setIsRegistered(true);
        } catch (error) {
            console.error("Error registering for event:". error);
            alert("An error occurred while registering for the event. Please try again.");
        }
    };
    if (loading) {
        return <div>Loading event details...</div>
    }
    if (!event) {
        return <div>Event not found.</div>
    }

    return (
      <div>
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>Date: {event.date.toDate().toString()}</p>
        <p>Price: £{event.price}</p>
        {user && !isRegistered && (
          <button onClick={handleRegistration}>Sign Up for Event</button>)}
        {isRegistered && (
          <p>You have successfully registered for this event!</p>)}
      </div>
    );
};

export default EventDetails;