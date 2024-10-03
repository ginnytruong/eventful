import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; 
import { db } from "../firebase";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const eventRef = doc(db, "Events", id);
    try {
      let imageUrl = null;

      if (image) {
        const storageRef = ref(storage, `event_images/${image.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, image);
        const snapshot = await uploadTask;
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      await updateDoc(eventRef, {
        title,
        imageUrl,
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="form-container">
        <h2 className="text-center text-xl font-bold mb-6">Edit Event</h2>
        <form onSubmit={handleUpdateEvent}>
          <div className="mb-4">
            <label className="form-label">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Date and Time:</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Event Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="form-input"
            />
          </div>
          <button
            type="submit"
            disabled={updating}
            className={`button ${
              updating ? "button-disabled" : "button-primary"
            }`}
          >
            {updating ? "Updating..." : "Update Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
