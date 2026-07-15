import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import AvailabilityBadge from './AvailabilityBadge';
import { fileUrl } from '../api/axios';

const ServiceCard = ({ service }) => {
  const cover = (service.samples || []).find((s) => s.fileType === 'image');
  const sampleCount = (service.samples || []).length;

  return (
    <Link to={`/services/${service._id}`} className="card group flex flex-col overflow-hidden transition hover:shadow-md">
      {cover && (
        <div className="relative h-36 w-full overflow-hidden bg-teal-50">
          <img
            src={fileUrl(cover.url)}
            alt={cover.caption || service.title}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
          {sampleCount > 1 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs font-semibold text-white">
              {sampleCount} samples
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="badge w-fit bg-teal-50 text-teal-700">{service.category}</span>
          <AvailabilityBadge status={service.availability?.status} />
        </div>

        <h3 className="font-display text-base font-semibold text-ink group-hover:text-teal-700">
          {service.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink/60">{service.description}</p>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
            {service.freelancer?.name?.[0] || 'F'}
          </div>
          <span className="text-ink/70">{service.freelancer?.name}</span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-teal-50 pt-3">
          <StarRating rating={service.freelancer?.ratingAverage} count={service.freelancer?.ratingCount} />
          <span className="font-display text-lg font-bold text-teal-700">
            ${service.price}
            {service.priceType === 'hourly' && <span className="text-xs font-normal">/hr</span>}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
