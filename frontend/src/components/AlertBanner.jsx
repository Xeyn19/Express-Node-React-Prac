import React from "react";

const toneClassNames = {
  error: "is-error",
  info: "is-info",
  success: "is-success",
};

const icons = {
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.29 3.86l-7.16 12.4A2 2 0 004.87 19h14.26a2 2 0 001.74-2.74l-7.16-12.4a2 2 0 00-3.42 0z"
      />
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16v-4m0-4h.01M22 12A10 10 0 1112 2a10 10 0 0110 10z"
      />
    </svg>
  ),
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m7 2A9 9 0 1112 3a9 9 0 019 9z"
      />
    </svg>
  ),
};

const AlertBanner = ({ message, tone = "error", className = "" }) => {
  if (!message) {
    return null;
  }

  const toneClass = toneClassNames[tone] || toneClassNames.error;

  return (
    <div
      className={["alert-banner", toneClass, className].filter(Boolean).join(" ")}
      role="alert"
    >
      {icons[tone] || icons.error}
      <span>{message}</span>
    </div>
  );
};

export default AlertBanner;
