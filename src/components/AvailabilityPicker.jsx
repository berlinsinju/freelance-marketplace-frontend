import React from "react";

export const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export const STATUS_OPTIONS = [
  {
    value: "available",
    label: "Available now",
    hint: "Taking on new work right away",
  },
  {
    value: "limited",
    label: "Limited availability",
    hint: "Can take on some work",
  },
  {
    value: "booked",
    label: "Fully booked",
    hint: "Not accepting work at the moment",
  },
];

export const emptyAvailability = {
  status: "available",
  hoursPerWeek: "",
  availableFrom: "",
  workingDays: [],
  timezone: "",
  note: "",
};

const AvailabilityPicker = ({ value = emptyAvailability, onChange }) => {
  const set = (patch) => onChange({ ...value, ...patch });

  const toggleDay = (day) => {
    const days = value.workingDays || [];
    set({
      workingDays: days.includes(day) ? days.filter((d) => d !== day) : [...days, day],
    });
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">Availability</label>
      <p className="mb-3 text-xs text-gray-500">
        Let clients know when you can start and how much time you have for this service.
      </p>

      {/* Status */}
      <div className="grid gap-3 sm:grid-cols-3">
        {STATUS_OPTIONS.map((opt) => {
          const active = value.status === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => set({ status: opt.value })}
              aria-pressed={active}
              className={`rounded-xl border p-4 text-left transition ${
                active
                  ? "border-teal-700 bg-teal-50 ring-4 ring-teal-100"
                  : "border-gray-200 bg-white hover:border-teal-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    opt.value === "available"
                      ? "bg-emerald-500"
                      : opt.value === "limited"
                        ? "bg-amber-500"
                        : "bg-gray-400"
                  }`}
                />
                <span className="text-sm font-semibold text-gray-800">{opt.label}</span>
              </span>
              <span className="mt-1 block text-xs text-gray-500">{opt.hint}</span>
            </button>
          );
        })}
      </div>

      {/* Hours + start date */}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Hours per week</label>
          <input
            type="number"
            min="0"
            max="168"
            placeholder="e.g. 20"
            className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
            value={value.hoursPerWeek ?? ""}
            onChange={(e) => set({ hoursPerWeek: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Available from</label>
          <input
            type="date"
            className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
            value={value.availableFrom || ""}
            onChange={(e) => set({ availableFrom: e.target.value })}
          />
        </div>
      </div>

      {/* Working days */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">Working days</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => {
            const active = (value.workingDays || []).includes(d.key);
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => toggleDay(d.key)}
                aria-pressed={active}
                className={`h-10 w-14 rounded-lg border text-sm font-medium transition ${
                  active
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-teal-300"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timezone + note */}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Timezone</label>
          <input
            placeholder="e.g. IST (UTC+5:30)"
            maxLength={60}
            className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
            value={value.timezone || ""}
            onChange={(e) => set({ timezone: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Availability note
          </label>
          <input
            placeholder="e.g. Replies within 2 hours on weekdays"
            maxLength={200}
            className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
            value={value.note || ""}
            onChange={(e) => set({ note: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPicker;
