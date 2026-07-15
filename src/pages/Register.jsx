import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SocialButtons from "../components/SocialButtons";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-gradient-to-br from-teal-50 via-white to-paper px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-black-100 bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-teal-950">
            Create your account
          </h1>
          <p className="mt-2 text-md text-black">
            Join TalentHub as a freelancer or a client.
          </p>
        </div>
        {error && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-md text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-3 block text-md font-semibold text-black-700">
              I am a
            </label>

            <div className="grid grid-cols-2 gap-4">
              {["freelancer", "client"].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`rounded-xl border px-4 py-3 text-md font-semibold capitalize transition-all ${
                    form.role === r
                      ? "border-teal-700 bg-teal-50 text-teal-900 shadow-md"
                      : "border-black-200 text-black-600 hover:border-teal-300 hover:bg-teal-50/50"
                  }`}
                >
                  {r === "freelancer" ? "Freelancer" : "Client"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-md font-semibold text-black-700">
              Full name
            </label>
            <input
              required
              className="h-12 w-full rounded-xl border border-black-200 px-4 text-md outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
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
            <label className="mb-2 block text-md font-semibold text-black-700">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="h-12 w-full rounded-xl border border-black-200 px-4 text-md outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-xl bg-teal-900 py-3 text-md font-bold text-white shadow-lg transition hover:bg-teal-800 hover:shadow-xl disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <SocialButtons role={form.role} />

        <p className="mt-7 text-center text-md text-black">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-teal-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
