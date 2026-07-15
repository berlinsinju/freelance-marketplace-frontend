import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import SampleUploader from "../components/SampleUploader";
import AvailabilityPicker, { emptyAvailability } from "../components/AvailabilityPicker";

const empty = {
  title: "",
  description: "",
  category: "",
  price: "",
  priceType: "fixed",
  deliveryDays: 3,
  tags: "",
  samples: [],
  availability: emptyAvailability,
};

// <input type="date"> needs YYYY-MM-DD; the API returns a full ISO timestamp.
const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

const ServiceForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/services/${id}`)
      .then((res) => {
        const s = res.data.service;
        setForm({
          ...s,
          tags: (s.tags || []).join(", "),
          samples: s.samples || [],
          availability: {
            ...emptyAvailability,
            ...(s.availability || {}),
            hoursPerWeek: s.availability?.hoursPerWeek || "",
            availableFrom: toDateInput(s.availability?.availableFrom),
            workingDays: s.availability?.workingDays || [],
          },
        });
      })
      .catch(() => setError("Could not load this service."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { availability } = form;
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        samples: form.samples.map(({ url, caption, fileType, fileName, size }) => ({
          url,
          caption,
          fileType,
          fileName,
          size,
        })),
        availability: {
          ...availability,
          hoursPerWeek: Number(availability.hoursPerWeek) || 0,
          availableFrom: availability.availableFrom || undefined,
        },
      };
      if (isEdit) {
        await api.put(`/services/${id}`, payload);
      } else {
        await api.post("/services", payload);
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
            {isEdit ? "Edit Service" : "Create New Service"}
          </h1>

          <p className="mt-2 text-md text-gray-500">
            {isEdit
              ? "Update your service details and pricing."
              : "Create a professional service listing to attract clients."}
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
              Service Title
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
              Description
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

          {/* Category & Tags */}
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
                Tags
              </label>

              <input
                placeholder="React, Node.js, UI Design"
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
          </div>

          {/* Price */}
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price (₹)
              </label>

              <input
                type="number"
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price Type
              </label>

              <select
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.priceType}
                onChange={(e) =>
                  setForm({ ...form, priceType: e.target.value })
                }
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Delivery (Days)
              </label>

              <input
                type="number"
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.deliveryDays}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deliveryDays: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Work samples */}
          <div className="border-t border-gray-100 pt-6">
            <SampleUploader
              samples={form.samples}
              onChange={(samples) => setForm({ ...form, samples })}
            />
          </div>

          {/* Availability */}
          <div className="border-t border-gray-100 pt-6">
            <AvailabilityPicker
              value={form.availability}
              onChange={(availability) => setForm({ ...form, availability })}
            />
          </div>

          {/* Button */}
          <button
            disabled={saving}
            className="w-full rounded-xl bg-teal-900 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Service"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
