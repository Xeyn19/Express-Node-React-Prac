import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const refreshedUser = await refreshUser();

        if (!refreshedUser) {
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Please login again." },
          });
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load your profile.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate, refreshUser, user]);

  const fullName = user
    ? `${user.first_name || user.firstName || ""} ${user.last_name || user.lastName || ""}`.trim()
    : "";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true, state: { message: "Logged out successfully." } });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">
            {fullName ? `Welcome back !, ${fullName.toUpperCase()}` : "Welcome, User"}
          </h1>

          {isLoading && (
            <p className="text-sm text-base-content/70">Loading your session...</p>
          )}

          {error && <div className="alert alert-error py-2 mt-3">{error}</div>}

          {!fullName && (
            <p className="text-sm text-base-content/70">
              Please login to load your name.
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <Link to="/recipes" className="btn btn-primary">
              View Recipes
            </Link>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
