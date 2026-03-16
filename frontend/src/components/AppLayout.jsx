import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Dashboard", to: "/dashboard" },
  { name: "Applications", to: "/applications" },
  { name: "Add Job", to: "/add-job" },
  { name: "Profile", to: "/profile" },
];

const AppLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fullName = user
    ? `${user.first_name || user.firstName || ""} ${user.last_name || user.lastName || ""}`.trim()
    : "";
  const displayName =
    fullName ||
    user?.name ||
    user?.username ||
    user?.email ||
    "User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("logoutToast", "1");
    }
    navigate("/login", {
      replace: true,
    });
  };

  const handleNavClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex app-shell">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden app-overlay"
          onClick={() => setIsSidebarOpen(false)}
          role="presentation"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 md:static md:translate-x-0 app-sidebar ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-5 app-logo">
          <span className="app-logo-accent">Job</span>
          <span className="app-logo-track">Track</span>
        </div>
        <nav className="px-3 pb-6 app-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                [
                  "flex items-center app-nav-item",
                  isActive ? "is-active" : "",
                ].join(" ")
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 text-xs text-secondary app-divider">
          Stay focused on the pipeline.
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        <header className="app-topbar flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-ghost btn-sm md:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="text-secondary text-sm">Welcome back</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="user-avatar">
                {initials || "U"}
              </div>
              <div className="text-sm text-secondary">{displayName}</div>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
