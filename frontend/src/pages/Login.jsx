import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { toastError, toastInfo, toastSuccess } from "../lib/toast";
import { getAccessToken } from "../lib/auth";
import { useAuth } from "../context/AuthContext";

const loginHighlights = [
  "Track every role, contact, and follow-up from one workspace.",
  "See your job pipeline clearly with dashboard stats and recent activity.",
  "Keep resumes, interview stages, and priorities organized without spreadsheets.",
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

const initialLoginData = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastToastKeyRef = useRef(null);
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    ...initialLoginData,
    email: location.state?.email || "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (lastToastKeyRef.current === location.key) {
      return;
    }

    const logoutToast = sessionStorage.getItem("logoutToast");
    if (logoutToast) {
      sessionStorage.removeItem("logoutToast");
      toastSuccess("Logged out successfully.");
      lastToastKeyRef.current = location.key;
      return;
    }

    if (location.state?.message) {
      toastInfo(location.state.message);
      lastToastKeyRef.current = location.key;
    }
  }, [location.key, location.state?.message]);

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

    if (!loginData.email.trim() || !loginData.password.trim()) {
      const message = "Please enter both email and password.";
      setError(message);
      toastError(message);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch("/api/login", {
        method: "POST",
        data: {
          email: loginData.email.trim(),
          password: loginData.password,
        },
      });
      const result = response.data || {};

      const message = result.message || "Login successful.";
      setError("");
      toastSuccess(message);
      login({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
      setLoginData(initialLoginData);
      navigate(location.state?.from || "/dashboard", {
        replace: true,
        state: { user: result.user },
      });
    } catch (loginError) {
      const message =
        loginError?.response?.data?.message || "Unable to connect to server.";
      setError(message);
      toastError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/login-bg.jpg")' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(130deg,rgba(6,10,18,0.88)_0%,rgba(6,10,18,0.68)_42%,rgba(6,10,18,0.92)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,29,72,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.22),transparent_28%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,460px)] lg:items-center">
          <section className="order-2 space-y-6 text-center lg:order-1 lg:max-w-2xl lg:text-left">
            <div className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80 shadow-lg shadow-black/10 backdrop-blur-md lg:justify-start">
              Job Application Tracker
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Keep every application moving with a clearer hiring pipeline.
              </h1>
              <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-200 sm:text-base lg:mx-0 lg:max-w-xl">
                Manage roles, monitor interview progress, and keep your next
                opportunity visible the moment you open the site.
              </p>
            </div>

            <div className="grid gap-3 text-left sm:grid-cols-3">
              {loginHighlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-white/12 bg-white/8 p-4 text-sm leading-6 text-slate-100 shadow-lg shadow-black/10 backdrop-blur-sm"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </section>

          <section className="order-1 lg:order-2">
            <div className="mx-auto w-full max-w-md rounded-[28px] border border-white/15 bg-slate-950/72 p-5 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-7">
              <div className="mb-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/80">
                  Welcome back
                </p>
                <h2 className="text-3xl font-semibold text-white">Sign in</h2>
                <p className="text-sm leading-6 text-slate-300">
                  Access your dashboard, applications, and profile in one place.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="form-control w-full">
                  <span className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full border-white/10 bg-white/7 text-white placeholder:text-slate-400"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="form-control w-full">
                  <span className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleChange}
                      className="input input-bordered w-full border-white/10 bg-white/7 pr-12 text-white placeholder:text-slate-400"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 my-auto text-slate-400 transition hover:text-white"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </label>

                {error && <div className="sr-only">{error}</div>}

                <button
                  type="submit"
                  className={`btn btn-primary mt-3 w-full border-0 bg-sky-500 text-slate-950 hover:bg-sky-400 ${isSubmitting ? "btn-disabled" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Login"}
                </button>
                <Link
                  to="/register"
                  className="btn btn-outline w-full border-white/15 text-white hover:border-white/25 hover:bg-white/10"
                >
                  Don't have an account? Register.
                </Link>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
