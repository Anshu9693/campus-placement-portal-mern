import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  // Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8EFE2] via-[#E8D5B5] to-[#B08B5E] px-6 overflow-hidden">

      {/* Background Glow Circles */}
      <div className="absolute w-72 h-72 bg-[#5A371F]/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-[#7B4F1D]/20 rounded-full blur-3xl bottom-10 right-10"></div>

      {/* Card */}
      <div className="relative bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-12 text-center max-w-xl w-full border border-white/40">

        {/* 404 Number */}
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5A371F] to-[#7B4F1D] drop-shadow-lg">
          404
        </h1>

        {/* Animated Icon */}
        <div className="text-5xl mt-4 animate-bounce">
          🚫
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-[#5A371F] mt-6">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-[#5A371F]/80 mt-4">
          The page you are trying to access doesn’t exist or has been moved.
          You will be redirected to the homepage shortly.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-[#5A371F] text-white rounded-2xl text-lg font-semibold shadow-lg hover:bg-[#4A2C14] hover:scale-105 transition-all duration-300"
          >
            ⬅ Back to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 border-2 border-[#5A371F] text-[#5A371F] rounded-2xl text-lg font-semibold hover:bg-[#5A371F] hover:text-white transition-all duration-300"
          >
            Go Back
          </button>
        </div>

        {/* Redirect Notice */}
        <p className="text-sm text-[#5A371F]/60 mt-6">
          Redirecting automatically in 5 seconds...
        </p>

      </div>
    </div>
  );
} 