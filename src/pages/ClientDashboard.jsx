import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const tabs = ["Jobs", "Contracts", "Payments"];

const ClientDashboard = () => {
  const [tab, setTab] = useState("Jobs");
  const [jobs, setJobs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [jRes, cRes, pRes] = await Promise.all([
      api.get("/jobs/mine"),
      api.get("/contracts/mine"),
      api.get("/payments/history"),
    ]);
    setJobs(jRes.data.jobs);
    setContracts(cRes.data.contracts);
    setPayments(pRes.data.payments);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job listing?")) return;
    await api.delete(`/jobs/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-paper py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-teal-950">
              Client Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your jobs, contracts and payments from one place.
            </p>
          </div>

          <Link
            to="/jobs/new"
            className="rounded-xl bg-teal-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-teal-800"
          >
            + Post a Job
          </Link>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap gap-3 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                tab === t
                  ? "bg-teal-900 text-white shadow"
                  : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-16 text-center text-gray-500">Loading...</p>
        ) : (
          <div className="mt-8">
            {/* JOBS */}
            {tab === "Jobs" && (
              <div className="grid gap-6 md:grid-cols-2">
                {jobs.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                    You haven't posted any jobs yet.
                  </div>
                )}

                {jobs.map((j) => (
                  <div
                    key={j._id}
                    className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-display text-xl font-semibold text-teal-950">
                        {j.title}
                      </h3>

                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold capitalize text-teal-700">
                        {j.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">
                      {j.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <p className="font-semibold text-teal-700">
                        ₹{j.budgetMin}–₹{j.budgetMax}
                      </p>

                      <span className="text-sm text-gray-500">
                        {j.proposals.length} proposal(s)
                      </span>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Link
                        to={`/jobs/${j._id}`}
                        className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => deleteJob(j._id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CONTRACTS */}
            {tab === "Contracts" && (
              <div className="space-y-4">
                {contracts.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                    No contracts yet.
                  </div>
                )}

                {contracts.map((c) => (
                  <Link
                    key={c._id}
                    to={`/contracts/${c._id}`}
                    className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-teal-950">{c.title}</h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Freelancer: {c.freelancer?.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-teal-700">
                        ${c.totalAmount}
                      </p>

                      <span className="mt-2 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold capitalize text-teal-700">
                        {c.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* PAYMENTS */}
            {tab === "Payments" && (
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-teal-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      <th className="px-6 py-4">Contract</th>
                      <th className="px-6 py-4">To</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          No payments yet.
                        </td>
                      </tr>
                    )}

                    {payments.map((p) => (
                      <tr
                        key={p._id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">{p.contract?.title}</td>

                        <td className="px-6 py-4">{p.payee?.name}</td>

                        <td className="px-6 py-4 font-semibold text-teal-700">
                          ₹{p.amount}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold capitalize text-teal-700">
                            {p.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
