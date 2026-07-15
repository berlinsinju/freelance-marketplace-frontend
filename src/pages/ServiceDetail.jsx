import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { fileUrl } from '../api/axios';
import StarRating from '../components/StarRating';
import AvailabilityBadge from '../components/AvailabilityBadge';
import { useAuth } from '../context/AuthContext';

const DAY_LABELS = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [creating, setCreating] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get(`/services/${id}`).then((res) => setService(res.data.service));
  }, [id]);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const handleHire = async () => {
    setCreating(true);
    try {
      const res = await api.post('/contracts', {
        service: service._id,
        freelancer: service.freelancer._id,
        title: service.title,
        totalAmount: service.price,
      });
      navigate(`/contracts/${res.data.contract._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not create contract');
    } finally {
      setCreating(false);
    }
  };

  if (!service) return <p className="py-20 text-center text-ink/50">Loading…</p>;

  const availability = service.availability || {};
  const samples = service.samples || [];
  const isBooked = availability.status === 'booked';
  const workingDays = DAY_ORDER.filter((d) => (availability.workingDays || []).includes(d));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge bg-teal-50 text-teal-700">{service.category}</span>
        <AvailabilityBadge status={availability.status} />
      </div>
      <h1 className="mt-3 font-display text-3xl font-bold">{service.title}</h1>

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-ink/70">{service.description}</p>
            {service.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {service.tags.map((t) => <span key={t} className="badge border border-teal-100 text-ink/60">{t}</span>)}
              </div>
            )}
          </div>

          {/* Work samples */}
          {samples.length > 0 && (
            <div className="card mt-6 p-6">
              <h2 className="font-display text-lg font-semibold">
                Work samples <span className="text-sm font-normal text-ink/50">({samples.length})</span>
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {samples.map((s, i) => {
                  const href = fileUrl(s.url);
                  const isImage = s.fileType === 'image';
                  const Wrapper = isImage ? 'button' : 'a';
                  const wrapperProps = isImage
                    ? { type: 'button', onClick: () => setLightbox(s) }
                    : { href, target: '_blank', rel: 'noopener noreferrer' };

                  return (
                    <figure key={s._id || `${s.url}-${i}`}>
                      <Wrapper
                        {...wrapperProps}
                        className="group block w-full overflow-hidden rounded-lg border border-teal-100 bg-teal-50/40 transition hover:border-teal-300"
                      >
                        {isImage ? (
                          <img
                            src={href}
                            alt={s.caption || `Work sample ${i + 1}`}
                            loading="lazy"
                            className="h-32 w-full object-cover transition group-hover:scale-105"
                          />
                        ) : (
                          <span className="flex h-32 w-full flex-col items-center justify-center gap-1 text-teal-700">
                            <span className="font-display text-xl font-bold">
                              {s.fileType === 'pdf' ? 'PDF' : '↗'}
                            </span>
                            <span className="px-2 text-center text-xs text-ink/50 line-clamp-2">
                              {s.fileType === 'pdf' ? 'Open document' : 'View external link'}
                            </span>
                          </span>
                        )}
                      </Wrapper>
                      {s.caption && (
                        <figcaption className="mt-1.5 line-clamp-2 text-xs text-ink/60">{s.caption}</figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card mt-6 p-6">
            <h2 className="font-display text-lg font-semibold">About the freelancer</h2>
            <Link to={`/profile/${service.freelancer._id}`} className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 font-display font-bold text-teal-700">
                {service.freelancer.name[0]}
              </div>
              <div>
                <p className="font-semibold text-teal-700 hover:underline">{service.freelancer.name}</p>
                <StarRating rating={service.freelancer.ratingAverage} count={service.freelancer.ratingCount} />
              </div>
            </Link>
            <p className="mt-3 text-sm text-ink/60">{service.freelancer.bio}</p>
          </div>
        </div>

        <aside className="card h-fit p-6">
          <p className="font-display text-3xl font-bold text-teal-700">
            ${service.price}{service.priceType === 'hourly' && <span className="text-sm font-normal">/hr</span>}
          </p>
          <p className="mt-1 text-sm text-ink/60">Delivery in {service.deliveryDays} days</p>

          {/* Availability */}
          <div className="mt-5 border-t border-teal-50 pt-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-teal-700">
              Availability
            </h3>
            <div className="mt-2">
              <AvailabilityBadge status={availability.status} />
            </div>

            <dl className="mt-3 space-y-1.5 text-sm">
              {availability.hoursPerWeek > 0 && (
                <div className="flex justify-between gap-2">
                  <dt className="text-ink/50">Capacity</dt>
                  <dd className="font-medium text-ink/80">{availability.hoursPerWeek} hrs/week</dd>
                </div>
              )}
              {availability.availableFrom && (
                <div className="flex justify-between gap-2">
                  <dt className="text-ink/50">Starts</dt>
                  <dd className="font-medium text-ink/80">{formatDate(availability.availableFrom)}</dd>
                </div>
              )}
              {availability.timezone && (
                <div className="flex justify-between gap-2">
                  <dt className="text-ink/50">Timezone</dt>
                  <dd className="font-medium text-ink/80">{availability.timezone}</dd>
                </div>
              )}
            </dl>

            {workingDays.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {workingDays.map((d) => (
                  <span key={d} className="rounded bg-teal-50 px-1.5 py-0.5 text-xs font-medium text-teal-700">
                    {DAY_LABELS[d]}
                  </span>
                ))}
              </div>
            )}

            {availability.note && (
              <p className="mt-3 text-xs italic text-ink/50">{availability.note}</p>
            )}
          </div>

          {user?.role === 'client' && (
            <>
              <button
                onClick={handleHire}
                disabled={creating || isBooked}
                className="btn-primary mt-5 w-full"
              >
                {creating ? 'Creating contract…' : isBooked ? 'Not accepting work' : 'Hire for this service'}
              </button>
              {isBooked && (
                <p className="mt-2 text-center text-xs text-ink/50">
                  This freelancer is fully booked right now.
                </p>
              )}
            </>
          )}
          {!user && (
            <Link to="/login" className="btn-primary mt-5 block w-full text-center">Log in to hire</Link>
          )}
          {user?.role === 'freelancer' && (
            <p className="mt-5 text-center text-xs text-ink/50">Only clients can hire freelancers.</p>
          )}
        </aside>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption || 'Work sample preview'}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close preview"
            className="absolute right-5 top-5 text-2xl text-white/80 transition hover:text-white"
          >
            ×
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-h-full max-w-3xl">
            <img
              src={fileUrl(lightbox.url)}
              alt={lightbox.caption || 'Work sample'}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {lightbox.caption && (
              <figcaption className="mt-3 text-center text-sm text-white/80">{lightbox.caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
