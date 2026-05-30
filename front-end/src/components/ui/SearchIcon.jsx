import React from "react";

export default function SearchIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.5 19a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17ZM21 21l-5.2-5.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
