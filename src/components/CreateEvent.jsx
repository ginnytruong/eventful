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
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!title) errors.title = "Title is required.";
    if (!description) errors.description = "Description is required.";
    if (!location) errors.location = "Location is required.";
    if (!startDateTime)
      errors.startDateTime = "Start date and time are required.";
    if (!endDateTime) errors.endDateTime = "End date and time are required.";
    if (price < 0) errors.price = "Price must be a positive number.";
    if (!image) errors.image = "You must upload an image.";

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);
    if (startDate <= new Date())
      errors.startDateTime = "Start date must be in the future.";
    if (endDate <= startDate)
      errors.endDateTime = "End date must be after the start date.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      if (!user) {
        alert("You must be logged in to create an event.");
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
              className={`form-input ${
                formErrors.title ? "border-red-500" : ""
              }`}
            />
            {formErrors.title && (
              <small className="text-red-500">{formErrors.title}</small>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`form-input ${
                formErrors.description ? "border-red-500" : ""
              }`}
            />
            {formErrors.description && (
              <small className="text-red-500">{formErrors.description}</small>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`form-input ${
                formErrors.location ? "border-red-500" : ""
              }`}
            />
            {formErrors.location && (
              <small className="text-red-500">{formErrors.location}</small>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Start Date and Time:</label>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              className={`form-input ${
                formErrors.startDateTime ? "border-red-500" : ""
              }`}
            />
            {formErrors.startDateTime && (
              <small className="text-red-500">{formErrors.startDateTime}</small>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">End Date and Time:</label>
            <input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className={`form-input ${
                formErrors.endDateTime ? "border-red-500" : ""
              }`}
            />
            {formErrors.endDateTime && (
              <small className="text-red-500">{formErrors.endDateTime}</small>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              className={`form-input ${
                formErrors.price ? "border-red-500" : ""
              }`}
            />
            {formErrors.price && (
              <small className="text-red-500">{formErrors.price}</small>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Event Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              className={`form-input ${
                formErrors.image ? "border-red-500" : ""
              }`}
            />
            {formErrors.image && (
              <small className="text-red-500">{formErrors.image}</small>
            )}
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
