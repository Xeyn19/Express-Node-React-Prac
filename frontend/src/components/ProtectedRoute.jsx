import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAccessToken } from "../lib/auth";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isAuthLoading } = useAuth();
  const accessToken = getAccessToken();

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: "Please login to continue.",
          from: location.pathname,
        }}
      />
    );
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center auth-page px-4">
        <div className="card auth-card">
          <div className="card-body">
            <p className="text-base">Checking your session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: "Please login to continue.",
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
