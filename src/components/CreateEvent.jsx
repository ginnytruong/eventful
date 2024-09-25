import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

    // const currentUser = auth.currentUser;

    // if(!currentUser){
    //     alert("You must be logged in to create a new event.");
    //     return;
    // }

    try {
        await addDoc(collection(db, "Events"), {
            title,
            description,
            date: new Date(date),
            price: parseFloat(price),
            // creatorId: currentUser.uid
        });
        console.log("Event created successfully!");
        navigate("/");
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