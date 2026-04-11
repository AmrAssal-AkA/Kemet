"use client";
import { useState } from "react";

import { FaHeart } from "react-icons/fa";

export default function LikeHeart() {
    const [isLiked, setIsLiked] = useState(false);

    function toggleLike(){
        setIsLiked(!isLiked);
    }
  return (
    <button className={`flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} hover:${isLiked ? 'bg-red-600' : 'bg-gray-300'}`} onClick={toggleLike}>
      <FaHeart />
      <span>Like</span>
    </button>
  );
}
