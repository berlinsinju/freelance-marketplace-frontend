import React from "react";

const STYLES = {
  available: { label: "Available now", dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700" },
  limited: { label: "Limited availability", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700" },
  booked: { label: "Fully booked", dot: "bg-gray-400", chip: "bg-gray-100 text-gray-600" },
};

const AvailabilityBadge = ({ status, className = "" }) => {
  const style = STYLES[status];
  if (!style) return null;

  return (
    <span className={`badge gap-1.5 ${style.chip} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
};

export default AvailabilityBadge;
