import React, { useState } from "react";

const PaymentModal = ({ open, onClose, amount, title, onConfirm }) => {
  const [card, setCard] = useState({ number: "", exp: "", cvc: "", name: "" });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const formatNumber = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExp = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const valid =
    card.number.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(card.exp) &&
    card.cvc.length >= 3 &&
    card.name.trim().length > 1;

  const handlePay = async () => {
    setError("");
    if (!valid) {
      setError("Please enter valid card details.");
      return;
    }
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      await onConfirm();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-teal-950">
              Checkout
            </h3>
            <p className="text-sm text-ink/60">{title}</p>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="text-2xl leading-none text-ink/40 hover:text-ink"
          >
            &times;
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-teal-50 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Amount due
          </p>
          <p className="font-display text-3xl font-bold text-teal-900">
            ₹{amount}
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 space-y-3">
          <input
            placeholder="Cardholder name"
            className="h-11 w-full rounded-xl border border-black-200 px-3 text-md outline-none focus:border-teal-700"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
          />
          <input
            placeholder="Card number"
            inputMode="numeric"
            className="h-11 w-full rounded-xl border border-black-200 px-3 text-md outline-none focus:border-teal-700"
            value={card.number}
            onChange={(e) =>
              setCard({ ...card, number: formatNumber(e.target.value) })
            }
          />
          <div className="flex gap-3">
            <input
              placeholder="MM/YY"
              inputMode="numeric"
              className="h-11 w-1/2 rounded-xl border border-black-200 px-3 text-md outline-none focus:border-teal-700"
              value={card.exp}
              onChange={(e) =>
                setCard({ ...card, exp: formatExp(e.target.value) })
              }
            />
            <input
              placeholder="CVC"
              inputMode="numeric"
              className="h-11 w-1/2 rounded-xl border border-black-200 px-3 text-md outline-none focus:border-teal-700"
              value={card.cvc}
              onChange={(e) =>
                setCard({
                  ...card,
                  cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                })
              }
            />
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={processing}
          className="mt-5 w-full rounded-xl bg-teal-900 py-3 text-md font-bold text-white transition hover:bg-teal-800 disabled:opacity-60"
        >
          {processing ? "Processing payment…" : `Pay ₹${amount}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
