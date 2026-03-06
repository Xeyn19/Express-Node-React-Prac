import React from "react";
import { Link, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const storedUser = localStorage.getItem("authUser");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const user = location.state?.user || parsedUser;

  const fullName = user
    ? `${user.first_name || user.firstName || ""} ${user.last_name || user.lastName || ""}`.trim()
    : "";

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">
            {fullName ? `Welcome back !, ${fullName.toUpperCase()}` : "Welcome, User"}
          </h1>

          {!fullName && (
            <p className="text-sm text-base-content/70">
              Please login to load your name.
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
