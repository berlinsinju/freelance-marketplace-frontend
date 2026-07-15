import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const empty = {
  title: "",
  description: "",
  category: "",
  budgetMin: "",
  budgetMax: "",
  budgetType: "fixed",
  deadline: "",
  skillsRequired: "",
};

const JobForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/jobs/${id}`).then((res) => {
      const j = res.data.job;
      setForm({
        ...j,
        skillsRequired: (j.skillsRequired || []).join(", "),
        deadline: j.deadline ? j.deadline.slice(0, 10) : "",
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (isEdit) {
        await api.put(`/jobs/${id}`, payload);
      } else {
        await api.post("/jobs", payload);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="py-20 text-center text-ink/50">Loading…</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-paper py-12">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-teal-950">
            {isEdit ? "Edit Job Listing" : "Post a New Job"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {isEdit
              ? "Update your job details to attract the right freelancers."
              : "Describe your project and receive proposals from skilled freelancers."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
        >
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Job Title
            </label>

            <input
              required
              className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Job Description
            </label>

            <textarea
              required
              rows={6}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Category & Skills */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <input
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Skills Required
              </label>

              <input
                placeholder="React, Node.js, MongoDB"
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.skillsRequired}
                onChange={(e) =>
                  setForm({
                    ...form,
                    skillsRequired: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Budget */}
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Minimum Budget (₹)
              </label>

              <input
                type="number"
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.budgetMin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    budgetMin: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Maximum Budget (₹)
              </label>

              <input
                type="number"
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.budgetMax}
                onChange={(e) =>
                  setForm({
                    ...form,
                    budgetMax: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Budget Type
              </label>

              <select
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.budgetType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    budgetType: e.target.value,
                  })
                }
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Project Deadline
            </label>

            <input
              type="date"
              className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              value={form.deadline}
              onChange={(e) =>
                setForm({
                  ...form,
                  deadline: e.target.value,
                })
              }
            />
          </div>

          {/* Submit */}
          <button
            disabled={saving}
            className="w-full rounded-xl bg-teal-900 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Update Job Listing" : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
