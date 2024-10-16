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
  const [startDateTime, setStartDateTime] = useState(""); 
  const [endDateTime, setEndDateTime] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "Events", id));
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          setEvent(eventData);

          const eventStartDateTime =
            eventData.startDateTime instanceof Date
              ? eventData.startDateTime
              : eventData.startDateTime.toDate();
          const eventEndDateTime =
            eventData.endDateTime instanceof Date
              ? eventData.endDateTime
              : eventData.endDateTime.toDate();

          setTitle(eventData.title);
          setDescription(eventData.description);
          setLocation(eventData.location);
          setStartDateTime(eventStartDateTime.toISOString().slice(0, 16));
          setEndDateTime(eventEndDateTime.toISOString().slice(0, 16));
          setPrice(eventData.price);
        } else {
          setError("Event not found.")
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError(
          "An error occurred while fetching the event. Please try again."
        );
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
    setError("");
    const eventRef = doc(db, "Events", id);
    try {
      let imageUrl = event?.imageUrl || "";

      if (image) {
        const storageRef = ref(storage, `event_images/${image.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, image);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      await updateDoc(eventRef, {
        title,
        imageUrl,
        description,
        location,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
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

      setError("Event updated successfully!");
      navigate(`/events/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      setError("An error occurred while updating the event. Please try again.");
    } finally {
      setUpdating(false);
      setImageUploadProgress(null);
    }
  };

  if (loading) {
    return <div className="loading-text">Loading event details...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="form-container px-4"
        role="form"
        aria-labelledby="edit-event-header"
      >
        <h2
          id="edit-event-header"
          className="text-center text-xl font-bold mb-6"
        >
          Edit Event
        </h2>
        <form onSubmit={handleUpdateEvent}>
          <div className="mb-4">
            <label htmlFor="event-title" className="form-label">
              Title:
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="event-description" className="form-label">
              Description:
            </label>
            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-input"
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="event-location" className="form-label">
              Location:
            </label>
            <input
              id="event-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="form-input"
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="start-datetime" className="form-label">
              Start Date and Time:
            </label>
            <input
              id="start-datetime"
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              required
              className="form-input"
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="end-datetime" className="form-label">
              End Date and Time:
            </label>
            <input
              id="end-datetime"
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              required
              className="form-input"
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="event-price" className="form-label">
              Price:
            </label>
            <input
              id="event-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="form-input"
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="event-image" className="form-label">
              Event Image:
            </label>
            <input
              id="event-image"
              type="file"
              onChange={handleImageChange}
              className="form-input"
              aria-describedby="image-upload-instructions"
            />
            {uploadError && <div className="error-message">{uploadError}</div>}
            {imageUploadProgress !== null && (
              <div className="progress-bar" aria-live="polite">
                Uploading Image: {Math.round(imageUploadProgress)}%
              </div>
            )}
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={updating}
              className={`button ${
                updating ? "button-disabled" : "button-primary"
              }`}
            >
              {updating ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
