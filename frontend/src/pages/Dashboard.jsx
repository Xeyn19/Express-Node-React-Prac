import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  { label: "Total Applications", value: 28, trend: "+4 this week" },
  { label: "Interviews", value: 6, trend: "+1 scheduled" },
  { label: "Offers", value: 2, trend: "1 pending" },
  { label: "Rejected", value: 9, trend: "-2 this month" },
];

const statusBreakdown = [
  { name: "Applied", value: 12 },
  { name: "Interview", value: 6 },
  { name: "Offer", value: 2 },
  { name: "Rejected", value: 8 },
];

const recentApplications = [
  {
    role: "Frontend Developer",
    company: "Nimbus Labs",
    status: "Interview",
    date: "Mar 14, 2026",
  },
  {
    role: "Product Designer",
    company: "Northwind",
    status: "Applied",
    date: "Mar 12, 2026",
  },
  {
    role: "Full Stack Engineer",
    company: "Velocity",
    status: "Offer",
    date: "Mar 10, 2026",
  },
  {
    role: "UI Engineer",
    company: "Helios",
    status: "Rejected",
    date: "Mar 08, 2026",
  },
  {
    role: "React Developer",
    company: "Orion Studio",
    status: "Applied",
    date: "Mar 05, 2026",
  },
];

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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Monitor your pipeline and stay on top of every application.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Status Breakdown
            </h2>
            <span className="text-xs text-slate-400">Last 30 days</span>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusBreakdown} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Activity Focus
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep momentum by following up on interview requests.
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">
                Follow up emails
              </p>
              <p className="text-2xl font-semibold text-slate-900">3</p>
              <p className="text-xs text-slate-400">Due this week</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">
                Upcoming interviews
              </p>
              <p className="text-2xl font-semibold text-slate-900">2</p>
              <p className="text-xs text-slate-400">Next 7 days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Applications
          </h2>
          <span className="text-xs text-slate-400">Showing last 5</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Role</th>
                <th className="px-6 py-3 text-left font-medium">Company</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentApplications.map((application) => (
                <tr key={`${application.role}-${application.company}`}>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {application.role}
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
                    {application.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
