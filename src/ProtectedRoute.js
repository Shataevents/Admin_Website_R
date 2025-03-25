import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "./firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null means loading
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
        setError("");
      } else {
        setIsAuthenticated(false); // User is not logged in
        setError("You are not logged in to the account to access.");
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // While checking auth state, show a loading message
  if (isAuthenticated === null) {
    return <div className="p-6 text-center text-gray-600 text-xl">Loading...</div>;
  }

  // If user is not authenticated, redirect to login with error message
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ error: error, from: location.pathname }}
        replace
      />
    );
  }

  // If user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;