import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("revogueUser"));

  // Get current page location
  const location = useLocation();

  if (!user) {
    // Not logged in → redirect to login page
    // We also save where they were trying to go
    // So after login we can send them back there
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in → show the page normally
  return children;
}

export default ProtectedRoute;