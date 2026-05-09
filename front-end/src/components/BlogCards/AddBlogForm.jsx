"use client";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AddBlogForm({ onSuccess }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to submit a blog post");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }
    if (image.length === 0) {
      setError("Image is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      Array.from(image).forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post("/api/Blog/AddBlog", formData, {
        withCredentials: true,
      });

      setLoading(false);
      setSuccess(true);
      setTitle("");
      setContent("");
      setImage([]);
      e.target.reset();
      onSuccess();
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit blog post. Please try again.";
      setError(errorMessage);
      console.error("Form submission error:", error);
    }
  };

  return (
    <>
      <div className="bg-black opacity-60 " />
      <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            id="title"
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            id="content"
            rows="6"
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="image"
          >
            Image
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer text-gray-600"
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files)}
            multiple
          />
        </div>
        <button
          className={`w-full bg-yellow-500 text-black font-bold py-3 px-4 mt-4 rounded-lg hover:bg-yellow-600 transition duration-300 shadow-md hover:shadow-lg text-lg ${loading ? "cursor-not-allowed opacity-50" : ""}`}
          type="submit"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && (
        <p className="text-green-500 mt-4">Blog post submitted successfully!</p>
      )}
    </>
  );
}
