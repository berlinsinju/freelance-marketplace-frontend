import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    skill: "",
    minBudget: "",
    maxBudget: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get("/jobs", { params });
      setJobs(res.data.jobs);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(fetchJobs, 300);
    return () => clearTimeout(timeout);
  }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-paper px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-teal-950">
            Find work
          </h1>
          <p className="mt-3 text-md text-black">
            Browse open job listings from clients and discover your next
            opportunity.
          </p>
        </div>

        <div className="rounded-3xl border border-black-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            <input
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm text-black placeholder-black outline-none transition focus:border-teal-700  focus:ring-teal-100 md:col-span-2"
              placeholder="Search jobs…"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />

            <input
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm text-black placeholder-black outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              placeholder="Category"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            />

            <input
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm text-black placeholder-black outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              placeholder="Skill required"
              value={filters.skill}
              onChange={(e) =>
                setFilters({ ...filters, skill: e.target.value })
              }
            />

            <input
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm text-black placeholder-black outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              type="number"
              placeholder="Min budget (₹)"
              value={filters.minBudget}
              onChange={(e) =>
                setFilters({ ...filters, minBudget: e.target.value })
              }
            />
          </div>
        </div>

        {loading ? (
          <p className="mt-12 text-center text-sm text-black">Loading jobs…</p>
        ) : jobs.length === 0 ? (
          <p className="mt-12 text-center text-sm text-black">
            No open jobs match your filters yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job._id}>
                <div className="rounded-3xl">
                  <JobCard job={job} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
