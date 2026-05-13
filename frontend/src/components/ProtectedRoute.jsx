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
      <div className="auth-shell flex items-center justify-center px-4">
        <div className="surface w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-sky-300/20 bg-sky-400/10 p-3 text-sky-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-full w-full"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-9-9 9 9 0 019 9z"
              />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-secondary">
            Session check
          </p>
          <h1 className="mt-3 text-2xl font-bold text-primary">
            Verifying your access
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Loading your workspace and restoring your session details.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-secondary">
            <span className="loading loading-spinner loading-sm" />
            Checking your session...
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
