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
          <Link to="/">Event App</Link>
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
