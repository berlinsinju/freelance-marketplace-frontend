import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const tabs = ["Services", "Contracts", "Payments"];

const FreelancerDashboard = () => {
  const [tab, setTab] = useState("Services");
  const [services, setServices] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [sRes, cRes, pRes] = await Promise.all([
      api.get("/services/mine"),
      api.get("/contracts/mine"),
      api.get("/payments/history"),
    ]);
    setServices(sRes.data.services);
    setContracts(cRes.data.contracts);
    setPayments(pRes.data.payments);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service listing?")) return;
    await api.delete(`/services/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-paper py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-teal-950">
              Freelancer Dashboard
            </h1>
            <p className="mt-2 text-md text-gray-500">
              Manage your services, contracts and payments.
            </p>
          </div>

          <Link
            to="/services/new"
            className="rounded-xl bg-teal-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-teal-800"
          >
            + New Service List
          </Link>
        </div>

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
            {tab === "Services" && (
              <div className="grid gap-6 md:grid-cols-2">
                {services.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                    You haven't listed any services yet.
                  </div>
                )}

                {services.map((s) => (
                  <div
                    key={s._id}
                    className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="font-display text-xl font-semibold text-teal-950">
                      {s.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                      {s.description}
                    </p>

                    <p className="mt-5 text-2xl font-bold text-teal-700">
                      ₹{s.price}
                    </p>

                    <div className="mt-6 flex gap-3">
                      <Link
                        to={`/services/${s._id}/edit`}
                        className="rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteService(s._id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                        Client: {c.client?.name || c.client?.companyName}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-teal-700">
                        ₹{c.totalAmount}
                      </p>

                      <span className="mt-2 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold capitalize text-teal-700">
                        {c.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {tab === "Payments" && (
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-teal-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      <th className="px-6 py-4">Contract</th>
                      <th className="px-6 py-4">From</th>
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

                        <td className="px-6 py-4">{p.payer?.name}</td>

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

export default FreelancerDashboard;
