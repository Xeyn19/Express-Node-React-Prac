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
import { authenticatedFetch } from "../lib/api";

const statusBadge = (status) => {
  switch (status) {
    case "Interview":
      return "bg-blue-100 text-blue-700";
    case "Offer":
      return "bg-emerald-100 text-emerald-700";
    case "Rejected":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-amber-100 text-amber-700";
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
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Unable to load dashboard.");
        }

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
          setError(fetchError.message || "Unable to load dashboard.");
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
    { label: "Total Applications", value: stats.total },
    { label: "Interviews", value: stats.byStatus.Interview || 0 },
    { label: "Offers", value: stats.byStatus.Offer || 0 },
    { label: "Rejected", value: stats.byStatus.Rejected || 0 },
    { label: "Success Rate", value: `${stats.successRate}%` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Monitor your pipeline and stay on top of every application.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`card-skeleton-${index}`}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-3 w-24 rounded bg-slate-200" />
                <div className="mt-4 h-7 w-16 rounded bg-slate-200" />
              </div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="mt-4 h-64 rounded bg-slate-100" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="mt-4 h-40 rounded bg-slate-100" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <div className="h-4 w-40 rounded bg-slate-200" />
            </div>
            <div className="p-6">
              <div className="h-32 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {error && <div className="alert alert-error py-2">{error}</div>}

          {!error && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {cards.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Status Breakdown
                    </h2>
                    <span className="text-xs text-slate-400">All time</span>
                  </div>
                  <div className="mt-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusBreakdown} barSize={36}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#64748b", fontSize: 12 }}
                        />
                        <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="#0f172a"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Success Rate
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Offers compared to your total applications.
                  </p>
                  <div className="mt-6 rounded-lg border border-slate-200 p-4">
                    <p className="text-3xl font-semibold text-slate-900">
                      {stats.successRate}%
                    </p>
                    <p className="text-xs text-slate-400">
                      {stats.byStatus.Offer || 0} offers from {stats.total}{" "}
                      applications
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Recent Applications
                  </h2>
                  <span className="text-xs text-slate-400">Last 5</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium">Role</th>
                        <th className="px-6 py-3 text-left font-medium">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.recentJobs.length === 0 ? (
                        <tr>
                          <td
                            className="px-6 py-4 text-slate-500"
                            colSpan={4}
                          >
                            No applications yet.
                          </td>
                        </tr>
                      ) : (
                        stats.recentJobs.map((application) => (
                          <tr key={application.id}>
                            <td className="px-6 py-4 font-medium text-slate-800">
                              {application.position}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {application.company}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(
                                  application.status
                                )}`}
                              >
                                {application.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {application.date_applied}
                            </td>
                          </tr>
                        ))
                      )}
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
