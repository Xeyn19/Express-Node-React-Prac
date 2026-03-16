import React from "react";
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
    navigate("/login", {
      replace: true,
      state: { message: "Logged out successfully." },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 border-b md:border-b-0 md:border-r border-slate-800">
        <div className="px-6 py-5 text-lg font-semibold tracking-tight">
          Job Tracker
        </div>
        <nav className="px-3 pb-6 flex flex-col gap-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="text-sm text-slate-500">Welcome back</div>
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
