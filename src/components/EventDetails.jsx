import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const docRef = doc(db, "Events", id);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()) {
                    setEvent(docSnap.data());
                } else {
                    console.error("No such event!")
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if(loading) {
        return <p>Loading event details...</p>
    }

    if(!event) {
        return <p>No event details available.</p>
    }

    return (
        <div>
            <h3>{event.title}</h3>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Date:</strong> {new Date(event.date.seconds * 1000).toLocaleString()}</p>
            <p><strong>Price:</strong> £{event.price}</p>
        </div>
    );
};

export default EventDetails;