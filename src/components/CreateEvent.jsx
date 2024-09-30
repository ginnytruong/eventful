import React, { useContext, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateEvent = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState(0);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

    try {
        if(!user) {
            alert("You must be logged in to create an event.");
            return;
        }

        await addDoc(collection(db, "Events"), {
            title,
            description,
            date: new Date(date),
            price: parseFloat(price),
            creatorID: user.uid,
        });
        console.log("Event created successfully!");
        navigate("/events");
    } catch (error) {
        console.error("Error creating event:", error);
        alert("An error occurred while creating the event. Please try again.")
    }
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
            <button type="submit">Create Event</button>
        </form>
    </div>
)
};

export default CreateEvent;