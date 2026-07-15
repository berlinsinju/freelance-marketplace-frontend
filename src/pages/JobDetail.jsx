import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [proposal, setProposal] = useState({
    coverLetter: "",
    proposedAmount: "",
    estimatedDays: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchJob = useCallback(async () => {
    const res = await api.get(`/jobs/${id}`);
    setJob(res.data.job);
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/jobs/${id}/proposals`, proposal);
      setProposal({ coverLetter: "", proposedAmount: "", estimatedDays: "" });
      fetchJob();
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit proposal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProposalDecision = async (proposalId, status) => {
    try {
      await api.put(`/jobs/${id}/proposals/${proposalId}`, { status });
      fetchJob();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const handleCreateContract = async (proposal) => {
    try {
      const res = await api.post("/contracts", {
        job: job._id,
        freelancer: proposal.freelancer._id,
        title: job.title,
        totalAmount: proposal.proposedAmount,
      });
      navigate(`/contracts/${res.data.contract._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Could not create contract");
    }
  };

  if (!job) return <p className="py-20 text-center text-ink/50">Loading…</p>;

  const isOwner = user && job.client._id === user._id;
  const myProposal =
    user && job.proposals.find((p) => p.freelancer._id === user._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-paper py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-700">
            {job.category}
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold text-teal-950">
            {job.title}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Posted by{" "}
            <span className="font-semibold text-gray-700">
              {job.client.name || job.client.companyName}
            </span>
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="font-display text-xl font-semibold text-teal-950">
                Job Description
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                {job.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {(job.skillsRequired || []).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Proposal Form */}
            {user?.role === "freelancer" &&
              job.status === "open" &&
              !myProposal && (
                <form
                  onSubmit={handleSubmitProposal}
                  className="space-y-5 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
                >
                  <h2 className="font-display text-xl font-semibold text-teal-950">
                    Submit a Proposal
                  </h2>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Cover Letter
                    </label>

                    <textarea
                      required
                      rows={5}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                      value={proposal.coverLetter}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          coverLetter: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Proposed Amount (₹)
                      </label>

                      <input
                        type="number"
                        required
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                        value={proposal.proposedAmount}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            proposedAmount: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Estimated Days
                      </label>

                      <input
                        type="number"
                        required
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                        value={proposal.estimatedDays}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            estimatedDays: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <button
                    disabled={submitting}
                    className="w-full rounded-xl bg-teal-900 py-3 font-semibold text-white transition hover:bg-teal-800"
                  >
                    {submitting ? "Submitting…" : "Submit Proposal"}
                  </button>
                </form>
              )}

            {/* My Proposal */}
            {myProposal && (
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <p className="font-semibold">
                  Your Proposal{" "}
                  <span className="ml-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium capitalize text-teal-700">
                    {myProposal.status}
                  </span>
                </p>

                <p className="mt-4 text-gray-600">{myProposal.coverLetter}</p>
              </div>
            )}

            {/* Owner Proposal List */}
            {isOwner && (
              <div>
                <h2 className="mb-5 font-display text-2xl font-semibold text-teal-950">
                  Proposals ({job.proposals.length})
                </h2>

                <div className="space-y-5">
                  {job.proposals.length === 0 && (
                    <p className="text-gray-500">No proposals yet.</p>
                  )}

                  {job.proposals.map((p) => (
                    <div
                      key={p._id}
                      className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-900 text-lg font-bold text-gold-400">
                            {p.freelancer.name[0]}
                          </div>

                          <div>
                            <p className="font-semibold">{p.freelancer.name}</p>

                            <StarRating
                              rating={p.freelancer.ratingAverage}
                              count={p.freelancer.ratingCount}
                            />
                          </div>
                        </div>

                        <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold capitalize text-teal-700">
                          {p.status}
                        </span>
                      </div>

                      <p className="mt-5 leading-7 text-gray-600">
                        {p.coverLetter}
                      </p>

                      <p className="mt-4 font-semibold text-teal-700">
                        ₹{p.proposedAmount} · {p.estimatedDays} days
                      </p>

                      {p.status === "pending" && (
                        <div className="mt-5 flex gap-3">
                          <button
                            onClick={() =>
                              handleProposalDecision(p._id, "accepted")
                            }
                            className="rounded-xl bg-teal-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              handleProposalDecision(p._id, "rejected")
                            }
                            className="rounded-xl border border-gray-300 px-5 py-2 text-sm font-semibold transition hover:bg-gray-50"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {p.status === "accepted" && (
                        <button
                          onClick={() => handleCreateContract(p)}
                          className="mt-5 rounded-xl bg-gold-400 px-5 py-2 text-sm font-semibold text-teal-950 transition hover:bg-gold-300"
                        >
                          Create Contract
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sticky top-24 h-fit rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="border-b border-gray-100 pb-6">
              <p className="text-sm font-medium text-gray-500">Budget</p>

              <p className="mt-2 font-display text-4xl font-bold text-teal-900">
                ₹{job.budgetMin}–₹{job.budgetMax}
              </p>
            </div>

            <div className="space-y-5 pt-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>

                <p className="mt-1 capitalize text-gray-700">
                  {job.budgetType}
                </p>
              </div>

              {job.deadline && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Deadline</p>

                  <p className="mt-1 text-gray-700">
                    {new Date(job.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>

                <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                  {job.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
