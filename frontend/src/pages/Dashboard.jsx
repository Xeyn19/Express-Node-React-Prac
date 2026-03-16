import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import { authenticatedFetch } from "../lib/api";
import { toastError } from "../lib/toast";

const statusClass = (status) => {
  switch (status) {
    case "Interview":
      return "interview";
    case "Offer":
      return "offer";
    case "Rejected":
      return "rejected";
    default:
      return "applied";
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    },
    recentJobs: [],
    successRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await authenticatedFetch("/api/dashboard/stats");
        const result = response.data || {};

        if (isMounted) {
          setStats({
            total: result.total || 0,
            byStatus: result.byStatus || {
              Applied: 0,
              Interview: 0,
              Offer: 0,
              Rejected: 0,
            },
            recentJobs: result.recentJobs || [],
            successRate: result.successRate || 0,
          });
        }
      } catch (fetchError) {
        if (isMounted) {
          const message =
            fetchError?.response?.data?.message ||
            fetchError.message ||
            "Unable to load dashboard.";
          setError(message);
          toastError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusBreakdown = [
    { name: "Applied", value: stats.byStatus.Applied || 0 },
    { name: "Interview", value: stats.byStatus.Interview || 0 },
    { name: "Offer", value: stats.byStatus.Offer || 0 },
    { name: "Rejected", value: stats.byStatus.Rejected || 0 },
  ];

  const cards = [
    { label: "Total Applications", value: stats.total, tone: "total" },
    {
      label: "Interviews",
      value: stats.byStatus.Interview || 0,
      tone: "interview",
    },
    { label: "Offers", value: stats.byStatus.Offer || 0, tone: "offer" },
    {
      label: "Rejected",
      value: stats.byStatus.Rejected || 0,
      tone: "rejected",
    },
    { label: "Success Rate", value: `${stats.successRate}%`, tone: "total" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Monitor your pipeline and stay on top of every application.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`card-skeleton-${index}`}
                className="skeleton-panel p-5"
              >
                <div className="h-3 w-24 skeleton-line" />
                <div className="mt-4 h-7 w-16 skeleton-line" />
              </div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 skeleton-panel p-6">
              <div className="h-4 w-40 skeleton-line" />
              <div className="mt-4 h-64 skeleton-line" />
            </div>
            <div className="skeleton-panel p-6">
              <div className="h-4 w-32 skeleton-line" />
              <div className="mt-4 h-40 skeleton-line" />
            </div>
          </div>
          <div className="skeleton-panel">
            <div className="app-divider px-6 py-4">
              <div className="h-4 w-40 skeleton-line" />
            </div>
            <div className="p-6">
              <div className="h-32 skeleton-line" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {error && <div className="sr-only">{error}</div>}

          {!error && stats.total === 0 && (
            <div className="surface p-10 text-center">
              <div className="mx-auto mb-4 empty-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              </div>
              <h3 className="page-title">No applications yet</h3>
              <p className="page-subtitle mt-1">
                Start by adding your first job application to track progress.
              </p>
              <Link to="/add-job" className="btn btn-primary btn-sm mt-4">
                Add your first application
              </Link>
            </div>
          )}

          {!error && stats.total > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {cards.map((stat) => (
                  <div
                    key={stat.label}
                    className="surface stat-card"
                  >
                    {stat.tone !== "total" && (
                      <span
                        className={`stat-strip strip-${stat.tone}`}
                        aria-hidden="true"
                      />
                    )}
                    <p className="stat-label">{stat.label}</p>
                    <p
                      className={[
                        "mt-2 stat-value",
                        stat.tone === "interview" && "interview",
                        stat.tone === "offer" && "offer",
                        stat.tone === "rejected" && "rejected",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 surface p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="section-heading">Status Breakdown</h2>
                    <span className="text-xs text-secondary">All time</span>
                  </div>
                  <div className="mt-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusBreakdown} barSize={36}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                        />
                        <YAxis
                          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="var(--accent-2)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="surface p-6">
                  <h2 className="section-heading">Success Rate</h2>
                  <p className="page-subtitle mt-2">
                    Offers compared to your total applications.
                  </p>
                  <div className="mt-6 surface-2 p-4">
                    <p className="text-3xl font-semibold text-primary">
                      {stats.successRate}%
                    </p>
                    <p className="text-xs text-secondary">
                      {stats.byStatus.Offer || 0} offers from {stats.total}{" "}
                      applications
                    </p>
                  </div>
                </div>
              </div>

              <div className="surface">
                <div className="flex items-center justify-between app-divider px-6 py-4">
                  <h2 className="section-heading">Recent Applications</h2>
                  <span className="text-xs text-secondary">Last 5</span>
                </div>
                <div className="overflow-x-auto table-container">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left font-medium">Role</th>
                        <th className="text-left font-medium">Company</th>
                        <th className="text-left font-medium">Status</th>
                        <th className="text-left font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentJobs.map((application) => (
                        <tr key={application.id}>
                          <td className="text-[13px] font-semibold">
                            {application.position}
                          </td>
                          <td className="text-secondary">
                            {application.company}
                          </td>
                          <td>
                            <span
                              className={`badge ${statusClass(
                                application.status
                              )}`}
                            >
                              {application.status}
                            </span>
                          </td>
                          <td className="text-muted">
                            {application.date_applied}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
