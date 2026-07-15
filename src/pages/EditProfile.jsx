import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const EditProfile = () => {
  const { user, updateUserLocal } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    phone: user.phone || "",
    skills: (user.skills || []).join(", "),
    hourlyRate: user.hourlyRate || 0,
    availability: user.availability || "available",
    companyName: user.companyName || "",
    companyWebsite: user.companyWebsite || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pwMessage, setPwMessage] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await api.put("/users/me", payload);
      updateUserLocal(res.data.user);
      setMessage("Profile updated");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMessage("");
    try {
      await api.put("/auth/change-password", passwordForm);
      setPwMessage("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPwMessage(err.response?.data?.message || "Change failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-paper py-12">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-teal-950">
            Edit Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Keep your profile updated to attract more opportunities.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4 text-sm font-medium text-teal-700">
            {message}
          </div>
        )}

        {/* Profile Form */}
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Bio
            </label>

            <textarea
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          {/* Location & Phone */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>

              <input
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <input
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Freelancer Fields */}
          {user.role === "freelancer" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Skills
                </label>

                <input
                  placeholder="React, Node.js, UI/UX..."
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Hourly Rate (₹)
                  </label>

                  <input
                    type="number"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                    value={form.hourlyRate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hourlyRate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Availability
                  </label>

                  <select
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                    value={form.availability}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        availability: e.target.value,
                      })
                    }
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Client Fields */}
          {user.role === "client" && (
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Company Name
                </label>

                <input
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      companyName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Company Website
                </label>

                <input
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                  value={form.companyWebsite}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      companyWebsite: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <button
            disabled={saving}
            className="w-full rounded-xl bg-teal-900 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Password Section */}
        <div className="mt-10">
          <h2 className="font-display text-3xl font-bold text-teal-950">
            Change Password
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Use a strong password to keep your account secure.
          </p>

          {pwMessage && (
            <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4 text-sm text-teal-700">
              {pwMessage}
            </div>
          )}

          <form
            onSubmit={handlePasswordChange}
            className="mt-6 space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Current Password
              </label>

              <input
                type="password"
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>

              <input
                type="password"
                required
                minLength={6}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <button className="w-full rounded-xl border border-teal-900 py-3 text-sm font-semibold text-teal-900 transition hover:bg-teal-900 hover:text-white">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
