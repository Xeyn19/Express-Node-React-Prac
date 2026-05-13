import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertBanner from "../components/AlertBanner";
import { authenticatedFetch } from "../lib/api";
import { toastError, toastSuccess } from "../lib/toast";

const statusOptions = ["All", "Applied", "Interview", "Offer", "Rejected"];

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

const ResumeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M7 3h7l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 3v4h4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11h8M8 14h8M8 17h5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Applications = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateSort, setDateSort] = useState("newest");
  const [editingJobId, setEditingJobId] = useState(null);
  const [editErrors, setEditErrors] = useState({});
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
        const result = response.data || {};

        if (isMounted) {
          setJobs(result.jobs || []);
        }
      } catch (fetchError) {
        if (isMounted) {
          const message =
            fetchError?.response?.data?.message ||
            fetchError.message ||
            "Unable to load applications.";
          setError(message);
          toastError(message);
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
    setEditErrors({});
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
    if (editErrors[name]) {
      setEditErrors((previous) => ({ ...previous, [name]: "" }));
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const validationErrors = {};

    if (!editForm.company.trim()) {
      validationErrors.company = "Company is required.";
    }
    if (!editForm.position.trim()) {
      validationErrors.position = "Position is required.";
    }
    if (!editForm.date_applied) {
      validationErrors.date_applied = "Date applied is required.";
    }

    setEditErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
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

      const response = await authenticatedFetch(`/api/jobs/${editingJobId}`, {
        method: "PATCH",
        data: payload,
      });
      const result = response.data || {};

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
      toastSuccess("Application updated.");
      setEditResumeFile(null);
      setEditResumeUrl(result.job?.resume_url ?? editResumeUrl);
      setEditingJobId(null);
    } catch (saveError) {
      const message =
        saveError?.response?.data?.message ||
        saveError.message ||
        "Unable to update application.";
      setError(message);
      toastError(message);
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
      await authenticatedFetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      setJobs((previous) => previous.filter((job) => job.id !== jobId));
      toastSuccess("Application deleted.");
    } catch (deleteError) {
      const message =
        deleteError?.response?.data?.message ||
        deleteError.message ||
        "Unable to delete application.";
      setError(message);
      toastError(message);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">
            Search, filter, review, and update every role without losing track
            of where each opportunity stands.
          </p>
        </div>
        <div className="page-actions">
          <Link to="/add-job" className="btn btn-primary btn-sm">
            Add Job
          </Link>
        </div>
      </div>

      <AlertBanner message={error} />

      <section className="surface p-5 sm:p-6 lg:p-7">
        <div className="page-header gap-4">
          <div>
            <h2 className="section-heading">Application Pipeline</h2>
            <p className="page-subtitle mt-2">
              Use search, filters, and quick edits to keep your job search
              current.
            </p>
          </div>
          <div className="rounded-full border border-slate-400/15 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
            {jobs.length
              ? `Showing ${filteredJobs.length} of ${jobs.length}`
              : "No data yet"}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="filter-bar">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_180px_180px]">
              <label className="filter-search">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search company or role"
                  className="input input-bordered w-full"
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="select select-bordered w-full"
              >
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>

              <select
                value={dateSort}
                onChange={(event) => setDateSort(event.target.value)}
                className="select select-bordered w-full"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-secondary">
              <span className="loading loading-spinner loading-sm" />
              Loading applications...
            </div>
          )}

          {!isLoading && !jobs.length && !error && (
            <div className="surface-2 empty-state">
              <div className="mx-auto mb-3 empty-icon">
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
              <p className="font-semibold text-primary">
                No applications yet
              </p>
              <p className="page-subtitle mx-auto mt-1">
                Add your first application to start building a trackable
                pipeline.
              </p>
              <Link to="/add-job" className="btn btn-primary mt-4">
                Add your first application
              </Link>
            </div>
          )}

          {!isLoading && jobs.length > 0 && filteredJobs.length === 0 && (
            <div className="surface-2 empty-state">
              <div className="mx-auto mb-3 empty-icon">
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
                    d="M3.75 4.5h16.5m-16.5 7.5h16.5m-16.5 7.5h10.5"
                  />
                </svg>
              </div>
              <p className="font-semibold text-primary">
                No applications match your filters
              </p>
              <p className="page-subtitle mx-auto mt-1">
                Adjust the status or search term to widen the results.
              </p>
            </div>
          )}

          {!isLoading && filteredJobs.length > 0 && (
            <>
              <div className="mobile-card-list md:hidden">
                {filteredJobs.map((job) => (
                  <article key={job.id} className="job-card">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="job-card-title">{job.position}</p>
                        <p className="mt-1 text-sm text-secondary">
                          {job.company}
                        </p>
                      </div>
                      <span className={`badge ${statusClass(job.status)}`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="job-card-meta">
                      <div className="job-card-row">
                        <span>Date applied</span>
                        <span>{job.date_applied}</span>
                      </div>
                      <div className="job-card-row">
                        <span>Resume</span>
                        <span>
                          {job.resume_url ? (
                            <a
                              href={job.resume_url}
                              className="resume-link"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ResumeIcon />
                              View file
                            </a>
                          ) : (
                            <span className="resume-empty">No resume</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="job-card-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => openEditModal(job)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(job.id)}
                        disabled={isDeleting === job.id}
                      >
                        {isDeleting === job.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden md:block">
                <div className="table-container overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left font-medium">Company</th>
                        <th className="text-left font-medium">Role</th>
                        <th className="text-left font-medium">Status</th>
                        <th className="text-left font-medium">Date Applied</th>
                        <th className="text-left font-medium">Resume</th>
                        <th className="text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <tr key={job.id}>
                          <td className="text-[13px] font-semibold">
                            {job.company}
                          </td>
                          <td className="text-secondary">{job.position}</td>
                          <td>
                            <span className={`badge ${statusClass(job.status)}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="text-muted">{job.date_applied}</td>
                          <td>
                            {job.resume_url ? (
                              <a
                                href={job.resume_url}
                                className="resume-link"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ResumeIcon />
                                View
                              </a>
                            ) : (
                              <span className="resume-empty">No resume</span>
                            )}
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="btn btn-ghost btn-icon"
                                onClick={() => openEditModal(job)}
                                aria-label="Edit application"
                                title="Edit"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                >
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-icon"
                                onClick={() => handleDelete(job.id)}
                                disabled={isDeleting === job.id}
                                aria-label="Delete application"
                                title="Delete"
                              >
                                {isDeleting === job.id ? (
                                  <span className="loading loading-spinner loading-xs" />
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M8 6V4h8v2" />
                                    <path d="M6 6l1 14h10l1-14" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {editingJobId && (
        <div className="modal-scrim flex items-center justify-center">
          <div className="modal-panel">
            <div className="app-divider flex items-center justify-between px-5 py-4 sm:px-6">
              <div>
                <h3 className="section-heading">Edit Application</h3>
                <p className="mt-2 text-sm text-secondary">
                  Update role details, attach a new resume, or refine your
                  notes.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={closeEditModal}
                disabled={isSaving}
              >
                Close
              </button>
            </div>

            <form className="space-y-5 p-5 sm:p-6" onSubmit={handleEditSubmit}>
              <AlertBanner message={error} />

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Company
                  <input
                    type="text"
                    name="company"
                    value={editForm.company}
                    onChange={handleEditChange}
                    className={`input input-bordered w-full ${
                      editErrors.company ? "input-error" : ""
                    }`}
                    required
                  />
                  {editErrors.company && (
                    <span className="text-xs text-danger">
                      {editErrors.company}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Position
                  <input
                    type="text"
                    name="position"
                    value={editForm.position}
                    onChange={handleEditChange}
                    className={`input input-bordered w-full ${
                      editErrors.position ? "input-error" : ""
                    }`}
                    required
                  />
                  {editErrors.position && (
                    <span className="text-xs text-danger">
                      {editErrors.position}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Status
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="select select-bordered w-full"
                  >
                    {statusOptions.slice(1).map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-secondary">
                  Date Applied
                  <input
                    type="date"
                    name="date_applied"
                    value={editForm.date_applied}
                    onChange={handleEditChange}
                    className={`input input-bordered w-full ${
                      editErrors.date_applied ? "input-error" : ""
                    }`}
                  />
                  {editErrors.date_applied && (
                    <span className="text-xs text-danger">
                      {editErrors.date_applied}
                    </span>
                  )}
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm text-secondary">
                Job URL
                <input
                  type="url"
                  name="job_url"
                  value={editForm.job_url}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-secondary">
                Notes
                <textarea
                  rows="4"
                  name="notes"
                  value={editForm.notes}
                  onChange={handleEditChange}
                  className="textarea textarea-bordered w-full"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-secondary">
                Resume
                {editResumeUrl && (
                  <a
                    href={editResumeUrl}
                    className="resume-link w-fit"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ResumeIcon />
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
                  <span className="text-xs text-secondary">
                    Selected: {editResumeFile.name}
                  </span>
                )}
              </label>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeEditModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${isSaving ? "btn-disabled" : ""}`}
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
