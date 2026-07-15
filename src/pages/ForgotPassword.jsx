import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devToken, setDevToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      if (res.data.resetToken) setDevToken(res.data.resetToken);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-teal-50 via-white to-paper px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-teal-950">
            Reset your password
          </h1>

          <p className="mt-2 text-md text-black">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-md font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              required
              className="h-12 w-full rounded-xl border border-gray-200 px-4 text-md outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-teal-900 py-3 text-md font-bold text-white shadow-lg transition hover:bg-teal-800 hover:shadow-xl disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-5 rounded-xl bg-teal-50 px-4 py-3 text-md text-teal-900">
            {message}
          </p>
        )}

        {/* Dev Token */}
        {devToken && (
          <div className="mt-5 rounded-2xl border border-gold-300 bg-gold-50 p-4 text-xs leading-6 text-ink">
            <p>
              No email service is configured in this demo, so here's your reset
              link directly:
            </p>

            <Link
              to={`/reset-password/${devToken}`}
              className="mt-2 block break-all font-semibold text-teal-700 hover:underline"
            >
              /reset-password/{devToken}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
