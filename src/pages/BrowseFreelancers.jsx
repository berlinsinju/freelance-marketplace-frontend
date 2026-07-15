import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/StarRating";

const BrowseFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    skill: "",
    location: "",
    minRating: "",
    maxRate: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get("/users/freelancers", { params });
      setFreelancers(res.data.freelancers);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(fetchFreelancers, 300);
    return () => clearTimeout(timeout);
  }, [fetchFreelancers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-paper px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-teal-950">
            Find freelancers
          </h1>
          <p className="mt-3 text-md text-black">
            Search by skill, location, rating, or budget and connect with
            skilled professionals.
          </p>
        </div>

        <div className="rounded-3xl border border-black-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            <input
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm text-black placeholder-black outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100 md:col-span-2"
              placeholder="Search name, bio, skills…"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />

            <input
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm text-black placeholder-black outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              placeholder="Skill (e.g. React)"
              value={filters.skill}
              onChange={(e) =>
                setFilters({ ...filters, skill: e.target.value })
              }
            />

            <input
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm text-black placeholder-black outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />

            <input
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm text-black placeholder-black outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              type="number"
              placeholder="Max hourly rate (₹)"
              value={filters.maxRate}
              onChange={(e) =>
                setFilters({ ...filters, maxRate: e.target.value })
              }
            />
          </div>
        </div>

        {loading ? (
          <p className="mt-12 text-center text-sm text-black">
            Loading freelancers…
          </p>
        ) : freelancers.length === 0 ? (
          <p className="mt-12 text-center text-sm text-black">
            No freelancers match your filters yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {freelancers.map((f) => (
              <Link
                to={`/profile/${f._id}`}
                key={f._id}
                className="group rounded-3xl border border-black-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-900 text-xl font-bold text-gold-400">
                    {f.name[0]}
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-teal-950">
                      {f.name}
                    </h3>

                    <p className="text-xs text-black">
                      {f.location || "Location not set"}
                    </p>
                  </div>
                </div>

                <p className="mt-5 line-clamp-2 text-sm leading-6 text-black">
                  {f.bio || "No bio yet."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(f.skills || []).slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-black-100 pt-4">
                  <StarRating rating={f.ratingAverage} count={f.ratingCount} />

                  <span className="font-display text-lg font-bold text-teal-700">
                    ₹{f.hourlyRate}/hr
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseFreelancers;
