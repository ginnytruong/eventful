import React, { useState, useEffect } from "react";
import { auth, db, provider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/google-icon.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    emailPassword: false,
    google: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/events");
      }
    });
    return () => unsubscribe();
  }, [navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, emailPassword: true }));
    setError("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email format.");
      setLoading((prev) => ({ ...prev, emailPassword: false }));
      setError("");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        navigate(userRole === "staff" ? "/create-event" : "/events");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/too-many-requests") {
        setError(
          "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or try again later."
        );
      } else if (error.code === "auth/invalid-credential") {
        setError(
          "Incorrect email or password. Please try again or create an account."
        );
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, emailPassword: false }));
    }
  };

  const handleGoogleLogin = async () => {
    setLoading((prev) => ({ ...prev, emailPassword: false }));
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          fullName: user.displayName,
          eventsRegistered: [],
          role: "non-staff",
        });
      }

      const userData = await getDoc(doc(db, "Users", user.uid));
      const userRole = userData.data().role;

      navigate(userRole === "staff" ? "/create-event" : "/events");
    } catch (error) {
      console.error("Google Login error:", error);
      setError("An error occurred during Google login. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, emailPassword: false }));
    }
  };


  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100">
      <div className="form-container w-full max-w-sm mx-4">
        <h2 className="text-center text-xl font-bold mb-4 mt-2">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-2">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              aria-label="Email input"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              aria-label="Password input"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading.emailPassword}
              className={`button ${
                loading.emailPassword ? "button-disabled" : "button-primary"
              } w-48`}
            >
              {loading.emailPassword ? "Logging In..." : "Log In"}
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading.google}
              className={`flex items-center justify-center border border-gray-300 rounded-full p-2 mt-4 mb-4${
                loading.google ? "button-disabled" : ""
              }`}
              aria-label="Log in with Google"
            >
              <img src={googleLogo} alt="Google Logo" className="w-8 h-8" />
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
