import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

const initialLoginData = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState(initialLoginData);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!loginData.email.trim() || !loginData.password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email.trim(),
          password: loginData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login failed.");
        return;
      }

      setSuccessMessage(result.message || "Login successful.");
      localStorage.setItem("authUser", JSON.stringify(result.user));
      setLoginData(initialLoginData);
      navigate("/dashboard", { state: { user: result.user } });
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Login</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="form-control w-full">
              <span className="label-text mb-1">Email</span>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="you@example.com"
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full pr-12"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 my-auto text-base-content/70 hover:text-base-content"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            {error && <div className="alert alert-error py-2">{error}</div>}
            {successMessage && (
              <div className="alert alert-success py-2">{successMessage}</div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full ${isSubmitting ? "btn-disabled" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Login"}
            </button>
            <Link to="/register" className="btn btn-outline w-full">
              Don't have an account? Register.
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
