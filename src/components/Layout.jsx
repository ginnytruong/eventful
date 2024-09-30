import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Layout = ({ children }) => {
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
  <div>
    <nav>
      <Link to="/events">Event List</Link>
      {user && role === "staff" && <Link to="/create-event">Create Event</Link>}
      {user && role !== "staff" && <Link to="/my-events">My Events</Link>}
      {user ? (
        <>
          <button onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/create-account">Create Account</Link>
        </>
      )}
    </nav>
    <main>{children}</main>
  </div>
);
};

export default Layout;