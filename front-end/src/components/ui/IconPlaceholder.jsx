import React from "react";

export default function IconPlaceholder({ className = "" }) {
  return (
    <div
      className={`rounded-full bg-[#FBBF24] p-3 w-12 h-12 flex items-center justify-center text-white ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
      >
        <path
          d="M12 2v20M2 12h20M17 5L5 17M7 5l12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
