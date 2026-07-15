import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-50 via-white to-paper">
    <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl"></div>
    <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-teal-100 blur-3xl"></div>

    <div className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-[32px] border border-gray-100 bg-white p-12 text-center shadow-xl">
        <h1 className="font-display text-9xl font-extrabold tracking-tight text-teal-900">
          404
        </h1>

        <h2 className="mt-4 font-display text-4xl font-bold text-gray-900">
          Page Not Found
        </h2>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-gray-500">
          Sorry, the page you are looking for doesn't exist or has been moved.
          Please check the URL or return to the homepage.
        </p>

        <Link
          to="/"
          className="mt-10 inline-flex items-center rounded-xl bg-teal-900 px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-teal-800 hover:shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
