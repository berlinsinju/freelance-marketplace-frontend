import React from "react";
import { Link } from "react-router-dom";

const statusColors = {
  open: "bg-teal-50 text-teal-700",
  in_progress: "bg-gold-300/50 text-gold-600",
  completed: "bg-ink/10 text-ink/60",
  closed: "bg-ink/10 text-ink/60",
};

const JobCard = ({ job }) => (
  <Link
    to={`/jobs/${job._id}`}
    className="card group flex flex-col p-5 transition hover:shadow-md"
  >
    <div className="flex items-center justify-between">
      <span className="badge bg-teal-50 text-teal-700">{job.category}</span>
      <span className={`badge ${statusColors[job.status] || "bg-ink/10"}`}>
        {job.status?.replace("_", " ")}
      </span>
    </div>
    <h3 className="mt-3 font-display text-base font-semibold text-ink group-hover:text-teal-700">
      {job.title}
    </h3>
    <p className="mt-2 line-clamp-2 text-sm text-ink/60">{job.description}</p>
    <div className="mt-3 flex flex-wrap gap-1.5">
      {(job.skillsRequired || []).slice(0, 4).map((s) => (
        <span
          key={s}
          className="badge bg-paper border border-teal-100 text-black"
        >
          {s}
        </span>
      ))}
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-teal-50 pt-3 text-sm">
      <span className="text-black">
        {job.client?.name || job.client?.companyName}
      </span>
      <span className="font-display font-bold text-teal-700">
        ₹{job.budgetMin}–₹{job.budgetMax}
      </span>
    </div>
  </Link>
);

export default JobCard;
