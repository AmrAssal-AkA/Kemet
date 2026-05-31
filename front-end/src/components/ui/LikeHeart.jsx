"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { FaHeart } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { likeBlog } from "@/services/contentServices";

export default function LikeHeart({
  blogId,
  initialLiked = false,
  initialCount = 0,
  onChange,
}) {
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

    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount((prev) => (wasLiked ? Math.max(0, prev - 1) : prev + 1));

    try {
      const data = await likeBlog(blogId);
      const backendCount =
        data?.likeCount ??
        data?.likesCount ??
        data?.likes ??
        data?.data?.likeCount ??
        data?.data?.likesCount ??
        data?.data?.likes;
      const backendLiked =
        data?.liked ??
        data?.isLiked ??
        data?.data?.liked ??
        data?.data?.isLiked ??
        (data?.status ? data.status === "liked" : undefined);
      const nextLiked =
        typeof backendLiked === "boolean" ? backendLiked : !wasLiked;
      const nextCount =
        typeof backendCount === "number"
          ? backendCount
          : wasLiked
            ? Math.max(0, likesCount - 1)
            : likesCount + 1;

      setIsLiked(nextLiked);
      setLikesCount(nextCount);
      onChange?.({ isLiked: nextLiked, likesCount: nextCount, response: data });
    } catch (error) {
      setIsLiked(wasLiked);
      setLikesCount((prev) => (wasLiked ? prev + 1 : Math.max(0, prev - 1)));

      if (error.message === "UNAUTHORIZED") {
        router.push("/auth/auth");
      } else {
        console.error("[LikeHeart] Like request failed:", error.message);
      }
    } finally {
      setLoading(false);
      isPending.current = false;
    }
  }

  return (
    <button
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isLiked
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      onClick={toggleLike}
      disabled={loading}
      aria-label={isLiked ? "Unlike this blog" : "Like this blog"}
      aria-pressed={isLiked}
    >
      <FaHeart />
      <span>
        {isLiked ? "Liked" : "Like"}
        {likesCount > 0 ? ` (${likesCount})` : ""}
      </span>
    </button>
  );
}
