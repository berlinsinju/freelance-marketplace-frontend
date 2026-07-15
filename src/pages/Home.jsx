import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-paper text-ink">
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(214,149,46,0.18),_transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-xs font-semibold  tracking-[0.15em] text-gold-300">
              Your Project. Our Talent. Endless Possibilities.
            </p>

            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Find Skilled Freelancers And Transform
              <span className="block text-gold-400">
                Your Ideas Into Amazing Solutions.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-teal-100">
              Connect with talented professionals, collaborate seamlessly,
              manage projects efficiently, and bring your vision to life through
              a trusted freelance marketplace built for successful partnerships.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              {!user && (
                <>
                  <Link
                    to="/register"
                    className="rounded-xl bg-gold-400 px-7 py-3 text-sm font-bold text-teal-950 shadow-lg shadow-gold-400/20 transition hover:-translate-y-1 hover:bg-gold-300"
                  >
                    Create Your Profile
                  </Link>

                  <Link
                    to="/freelancers"
                    className="rounded-xl border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-paper backdrop-blur transition hover:bg-white/10"
                  >
                    Find freelancers
                  </Link>
                </>
              )}

              {user && (
                <Link
                  to="/dashboard"
                  className="rounded-xl bg-gold-400 px-7 py-3 text-sm font-bold text-teal-950 shadow-lg shadow-gold-400/20 transition hover:-translate-y-1 hover:bg-gold-300"
                >
                  Go to dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "Post or browse",
              text: "Clients post jobs with a clear budget and deadline. Freelancers list services with fixed or hourly pricing.",
            },
            {
              step: "Agree on terms",
              text: "Proposals turn into contracts with milestones, so both sides know exactly what happens and when.",
            },
            {
              step: "Pay with confidence",
              text: "Milestone payments are processed securely, and every completed contract earns a review.",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className="group relative overflow-hidden rounded-3xl border border-teal-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/10 blur-3xl transition group-hover:bg-gold-400/20" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-900 to-teal-700 text-xl font-bold text-gold-400 shadow-lg">
                0{i + 1}
              </div>

              <h3 className="mt-8 font-display text-2xl font-bold text-teal-950">
                {item.step}
              </h3>

              <p className="mt-4 text-md leading-7 text-black">{item.text}</p>

              <div className="mt-8 h-1 w-12 rounded-full bg-gold-400 transition-all duration-300 group-hover:w-24" />
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-teal-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-teal-900 px-8 py-16 text-center shadow-2xl sm:px-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />

            <div className="relative">
              <h2 className="font-display text-4xl font-bold text-paper sm:text-5xl">
                Ready to get to work?
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-teal-100">
                Join as a freelancer to offer your services, or as a client to
                post your next job and connect with skilled professionals.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  to="/jobs"
                  className="rounded-xl bg-gold-400 px-8 py-3.5 text-sm font-bold text-teal-950 shadow-lg shadow-gold-400/20 transition-all duration-300 hover:-translate-y-1 hover:bg-gold-300"
                >
                  Find work
                </Link>

                <Link
                  to="/freelancers"
                  className="rounded-xl border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-semibold text-paper backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  Find Freelancers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
