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
        setError("You must be logged in to create an event.");
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
      setError("An error occurred while creating the event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100">
      <div
        className="form-container w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto p-6"
        role="form"
        aria-labelledby="create-event-header"
      >
        <h2
          id="create-event-header"
          className="text-center text-xl font-bold mb-6"
        >
          Create Event
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="event-title" className="form-label">
              Title:
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`form-input ${
                formErrors.title ? "border-red-500" : ""
              }`}
              aria-invalid={formErrors.title ? "true" : "false"}
            />
            {formErrors.title && (
              <small className="text-red-500">{formErrors.title}</small>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="event-description" className="form-label">
              Description:
            </label>
            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`form-input ${
                formErrors.description ? "border-red-500" : ""
              }`}
              aria-invalid={formErrors.description ? "true" : "false"}
            />
            {formErrors.description && (
              <small className="text-red-500">{formErrors.description}</small>
            )}
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
              className={`form-input ${
                formErrors.location ? "border-red-500" : ""
              }`}
              aria-invalid={formErrors.location ? "true" : "false"}
            />
            {formErrors.location && (
              <small className="text-red-500">{formErrors.location}</small>
            )}
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
              className={`form-input ${
                formErrors.startDateTime ? "border-red-500" : ""
              }`}
              aria-invalid={formErrors.startDateTime ? "true" : "false"}
            />
            {formErrors.startDateTime && (
              <small className="text-red-500">{formErrors.startDateTime}</small>
            )}
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
              className={`form-input ${
                formErrors.endDateTime ? "border-red-500" : ""
              }`}
              aria-invalid={formErrors.endDateTime ? "true" : "false"}
            />
            {formErrors.endDateTime && (
              <small className="text-red-500">{formErrors.endDateTime}</small>
            )}
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
              min="0"
              className={`form-input ${
                formErrors.price ? "border-red-500" : ""
              }`}
              aria-invalid={formErrors.price ? "true" : "false"}
            />
            {formErrors.price && (
              <small className="text-red-500">{formErrors.price}</small>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="event-image" className="form-label">
              Event Image:
            </label>
            <input
              id="event-image"
              type="file"
              onChange={handleImageChange}
              className={`form-input ${
                formErrors.image ? "border-red-500" : ""
              }`}
              aria-invalid={formErrors.image ? "true" : "false"}
              aria-describedby="image-upload-instructions"
            />
            <small id="image-upload-instructions" className="text-gray-600">
              Please upload an image for the event (JPG, PNG, max 5MB).
            </small>
            {formErrors.image && (
              <small className="text-red-500">{formErrors.image}</small>
            )}
          </div>

          {error && (
            <div
              className="error-message text-red-600 mb-4"
              aria-live="assertive"
            >
              {error}
            </div>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`button ${
                loading ? "button-disabled" : "button-primary"
              }`}
              aria-busy={loading}
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
