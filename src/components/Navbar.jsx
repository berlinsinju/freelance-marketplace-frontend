import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import logoImg from "../logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b shadow-md border-black-100 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          to="/"
          className="font-display text-2xl font-bold tracking-tight text-teal-900"
        >
          <img src={logoImg} alt="Logo" className="h-18 w-24" />
        </Link>

        <div className="hidden items-center gap-10 md:flex ">
          <Link
            to="/freelancers"
            className="text-lg font-semibold text-black-600 transition hover:text-teal-700"
          >
            Find Freelancers
          </Link>

          <Link
            to="/jobs"
            className="text-lg font-semibold text-black-600 transition hover:text-teal-700"
          >
            Find Work
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className="text-lg font-semibold text-black-600 transition hover:text-teal-700"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />

              <Link
                to="/profile"
                className="hidden rounded-full border border-black-200 bg-black-50 px-4 py-2 text-sm font-semibold text-black-700 transition hover:border-teal-200 hover:bg-teal-50 sm:block"
              >
                {user.name}
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-xl border border-black-200 px-5 py-2 text-sm font-semibold text-black-700 transition hover:border-teal-700 hover:text-teal-700"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-5 py-2 text-md font-semibold text-black-700 transition hover:text-teal-700"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-teal-900 px-6 py-2.5 text-md font-semibold text-white shadow-md transition hover:bg-teal-800 hover:shadow-lg"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
