import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { authenticatedFetch } from "../lib/api";

const Applications = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ""
  );
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadJobs = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await authenticatedFetch("/api/jobs");
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Unable to load applications.");
        }

        if (isMounted) {
          setJobs(result.jobs || []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || "Unable to load applications.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timer = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleDelete = async (jobId) => {
    if (!jobId) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this job application? This cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(jobId);
      const response = await authenticatedFetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete application.");
      }

      setJobs((previous) => previous.filter((job) => job.id !== jobId));
      setSuccessMessage("Job application deleted.");
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete application.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Applications
          </h1>
          <p className="text-sm text-slate-500">
            Track every role you have applied to and keep notes in one place.
          </p>
        </div>
        <Link to="/add-job" className="btn btn-primary btn-sm">
          Add Job
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Application Pipeline
            </h2>
            <p className="text-sm text-slate-500">
              Organize your applications as you move through each stage.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {jobs.length ? `${jobs.length} total` : "No data yet"}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {successMessage && (
            <div className="alert alert-success py-2">{successMessage}</div>
          )}
          {error && <div className="alert alert-error py-2">{error}</div>}
          {isLoading && (
            <div className="text-sm text-slate-500">Loading applications...</div>
          )}

          {!isLoading && !jobs.length && !error && (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              Your application list will show up here once you add new jobs.
            </div>
          )}

          {!isLoading && jobs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Company</th>
                    <th className="px-4 py-2 text-left font-medium">Role</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Date Applied
                    </th>
                    <th className="px-4 py-2 text-left font-medium">Resume</th>
                    <th className="px-4 py-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {job.company}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {job.position}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                            job.status === "Applied" && "bg-blue-100 text-blue-700",
                            job.status === "Interview" &&
                              "bg-amber-100 text-amber-700",
                            job.status === "Offer" &&
                              "bg-emerald-100 text-emerald-700",
                            job.status === "Rejected" &&
                              "bg-rose-100 text-rose-700",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {job.date_applied}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {job.resume_url ? (
                          <a
                            href={job.resume_url}
                            className="text-slate-900 underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            disabled
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs text-rose-600"
                            onClick={() => handleDelete(job.id)}
                            disabled={isDeleting === job.id}
                          >
                            {isDeleting === job.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
