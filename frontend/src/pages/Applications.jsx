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
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateSort, setDateSort] = useState("newest");
  const [editingJobId, setEditingJobId] = useState(null);
  const [editForm, setEditForm] = useState({
    company: "",
    position: "",
    status: "Applied",
    date_applied: "",
    job_url: "",
    notes: "",
  });
  const [editResumeFile, setEditResumeFile] = useState(null);
  const [editResumeUrl, setEditResumeUrl] = useState(null);

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

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredJobs = jobs
    .filter((job) => {
      if (statusFilter === "All") {
        return true;
      }
      return job.status === statusFilter;
    })
    .filter((job) => {
      if (!normalizedSearch) {
        return true;
      }
      const company = job.company?.toLowerCase() || "";
      const position = job.position?.toLowerCase() || "";
      return (
        company.includes(normalizedSearch) || position.includes(normalizedSearch)
      );
    })
    .sort((a, b) => {
      const aDate = new Date(a.date_applied || 0).getTime();
      const bDate = new Date(b.date_applied || 0).getTime();
      if (dateSort === "oldest") {
        return aDate - bDate;
      }
      return bDate - aDate;
    });

  const openEditModal = (job) => {
    setError("");
    setEditingJobId(job.id);
    setEditForm({
      company: job.company || "",
      position: job.position || "",
      status: job.status || "Applied",
      date_applied: job.date_applied || "",
      job_url: job.job_url || "",
      notes: job.notes || "",
    });
    setEditResumeFile(null);
    setEditResumeUrl(job.resume_url || null);
  };

  const closeEditModal = () => {
    if (isSaving) {
      return;
    }
    setEditingJobId(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!editForm.company.trim() || !editForm.position.trim()) {
      setError("Company and position are required.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = new FormData();
      payload.append("company", editForm.company.trim());
      payload.append("position", editForm.position.trim());
      payload.append("status", editForm.status);
      payload.append("date_applied", editForm.date_applied);
      if (editForm.job_url.trim()) {
        payload.append("job_url", editForm.job_url.trim());
      }
      if (editForm.notes.trim()) {
        payload.append("notes", editForm.notes.trim());
      }
      if (editResumeFile) {
        payload.append("resume", editResumeFile);
      }

      const response = await authenticatedFetch(
        `/api/jobs/${editingJobId}`,
        {
          method: "PATCH",
          body: payload,
        }
      );
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to update application.");
      }

      setJobs((previous) =>
        previous.map((job) =>
          job.id === editingJobId
            ? {
                ...job,
                ...result.job,
                job_url: result.job?.job_url ?? null,
                notes: result.job?.notes ?? null,
                resume_url: result.job?.resume_url ?? job.resume_url,
              }
            : job
        )
      );
      setSuccessMessage("Job application updated.");
      setEditResumeFile(null);
      setEditResumeUrl(result.job?.resume_url ?? editResumeUrl);
      setEditingJobId(null);
    } catch (saveError) {
      setError(saveError.message || "Unable to update application.");
    } finally {
      setIsSaving(false);
    }
  };

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
            {jobs.length
              ? `Showing ${filteredJobs.length} of ${jobs.length} applications`
              : "No data yet"}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              Search
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search company or role"
                className="input input-bordered w-full"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              Status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="select select-bordered w-full"
              >
                <option>All</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              Date Sort
              <select
                value={dateSort}
                onChange={(event) => setDateSort(event.target.value)}
                className="select select-bordered w-full"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </label>
          </div>

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

          {!isLoading && jobs.length > 0 && filteredJobs.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No applications match your search and filters.
            </div>
          )}

          {!isLoading && filteredJobs.length > 0 && (
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
                  {filteredJobs.map((job) => (
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
                            onClick={() => openEditModal(job)}
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

      {editingJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Edit Application
              </h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={closeEditModal}
                disabled={isSaving}
              >
                Close
              </button>
            </div>
            <form className="space-y-4 p-6" onSubmit={handleEditSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  Company
                  <input
                    type="text"
                    name="company"
                    value={editForm.company}
                    onChange={handleEditChange}
                    className="input input-bordered w-full"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  Position
                  <input
                    type="text"
                    name="position"
                    value={editForm.position}
                    onChange={handleEditChange}
                    className="input input-bordered w-full"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  Status
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="select select-bordered w-full"
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  Date Applied
                  <input
                    type="date"
                    name="date_applied"
                    value={editForm.date_applied}
                    onChange={handleEditChange}
                    className="input input-bordered w-full"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                Job URL
                <input
                  type="url"
                  name="job_url"
                  value={editForm.job_url}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                Notes
                <textarea
                  rows="3"
                  name="notes"
                  value={editForm.notes}
                  onChange={handleEditChange}
                  className="textarea textarea-bordered w-full"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                Resume
                {editResumeUrl && (
                  <a
                    href={editResumeUrl}
                    className="text-xs text-slate-600 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View current resume
                  </a>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="file-input file-input-bordered w-full"
                  onChange={(event) =>
                    setEditResumeFile(event.target.files?.[0] || null)
                  }
                />
                {editResumeFile && (
                  <span className="text-xs text-slate-400">
                    Selected: {editResumeFile.name}
                  </span>
                )}
              </label>

              {error && <div className="alert alert-error py-2">{error}</div>}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={closeEditModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary btn-sm ${
                    isSaving ? "btn-disabled" : ""
                  }`}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
