import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F8EFE2] via-[#E8D5B5] to-[#B08B5E] z-50">
      
      {/* Spinning Ring */}
      <div className="relative">
        <div className="w-24 h-24 border-4 border-[#5A371F]/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-[#5A371F] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>

      {/* Brand Name */}
      <h2 className="mt-8 text-2xl font-bold text-[#5A371F] tracking-wide animate-pulse">
        Avani EnterPrices
      </h2>

      {/* Loading Text */}
      <p className="mt-2 text-[#5A371F]/80 text-sm tracking-widest">
        Loading Experience...
      </p>
    </div>
  );
}