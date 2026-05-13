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
    fullName || user?.name || user?.username || user?.email || "User";
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

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      {isSidebarOpen && (
        <div
          className="app-overlay fixed inset-0 z-30 md:hidden"
          onClick={closeSidebar}
          role="presentation"
        />
      )}

      <div className="flex min-h-screen">
        <aside
          className={`app-sidebar fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col transition-transform duration-200 md:static md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-6 py-6">
            <div className="app-logo">
              <span className="app-logo-accent">Job</span>
              <span className="app-logo-track">Track</span>
            </div>
            <p className="mt-3 text-sm text-secondary">
              Keep your pipeline focused, searchable, and easy to act on.
            </p>
          </div>

          <nav className="app-nav px-3 pb-6">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  ["app-nav-item", isActive ? "is-active" : ""]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto px-4 pb-5">
            <div className="sidebar-summary">
              <p className="sidebar-summary-label">Daily Reminder</p>
              <p className="sidebar-summary-copy">
                Review recent applications, keep notes current, and follow up
                before opportunities go cold.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="app-topbar flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
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
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  Pipeline workspace
                </p>
                <p className="text-sm font-semibold text-primary">
                  Welcome back
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="user-chip">
                <div className="user-avatar">{initials || "U"}</div>
                <div className="user-chip-copy hidden sm:block">
                  <span className="user-chip-label">Signed in as</span>
                  <span className="user-chip-name">{displayName}</span>
                </div>
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

          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
