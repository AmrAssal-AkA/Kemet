"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/router";

import { FaHeart } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { likeBlog } from "@/services/contentServices";

export default function LikeHeart({ blogId, initialLiked = false, initialCount = 0 }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const isPending = useRef(false);

  async function toggleLike() {
    if (isPending.current) return;

    if (!user) {
      router.push("/auth/auth");
      return;
    }

    isPending.current = true;
    setLoading(true);

    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount((prev) => (wasLiked ? Math.max(0, prev - 1) : prev + 1));

    try {
      const data = await likeBlog(blogId);

      // Sync with backend count if returned
      const backendCount =
        data?.likesCount ?? data?.likes ?? data?.data?.likesCount ?? data?.data?.likes;
      if (typeof backendCount === "number") {
        setLikesCount(backendCount);
      }

      // Determine final liked state from response status context:
      // 201 → liked, 200 → unliked (already toggled optimistically — keep it)
    } catch (error) {
      if (error.message === "UNAUTHORIZED") {
        // Revert optimistic update and redirect
        setIsLiked(wasLiked);
        setLikesCount((prev) => (wasLiked ? prev + 1 : Math.max(0, prev - 1)));
        router.push("/auth/auth");
      } else {
        // Revert on any other error
        setIsLiked(wasLiked);
        setLikesCount((prev) => (wasLiked ? prev + 1 : Math.max(0, prev - 1)));
        console.error("[LikeHeart] Like request failed:", error.message);
      }
    } finally {
      setLoading(false);
      isPending.current = false;
    }
  }

  return (
    <button
      className={`flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer ${isLiked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"} hover:${isLiked ? "bg-red-600" : "bg-gray-300"} disabled:opacity-60 disabled:cursor-not-allowed`}
      onClick={toggleLike}
      disabled={loading}
      aria-label={isLiked ? "Unlike this blog" : "Like this blog"}
      aria-pressed={isLiked}
    >
      <FaHeart />
      <span>{isLiked ? "Liked" : "Like"}{likesCount > 0 ? ` (${likesCount})` : ""}</span>
    </button>
  );
}
