import React, { useContext, useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
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

      await addDoc(collection(db, "Events"), {
        title,
        description,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        price: parseFloat(price),
        location,
        creatorID: user.uid,
        imageUrl,
      });
      const docRef = await addDoc(collection(db, "Events"), eventData);
      await updateDoc(docRef, { id: docRef.id });

      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = () => {
    const isPriceValid = price >= 0;
    const isStartDateValid = new Date(startDateTime) > new Date();
    const isEndDateValid = new Date(endDateTime) > new Date(startDateTime);
    return (
      !title ||
      !description ||
      !location ||
      !startDateTime ||
      !endDateTime ||
      !isPriceValid ||
      !isStartDateValid ||
      !isEndDateValid ||
      loading
    );
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
            disabled={isButtonDisabled()}
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