import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

return (
  <nav className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center font-poppins">
      <div className="flex items-center text-gray-800 text-2xl font-bold">
        <Link to="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#FF5A5F"
            viewBox="0 0 24 24"
            stroke="none"
            className="w-8 h-8"
          >
            <path d="M12 2C8.1 2 5 5.1 5 9c0 3.9 7 13 7 13s7-9.1 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5 14.5 7.6 14.5 9 13.4 11.5 12 11.5z" />
          </svg>
          <span
            className="text-[#FF5A5F]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Eventful
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <Link
          to="/events"
          className="text-gray-800 hover:bg-gray-200 px-4 py-2 rounded transition duration-200"
        >
          Events
        </Link>
        {role !== "staff" && (
          <Link
            to="/my-events"
            className="text-gray-800 hover:bg-gray-200 px-4 py-2 rounded transition duration-200"
          >
            My Events
          </Link>
        )}
        {!user ? (
          <>
            <Link
              to="/login"
              className="text-gray-800 hover:bg-gray-200 px-4 py-2 rounded transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/create-account"
              className="text-gray-800 hover:bg-gray-200 px-4 py-2 rounded transition duration-200"
            >
              Create Account
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-gray-800 hover:bg-gray-200 px-4 py-2 rounded transition duration-200"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        )}
        {role === "staff" && (
          <Link
            to="/create-event"
            className="bg-[#FF5A5F] text-white hover:bg-[#FF4C4F] px-4 py-2 rounded transition duration-200"
          >
            Create Event
          </Link>
        )}
      </div>
    </div>
  </nav>
);
};

export default Navbar;
