import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SocialButtons from "../components/SocialButtons";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(
    searchParams.get("error") === "oauth_failed"
      ? "Social sign-in was cancelled or failed. Please try again."
      : "",
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-teal-50 via-white to-paper px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-black-100 bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-teal-950">
            Log in
          </h1>
          <p className="mt-2 text-md text-black">Welcome back to TalentHub.</p>
        </div>
        {error && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-md text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-md font-semibold text-black-700">
              Email
            </label>
            <input
              type="email"
              required
              className="h-12 w-full rounded-xl border border-black-200 px-4 text-md outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-md font-semibold text-black-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-teal-700 hover:text-teal-900"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              className="h-12 w-full rounded-xl border border-black-200 px-4 text-md outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-xl bg-teal-900 py-3 text-md font-bold text-white shadow-lg transition hover:bg-teal-800 hover:shadow-xl disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <SocialButtons role="client" />

        <p className="mt-7 text-center text-md text-black">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-teal-700 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
