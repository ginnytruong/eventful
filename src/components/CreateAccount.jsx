import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email.");
      setLoading(false);
      return;
    }

    const passwordStrengthPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/;
    if (!passwordStrengthPattern.test(password)) {
      setError(
        "Password must be at least 6 characters long, contain uppercase and lowercase letters, at least one number and one special character."
      );
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        fullName: fullName,
        eventsRegistered: [],
        role: "non-staff",
      });

      navigate("/events");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already registered. Please log in.");
      } else {
        setError("An error occured. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="form-container">
        <h4 className="text-center text-xl font-bold mb-6">Create Account</h4>
        <form onSubmit={handleCreateAccount}>
          <div className="mb-4">
            <label className="form-label">Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`button ${
              loading ? "button-disabled" : "button-primary"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};


export default CreateAccount;
