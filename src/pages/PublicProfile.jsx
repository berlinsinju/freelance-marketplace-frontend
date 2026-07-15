import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/StarRating";
import { useAuth } from "../context/AuthContext";

const PublicProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [responseDrafts, setResponseDrafts] = useState({});

  const load = useCallback(async () => {
    const [userRes, reviewRes] = await Promise.all([
      api.get(`/users/${id}`),
      api.get(`/reviews/user/${id}`),
    ]);
    setProfile(userRes.data.user);
    setReviews(reviewRes.data.reviews);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const submitResponse = async (reviewId) => {
    try {
      await api.put(`/reviews/${reviewId}/respond`, {
        text: responseDrafts[reviewId],
      });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit response");
    }
  };

  if (!profile)
    return <p className="py-20 text-center text-ink/50">Loading…</p>;

  const isOwnProfile = user && user._id === profile._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-paper py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-900 text-4xl font-bold text-gold-400">
              {profile.name[0]}
            </div>

            <div className="flex-1">
              <h1 className="font-display text-4xl font-bold text-teal-950">
                {profile.name}
              </h1>

              <p className="mt-2 text-gray-500">
                {profile.location || "Location not set"}
              </p>

              {profile.role === "freelancer" && (
                <div className="mt-3">
                  <StarRating
                    rating={profile.ratingAverage}
                    count={profile.ratingCount}
                  />
                </div>
              )}

              <p className="mt-5 leading-7 text-gray-600">
                {profile.bio || "No bio added yet."}
              </p>

              {profile.role === "freelancer" && (
                <>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(profile.skills || []).map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6">
                    <span className="text-sm text-gray-500">Hourly Rate</span>

                    <p className="mt-1 text-3xl font-bold text-teal-900">
                      ₹{profile.hourlyRate}
                      <span className="text-lg font-medium text-gray-500">
                        /hr
                      </span>
                    </p>
                  </div>
                </>
              )}

              {profile.role === "client" && profile.companyName && (
                <div className="mt-6">
                  <span className="text-sm text-gray-500">Company</span>

                  <p className="mt-1 font-semibold text-gray-700">
                    {profile.companyName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {profile.role === "freelancer" && profile.portfolio?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-3xl font-bold text-teal-950">
              Portfolio
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {profile.portfolio.map((p, i) => (
                <a
                  key={i}
                  href={p.link || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-xl font-semibold text-teal-900">
                    {p.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {p.description}
                  </p>

                  {p.link && (
                    <p className="mt-5 text-sm font-semibold text-teal-700">
                      View Project →
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="font-display text-3xl font-bold text-teal-950">
            Reviews ({reviews.length})
          </h2>

          <div className="mt-6 space-y-5">
            {reviews.length === 0 && (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                No reviews yet.
              </div>
            )}

            {reviews.map((r) => (
              <div
                key={r._id}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-teal-950">
                    {r.reviewer.name}
                  </p>

                  <StarRating rating={r.rating} />
                </div>

                <p className="mt-4 leading-7 text-gray-600">{r.comment}</p>

                {r.response?.text && (
                  <div className="mt-5 rounded-2xl bg-teal-50 p-5">
                    <p className="font-semibold text-teal-700">
                      Freelancer Response
                    </p>

                    <p className="mt-2 text-gray-600">{r.response.text}</p>
                  </div>
                )}

                {isOwnProfile && !r.response?.text && (
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <input
                      className="h-12 flex-1 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                      placeholder="Write a response..."
                      value={responseDrafts[r._id] || ""}
                      onChange={(e) =>
                        setResponseDrafts({
                          ...responseDrafts,
                          [r._id]: e.target.value,
                        })
                      }
                    />

                    <button
                      onClick={() => submitResponse(r._id)}
                      className="rounded-xl bg-teal-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                    >
                      Respond
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
