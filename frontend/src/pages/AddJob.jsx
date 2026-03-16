import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../lib/api";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.company.trim() || !formData.position.trim()) {
      setError("Company name and job title are required.");
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

      const response = await authenticatedFetch("/api/jobs", {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.message || "Unable to save job application.");
        return;
      }

      navigate("/applications", {
        replace: true,
        state: { message: "Job application added." },
      });
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Add Job Application
        </h1>
        <p className="text-sm text-slate-500">
          Capture the role details so you can follow up with confidence.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Company Name
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company name"
              className="input input-bordered w-full"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Job Title / Position
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Frontend Developer"
              className="input input-bordered w-full"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-600">
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

          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Date Applied
            <input
              type="date"
              name="date_applied"
              value={formData.date_applied}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
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

          <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
            Notes
            <textarea
              rows="4"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add contact details, hiring manager, or follow-up notes."
              className="textarea textarea-bordered w-full"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
            Resume Upload
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="file-input file-input-bordered w-full"
              onChange={(event) =>
                setResumeFile(event.target.files?.[0] || null)
              }
            />
            {resumeFile && (
              <span className="text-xs text-slate-400">
                Selected: {resumeFile.name}
              </span>
            )}
          </label>

          {error && (
            <div className="md:col-span-2 alert alert-error py-2">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className={`btn btn-primary btn-sm ${
                isSubmitting ? "btn-disabled" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
