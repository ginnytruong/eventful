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
        <div className="text-gray-800 text-xl font-bold">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#FF5A5F"
              className="w-8 h-8 text-gray-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 4h10M3 11h18M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
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
