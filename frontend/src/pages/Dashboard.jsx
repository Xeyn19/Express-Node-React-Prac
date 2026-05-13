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
import AlertBanner from "../components/AlertBanner";
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
    <div className="space-y-6 lg:space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            See where your search stands, which stages need attention, and what
            should happen next.
          </p>
        </div>
        <div className="page-actions">
          <Link to="/applications" className="btn btn-outline btn-sm">
            Review applications
          </Link>
          <Link to="/add-job" className="btn btn-primary btn-sm">
            Add application
          </Link>
        </div>
      </div>

      <AlertBanner message={error} />

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
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
            <div className="skeleton-panel p-6">
              <div className="h-4 w-40 skeleton-line" />
              <div className="mt-4 h-72 skeleton-line" />
            </div>
            <div className="skeleton-panel p-6">
              <div className="h-4 w-32 skeleton-line" />
              <div className="mt-4 h-40 skeleton-line" />
            </div>
          </div>
          <div className="skeleton-panel p-6">
            <div className="h-4 w-40 skeleton-line" />
            <div className="mt-4 h-44 skeleton-line" />
          </div>
        </div>
      ) : (
        <>
          {!error && stats.total === 0 && (
            <div className="surface empty-state">
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
              <h2 className="page-title text-[1.7rem]">No applications yet</h2>
              <p className="page-subtitle mx-auto mt-2">
                Start tracking your first role so your dashboard can show stage
                counts, recent applications, and success rate.
              </p>
              <Link to="/add-job" className="btn btn-primary mt-5">
                Add your first application
              </Link>
            </div>
          )}

          {!error && stats.total > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {cards.map((stat) => (
                  <div key={stat.label} className="surface stat-card">
                    {stat.tone !== "total" && (
                      <span
                        className={`stat-strip strip-${stat.tone}`}
                        aria-hidden="true"
                      />
                    )}
                    <p className="stat-label">{stat.label}</p>
                    <p
                      className={[
                        "stat-value",
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

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
                <div className="chart-shell">
                  <div className="page-header gap-3">
                    <div>
                      <h2 className="section-heading">Status Breakdown</h2>
                      <p className="page-subtitle mt-2">
                        View how your applications are spread across each stage.
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.14em] text-secondary">
                      All time
                    </span>
                  </div>

                  <div className="mt-6 h-72 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusBreakdown} barSize={28}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(148, 163, 184, 0.14)"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(7, 15, 29, 0.96)",
                            border: "1px solid rgba(148, 163, 184, 0.18)",
                            borderRadius: "16px",
                            color: "#e6edf7",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="var(--accent)"
                          radius={[10, 10, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="surface p-6">
                  <h2 className="section-heading">Progress Snapshot</h2>
                  <p className="page-subtitle mt-2">
                    Use your offer count and success rate to see how efficiently
                    the pipeline is converting.
                  </p>

                  <div className="mt-6 info-grid">
                    <div className="info-card">
                      <p className="info-label">Success rate</p>
                      <p className="info-value">{stats.successRate}%</p>
                    </div>
                    <div className="info-card">
                      <p className="info-label">Offers received</p>
                      <p className="info-value">
                        {stats.byStatus.Offer || 0}
                      </p>
                    </div>
                    <div className="info-card">
                      <p className="info-label">Most active stage</p>
                      <p className="info-value">
                        {statusBreakdown.sort((a, b) => b.value - a.value)[0]
                          ?.name || "Applied"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface p-6">
                <div className="page-header gap-3">
                  <div>
                    <h2 className="section-heading">Recent Applications</h2>
                    <p className="page-subtitle mt-2">
                      The latest roles you added, updated, or reviewed.
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.14em] text-secondary">
                    Last 5
                  </span>
                </div>

                <div className="mt-6 md:hidden mobile-card-list">
                  {stats.recentJobs.map((application) => (
                    <article key={application.id} className="job-card">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="job-card-title">{application.position}</p>
                          <p className="mt-1 text-sm text-secondary">
                            {application.company}
                          </p>
                        </div>
                        <span className={`badge ${statusClass(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      <div className="job-card-meta">
                        <div className="job-card-row">
                          <span>Date applied</span>
                          <span>{application.date_applied}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-6 hidden md:block">
                  <div className="table-container overflow-x-auto">
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
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
