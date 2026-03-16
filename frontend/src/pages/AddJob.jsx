import React from "react";

const AddJob = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Add Job</h1>
        <p className="text-sm text-slate-500">
          Capture the role details so you can follow up with confidence.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Job Title
            <input
              type="text"
              placeholder="Frontend Developer"
              className="input input-bordered w-full"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Company
            <input
              type="text"
              placeholder="Company name"
              className="input input-bordered w-full"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Location
            <input
              type="text"
              placeholder="Remote / City"
              className="input input-bordered w-full"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Status
            <select className="select select-bordered w-full">
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
            Notes
            <textarea
              rows="4"
              placeholder="Add contact details, hiring manager, or follow-up notes."
              className="textarea textarea-bordered w-full"
            />
          </label>

          <div className="md:col-span-2 flex justify-end">
            <button type="button" className="btn btn-primary btn-sm">
              Save Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
