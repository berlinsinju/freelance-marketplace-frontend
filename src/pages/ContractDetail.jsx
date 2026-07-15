import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import PaymentModal from "../components/PaymentModal";

const milestoneStatusColor = {
  pending: "bg-ink/10 text-ink/60",
  in_progress: "bg-gold-300/50 text-gold-600",
  submitted: "bg-teal-100 text-teal-700",
  approved: "bg-teal-50 text-teal-700",
  paid: "bg-teal-600 text-paper",
};

const ContractDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [contract, setContract] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [payingMilestone, setPayingMilestone] = useState(null);

  const fetchContract = useCallback(async () => {
    const res = await api.get(`/contracts/${id}`);
    setContract(res.data.contract);
  }, [id]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setTimeout(fetchContract, 1500);
    }
  }, [searchParams, fetchContract]);

  if (!contract)
    return <p className="py-20 text-center text-ink/50">Loading…</p>;

  const isClient = user._id === contract.client._id;
  const isFreelancer = user._id === contract.freelancer._id;
  const stripeEnabled = process.env.REACT_APP_STRIPE_ENABLED === "true";

  const updateMilestone = async (milestoneId, status) => {
    try {
      await api.put(`/contracts/${id}/milestones/${milestoneId}`, { status });
      fetchContract();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const settlePayment = async (milestoneId) => {
    await api.post("/payments/mock-pay", { contractId: id, milestoneId });
    await fetchContract();
  };

  const payMilestoneWithStripe = async (milestoneId) => {
    try {
      const res = await api.post("/payments/checkout", {
        contractId: id,
        milestoneId,
      });
      window.location.href = res.data.url;
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Could not start checkout. Is Stripe configured on the server?",
      );
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews", { contract: id, ...reviewForm });
      setReviewSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit review");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-paper py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-teal-950">
                {contract.title}
              </h1>

              <p className="mt-2 text-gray-500">
                Client:
                <span className="font-medium text-gray-700">
                  {" "}
                  {contract.client.name || contract.client.companyName}
                </span>
                <span className="mx-2">•</span>
                Freelancer:
                <span className="font-medium text-gray-700">
                  {" "}
                  {contract.freelancer.name}
                </span>
              </p>
            </div>

            <span className="rounded-full bg-teal-100 px-5 py-2 text-sm font-semibold capitalize text-teal-700">
              {contract.status}
            </span>
          </div>

          {searchParams.get("payment") === "success" && (
            <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4 text-sm font-medium text-teal-700">
              Payment successful! Updating contract status...
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="font-display text-3xl font-bold text-teal-950">
            Project Milestones
          </h2>

          <div className="mt-6 space-y-5">
            {contract.milestones.map((m) => (
              <div
                key={m._id}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {m.title}
                    </h3>

                    {m.description && (
                      <p className="mt-2 leading-7 text-gray-500">
                        {m.description}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${milestoneStatusColor[m.status]}`}
                  >
                    {m.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <p className="text-3xl font-bold text-teal-900">
                    ₹{m.amount}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {isFreelancer && m.status === "pending" && (
                      <button
                        onClick={() => updateMilestone(m._id, "in_progress")}
                        className="rounded-xl border border-teal-900 px-5 py-2 text-sm font-semibold text-teal-900 transition hover:bg-teal-900 hover:text-white"
                      >
                        Start Work
                      </button>
                    )}

                    {isFreelancer && m.status === "in_progress" && (
                      <button
                        onClick={() => updateMilestone(m._id, "submitted")}
                        className="rounded-xl border border-teal-900 px-5 py-2 text-sm font-semibold text-teal-900 transition hover:bg-teal-900 hover:text-white"
                      >
                        Submit for Review
                      </button>
                    )}

                    {isClient && m.status === "submitted" && (
                      <button
                        onClick={() => updateMilestone(m._id, "approved")}
                        className="rounded-xl bg-teal-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
                      >
                        Approve
                      </button>
                    )}

                    {isClient && m.status === "approved" && (
                      <>
                        <button
                          onClick={() => setPayingMilestone(m)}
                          className="rounded-xl bg-amber-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
                        >
                          Pay ₹{m.amount}
                        </button>

                        {stripeEnabled && (
                          <button
                            onClick={() => payMilestoneWithStripe(m._id)}
                            className="rounded-xl border border-teal-900 px-5 py-2 text-sm font-semibold text-teal-900 transition hover:bg-teal-900 hover:text-white"
                          >
                            Pay with Stripe
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isClient && contract.status === "completed" && !reviewSubmitted && (
          <div className="mt-10 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="font-display text-3xl font-bold text-teal-950">
              Leave a Review
            </h2>

            <form onSubmit={submitReview} className="mt-6 space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Rating
                </label>

                <StarRating
                  interactive
                  rating={reviewForm.rating}
                  size="text-3xl"
                  onChange={(r) =>
                    setReviewForm({
                      ...reviewForm,
                      rating: r,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Comment
                </label>

                <textarea
                  required
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      comment: e.target.value,
                    })
                  }
                />
              </div>

              <button className="rounded-xl bg-teal-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-800">
                Submit Review
              </button>
            </form>
          </div>
        )}

        {reviewSubmitted && (
          <div className="mt-8 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4 text-center text-md font-medium text-teal-700">
            Thanks for your review!
          </div>
        )}

        <PaymentModal
          open={!!payingMilestone}
          onClose={() => setPayingMilestone(null)}
          amount={payingMilestone?.amount}
          title={
            payingMilestone
              ? `${contract.title} — ${payingMilestone.title}`
              : ""
          }
          onConfirm={() => settlePayment(payingMilestone._id)}
        />
      </div>
    </div>
  );
};

export default ContractDetail;
