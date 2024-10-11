import React, { useContext, useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, updateDoc} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user) {
        alert("You must be logged in to create an event.");
        setLoading(false);
        return;
      }

      if (!title) {
        setError("You must fill in the title.");
        setLoading(false);
        return;
      }
      if (!description) {
        setError("You must fill in the description.");
        setLoading(false);
        return;
      }
      if (!location) {
        setError("You must fill in the location.");
        setLoading(false);
        return;
      }
      if (!startDateTime) {
        setError("You must fill in the start date and time.");
        setLoading(false);
        return;
      }
      if (!endDateTime) {
        setError("You must fill in the end date and time.");
        setLoading(false);
        return;
      }
      if (price < 0) {
        setError("Price must be a positive number.");
        setLoading(false);
        return;
      }
      if (image === null) {
        setError("You must upload an image.");
        setLoading(false);
        return;
      }

      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);

      if (startDate <= new Date()) {
        setError("Start date and time must be in the future.");
        setLoading(false);
        return;
      }
      if (endDate <= startDate) {
        setError("End date and time must be after start date and time.");
        setLoading(false);
        return;
      }

      let imageUrl = null;

      if (image) {
        const uniqueFilename = `${uuidv4()}-${image.name}`;
        const storageRef = ref(storage, `event_images/${uniqueFilename}`);

        const uploadTask = uploadBytesResumable(storageRef, image);
        await uploadTask;
        imageUrl = await getDownloadURL(storageRef);
      }

      const docRef = await addDoc(collection(db, "Events"), {
        title,
        description,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        price: parseFloat(price),
        location,
        creatorID: user.uid,
        imageUrl,
      });

      const eventId = docRef.id;

      await updateDoc(docRef, { id: eventId });

      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="form-container">
        <h2 className="text-center text-xl font-bold mb-6">Create Event</h2>
        <form onSubmit={handleSubmit}>
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
            <label className="form-label">Start Date and Time:</label>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">End Date and Time:</label>
            <input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
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
              min="0"
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
          {error && (
            <div className="error-message text-red-600 mb-4">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`button ${
              loading ? "button-disabled" : "button-primary"
            }`}
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
