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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          role="presentation"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-slate-100 border-r border-slate-800 transition-transform duration-200 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-5 text-lg font-semibold tracking-tight">
          Job Tracker
        </div>
        <nav className="px-3 pb-6 flex flex-col gap-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white",
                ].join(" ")
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 text-xs text-slate-400 border-t border-slate-800">
          Track your job search with clarity.
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
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
            <div className="text-sm text-slate-500">Welcome back</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-slate-700">
              {displayName}
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
