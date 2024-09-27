import React, {useEffect, useState} from "react";
import { auth, db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";


const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/events");
  };

  return (
    <div>
      <nav>
        <Link to="/events">Event List</Link>
        {user && role === "staff" && (
          <Link to="/create-event">Create Event</Link>
        )}
        {user ? (
          <>
            <button onClick={handleLogout}>Logout</button>
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
