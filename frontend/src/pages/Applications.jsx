import React from "react";
import { Link } from "react-router-dom";

const Applications = () => {
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
          <span className="text-xs text-slate-400">No data yet</span>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          Your application list will show up here once you add new jobs.
        </div>
      </div>
    </div>
  );
};

export default Applications;
