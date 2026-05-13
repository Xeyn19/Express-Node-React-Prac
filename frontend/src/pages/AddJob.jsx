import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertBanner from "../components/AlertBanner";
import { authenticatedFetch } from "../lib/api";
import { toastError, toastSuccess } from "../lib/toast";

const todayString = () => new Date().toISOString().slice(0, 10);

const AddJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "Applied",
    date_applied: todayString(),
    job_url: "",
    notes: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((previous) => ({ ...previous, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const validationErrors = {};

    if (!formData.company.trim()) {
      validationErrors.company = "Company name is required.";
    }
    if (!formData.position.trim()) {
      validationErrors.position = "Job title is required.";
    }
    if (!formData.date_applied) {
      validationErrors.date_applied = "Date applied is required.";
    }

    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("company", formData.company.trim());
      payload.append("position", formData.position.trim());
      payload.append("status", formData.status);
      payload.append("date_applied", formData.date_applied);
      if (formData.job_url.trim()) {
        payload.append("job_url", formData.job_url.trim());
      }
      if (formData.notes.trim()) {
        payload.append("notes", formData.notes.trim());
      }
      if (resumeFile) {
        payload.append("resume", resumeFile);
      }

      await authenticatedFetch("/api/jobs", {
        method: "POST",
        data: payload,
      });
      toastSuccess("Job added!");
      navigate("/applications", { replace: true });
    } catch (saveError) {
      const message =
        saveError?.response?.data?.message || "Unable to connect to server.";
      setError(message);
      toastError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Job Application</h1>
          <p className="page-subtitle">
            Capture the role details, source link, and resume attachment while
            the opportunity is still fresh.
          </p>
        </div>
        <div className="page-actions">
          <Link to="/applications" className="btn btn-outline btn-sm">
            Back to applications
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.75fr)]">
        <section className="surface p-5 sm:p-6 lg:p-7">
          <div>
            <h2 className="section-heading">Role Details</h2>
            <p className="page-subtitle mt-2">
              Fill in the role basics first, then add optional notes and a
              resume file.
            </p>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <AlertBanner message={error} />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-secondary">
                Company Name
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  className={`input input-bordered w-full ${
                    fieldErrors.company ? "input-error" : ""
                  }`}
                  required
                />
                {fieldErrors.company && (
                  <span className="text-xs text-danger">
                    {fieldErrors.company}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-2 text-sm text-secondary">
                Job Title / Position
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Frontend Developer"
                  className={`input input-bordered w-full ${
                    fieldErrors.position ? "input-error" : ""
                  }`}
                  required
                />
                {fieldErrors.position && (
                  <span className="text-xs text-danger">
                    {fieldErrors.position}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-2 text-sm text-secondary">
                Status
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-secondary">
                Date Applied
                <input
                  type="date"
                  name="date_applied"
                  value={formData.date_applied}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${
                    fieldErrors.date_applied ? "input-error" : ""
                  }`}
                />
                {fieldErrors.date_applied && (
                  <span className="text-xs text-danger">
                    {fieldErrors.date_applied}
                  </span>
                )}
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-secondary">
              Job URL
              <input
                type="url"
                name="job_url"
                value={formData.job_url}
                onChange={handleChange}
                placeholder="https://company.com/careers/role"
                className="input input-bordered w-full"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-secondary">
              Notes
              <textarea
                rows="5"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add recruiter details, compensation notes, follow-up reminders, or interview prep points."
                className="textarea textarea-bordered w-full"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-secondary">
              Resume Upload
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="file-input file-input-bordered w-full"
                onChange={(event) =>
                  setResumeFile(event.target.files?.[0] || null)
                }
              />
              {resumeFile ? (
                <span className="text-xs text-secondary">
                  Selected: {resumeFile.name}
                </span>
              ) : (
                <span className="field-hint">
                  Attach the version you actually sent so you can reference it
                  later.
                </span>
              )}
            </label>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link to="/applications" className="btn btn-ghost">
                Cancel
              </Link>
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? "btn-disabled" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Job"}
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="surface-2 p-5">
            <h2 className="section-heading">What to include</h2>
            <div className="mt-4 space-y-4 text-sm text-secondary">
              <p>
                Add the role title, company, and apply date first so the
                application appears correctly in your pipeline views.
              </p>
              <p>
                Save the original job link whenever possible. It helps later
                when preparing for follow-ups or interviews.
              </p>
              <p>
                Use notes for recruiter names, salary expectations, interview
                prep, or status reminders.
              </p>
            </div>
          </div>

          <div className="surface-2 p-5">
            <h2 className="section-heading">Resume tip</h2>
            <p className="mt-4 text-sm text-secondary">
              Upload the exact resume version you sent. That keeps your
              application history aligned with each role.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddJob;
