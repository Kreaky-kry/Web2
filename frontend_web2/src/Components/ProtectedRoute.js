// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/noconnect" replace />;
  }

  return children;
};

export default ProtectedRoute;
