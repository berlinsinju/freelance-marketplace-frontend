import React from 'react';

const StarRating = ({ rating = 0, count, size = 'text-sm', interactive = false, onChange }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className={`inline-flex items-center gap-1 ${size}`}>
      {stars.map((s) => (
        <span
          key={s}
          onClick={() => interactive && onChange && onChange(s)}
          className={`${interactive ? 'cursor-pointer' : ''} ${
            s <= Math.round(rating) ? 'text-gold-500' : 'text-teal-100'
          }`}
        >
          ★
        </span>
      ))}
      {typeof count === 'number' && (
        <span className="ml-1 text-xs text-ink/50">
          {rating ? rating.toFixed(1) : '0.0'} ({count})
        </span>
      )}
    </span>
  );
};

export default StarRating;
