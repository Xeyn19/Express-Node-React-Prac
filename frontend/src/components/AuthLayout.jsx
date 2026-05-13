import React from "react";

const AuthLayout = ({
  eyebrow,
  title,
  description,
  highlights,
  metrics,
  formEyebrow,
  formTitle,
  formDescription,
  children,
}) => {
  return (
    <div className="auth-shell">
      <div
        className="auth-ambient auth-ambient-primary"
        aria-hidden="true"
      />
      <div
        className="auth-ambient auth-ambient-secondary"
        aria-hidden="true"
      />
      <div className="auth-backdrop" aria-hidden="true" />

      <div className="auth-content">
        <div className="auth-grid">
          <section className="auth-intro">
            <div className="auth-pill">{eyebrow}</div>

            <div className="space-y-4">
              <h1 className="auth-title">{title}</h1>
              <p className="auth-copy">{description}</p>
            </div>

            <div className="auth-highlight-grid">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="auth-highlight-card">
                  <p className="auth-highlight-title">{highlight.title}</p>
                  <p className="auth-highlight-copy">{highlight.copy}</p>
                </div>
              ))}
            </div>

            <div className="auth-metric-row">
              {metrics.map((metric) => (
                <div key={metric.label} className="auth-metric-card">
                  <span className="auth-metric-value">{metric.value}</span>
                  <span className="auth-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="auth-panel">
            <div className="auth-panel-header">
              <p className="auth-panel-eyebrow">{formEyebrow}</p>
              <h2 className="auth-panel-title">{formTitle}</h2>
              <p className="auth-panel-copy">{formDescription}</p>
            </div>

            {children}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
