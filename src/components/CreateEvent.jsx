import React, { useContext, useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateEvent = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleImageChange = (e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

    try {
        if(!user) {
            alert("You must be logged in to create an event.");
            setLoading(false);
            return;
        }

        let imageUrl = null;

        if (image) {
          const storageRef = ref(storage, 'event_images/${image.name');
          const uploadTask = await uploadBytesResumable(storageRef, image);
          imageUrl = await getDownloadURL(uploadTask.ref);
        }
        await addDoc(collection(db, "Events"), {
            title,
            description,
            date: new Date(date),
            price: parseFloat(price),
            location,
            creatorID: user.uid,
            imageUrl,
        });
        navigate("/events");
    } catch (error) {
        console.error("Error creating event:", error);
        alert("An error occurred while creating the event. Please try again.")
    } finally {
        setLoading(false);
    }
};

const isButtonDisabled = () => {
    const isPriceValid = price >= 0;
    const isDateValid = new Date(date) > new Date();
    return !title || !description || !location || !date || !isPriceValid || !isDateValid || loading;
}

return (
  <div>
    <h2>Create Event</h2>
    <form onSubmit={handleSubmit}>
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
      <br />
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
          min="0"
        />
      </label>
      <br />
      <label>
        Event Image:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      <br />
      <button type="submit" disabled={isButtonDisabled()}>
        {loading ? "Creating Event..." : "Create Event"}
      </button>
    </form>
  </div>
);
};

export default CreateEvent;