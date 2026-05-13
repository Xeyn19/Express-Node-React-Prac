import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertBanner from "../components/AlertBanner";
import AuthLayout from "../components/AuthLayout";
import { apiFetch } from "../lib/api";
import { toastError, toastSuccess } from "../lib/toast";

const highlights = [
  {
    title: "Start with structure",
    copy: "Create an account and organize companies, positions, notes, and resume files from day one.",
  },
  {
    title: "Stay follow-up ready",
    copy: "Keep the latest role details in one place so interview prep and outreach stay simple.",
  },
  {
    title: "Use it anywhere",
    copy: "The interface is tuned for phones, tablets, and desktop so updates are easy on any device.",
  },
];

const metrics = [
  { value: "Fast", label: "setup" },
  { value: "Secure", label: "JWT auth" },
  { value: "Cloud", label: "deployment ready" },
  { value: "Live", label: "job tracking" },
];

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="size-5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1 1 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178a1 1 0 010 .644C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="size-5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3l18 18M10.584 10.587A2.999 2.999 0 0012 15a3 3 0 002.413-1.587M9.88 5.09A9.72 9.72 0 0112 4.5c4.638 0 8.573 3.007 9.963 7.178a1 1 0 010 .644 10.51 10.51 0 01-4.293 5.17M6.228 6.228A10.45 10.45 0 002.037 11.68a1 1 0 000 .644C3.423 16.49 7.36 19.5 12 19.5a9.73 9.73 0 005.272-1.562"
    />
  </svg>
);

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const hasEmptyField = Object.values(formData).some(
      (value) => value.trim() === ""
    );

    if (hasEmptyField) {
      const message = "Please fill in all fields.";
      setError(message);
      toastError(message);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const message = "Password and confirm password do not match.";
      setError(message);
      toastError(message);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch("/api/register", {
        method: "POST",
        data: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        },
      });

      const result = response.data || {};
      toastSuccess(result.message || "Registration successful.");
      const email = formData.email.trim();
      setFormData(initialFormData);
      navigate("/login", {
        replace: true,
        state: {
          message: "Registration successful. Please login.",
          email,
        },
      });
    } catch (registerError) {
      const message =
        registerError?.response?.data?.message ||
        "Unable to connect to server.";
      setError(message);
      toastError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create your workspace"
      title="Build a cleaner system for every application."
      description="Create your account and move from scattered notes to a focused hiring pipeline with better visibility on every device."
      highlights={highlights}
      metrics={metrics}
      formEyebrow="Get started"
      formTitle="Create account"
      formDescription="Set up your profile and start tracking applications, resume versions, and follow-ups in one place."
    >
      <form className="auth-form-grid" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="form-control w-full">
            <span className="label-text mb-2">First name</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Edgar"
              autoComplete="given-name"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-2">Last name</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Orosa"
              autoComplete="family-name"
            />
          </label>
        </div>

        <label className="form-control w-full">
          <span className="label-text mb-2">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="form-control w-full">
            <span className="label-text mb-2">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full pr-12"
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 my-auto text-secondary transition hover:text-primary"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-2">Confirm password</span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input input-bordered w-full pr-12"
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 my-auto text-secondary transition hover:text-primary"
                onClick={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>
        </div>

        <p className="field-hint">
          Use a strong password so your job search notes and uploaded resumes
          stay protected.
        </p>

        <AlertBanner message={error} />

        <button
          type="submit"
          className={`btn btn-primary mt-2 w-full ${isSubmitting ? "btn-disabled" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in instead
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
