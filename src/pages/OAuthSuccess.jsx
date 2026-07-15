import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = searchParams.get("token");
    if (!token) {
      navigate("/login?error=oauth_failed", { replace: true });
      return;
    }
    loginWithToken(token)
      .then(() => navigate("/profile", { replace: true }))
      .catch(() => setError("We couldn't complete sign-in. Please try again."));
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-lg font-semibold text-red-600">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 rounded-xl bg-teal-900 px-6 py-2.5 text-md font-bold text-white"
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />
            <p className="text-md font-semibold text-teal-950">
              Signing you in…
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthSuccess;
