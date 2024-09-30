import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, role } = useAuth();

  if (!user || role !== "staff") {
    return <Navigate to="/events" />;
  }

  return children;
};

export default ProtectedRoute;
