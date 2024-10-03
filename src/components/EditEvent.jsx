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
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg font-poppins">
      <h2 className="text-center text-xl font-bold mb-6">Edit Event</h2>
      <form onSubmit={handleUpdateEvent}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date and Time:</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Event Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={updating}
          className={`w-full p-2 text-white font-bold rounded-md transition duration-200 ${
            loading ? "bg-gray-400" : "bg-[#FF5A5F] hover:bg-[#FF4C4F]"
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
