import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "Events", id));
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          setEvent(eventData);

          const eventDate =
            eventData.date instanceof Date
              ? eventData.date
              : eventData.date.toDate();

          setTitle(eventData.title);
          setDescription(eventData.description);
          setLocation(eventData.location);
          setDate(eventDate.toISOString().slice(0, 16));
          setPrice(eventData.price);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const eventRef = doc(db, "Events", id);
      await updateDoc(eventRef, {
        title,
        description,
        location,
        date: new Date(date),
        price: parseFloat(price),
      });

      const registrationsQuery = query(
        collection(db, "Registrations"),
        where("eventId", "==", id)
      );
      const registrationsSnapshot = await getDocs(registrationsQuery);

      const updates = registrationsSnapshot.docs.map(
        async (registrationDoc) => {
          await updateDoc(registrationDoc.ref, {
            eventTitle: title,
          });
        }
      );
      await Promise.all(updates);

      navigate(`/events/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading event details...</div>;
  }

  return (
    <div>
      <h2>Edit Event</h2>
      <form onSubmit={handleUpdateEvent}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Location:
          <input 
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          />
        </label>
        <label>
          Date and Time:
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={updating}>
          {updating ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
