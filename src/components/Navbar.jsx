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
    <nav className="bg-white shadow p-4">
      <div className="flex justify-between items-center">
        <div className="text-gray-800 text-lg font-bold">
          <Link to="/">Event App</Link>
        </div>
        <div className="space-x-4">
          <Link
            to="/events"
            className="text-gray-800 hover:bg-gray-200 px-3 py-2 rounded"
          >
            Events
          </Link>
          {role !== "staff" && (
            <Link
              to="/my-events"
              className="text-gray-800 hover:bg-gray-200 px-3 py-2 rounded"
            >
              My Events
            </Link>
          )}
          {!user ? (
            <Link
              to="/login"
              className="text-gray-800 hover:bg-gray-200 px-3 py-2 rounded"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-gray-800 hover:bg-gray-200 px-3 py-2 rounded"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          )}
          {role === "staff" && (
            <Link
              to="/create-event"
              className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-2 rounded"
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
