import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      setError("An error occurred while logging out. Please try again.");
    }
  };

return (
  <nav className="bg-white shadow-md" aria-label="Main navigation">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center font-poppins">
      <div className="flex items-center text-gray-800 text-2xl font-bold">
        <Link to="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#FF5A5F"
            viewBox="0 0 24 24"
            stroke="none"
            className="w-8 h-8"
            aria-hidden="true"
          >
            <path d="M12 2C8.1 2 5 5.1 5 9c0 3.9 7 13 7 13s7-9.1 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5 14.5 7.6 14.5 9 13.4 11.5 12 11.5z" />
          </svg>
          <span className="text-[#FF4C4F]">Eventful</span>
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/events" className="link-button" aria-label="View Events">
          Events
        </Link>
        {role !== "staff" && (
          <Link
            to="/my-events"
            className="link-button"
            aria-label="View My Events"
          >
            My Events
          </Link>
        )}
        {!user ? (
          <>
            <Link
              to="/login"
              className="link-button"
              aria-label="Login to your account"
            >
              Login
            </Link>
            <Link
              to="/create-account"
              className="link-button"
              aria-label="Create a new account"
            >
              Create Account
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="link-button"
            aria-label="Logout from your account"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        )}
        {role === "staff" && (
          <Link
            to="/create-event"
            className="link-button"
            aria-label="Create a new event"
          >
            Create Event
          </Link>
        )}
      </div>
    </div>

    {error && <div className="text-red-500 text-center mt-2">{error}</div>}
  </nav>
);
};

export default Navbar;
