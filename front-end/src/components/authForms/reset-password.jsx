"use client";

import { useState } from "react";
import { useRouter } from "next/router";

import { confirmResetPassword } from "@/services/authService";

export default function ResetPassword({ token }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
   console.log("token in reset password component:", token);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
   
    if (!token) {
      setError("Invalid or missing token.");
      setIsLoading(false);
      return;
    }
    console.log("submitting with token:", token, "and new password:", formData.newPassword);
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
      const res = await confirmResetPassword({
        token,
        newPassword: formData.newPassword,
      });
      setSuccessMessage(res.message || "Password reset successful!");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-md p-8 rounded-lg shadow-md mt-6"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          htmlFor="newPassword"
          className="block text-gray-700 font-bold mb-2"
        >
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your new password"
          required
          onChange={(e) =>
            setFormData({ ...formData, newPassword: e.target.value })
          }
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="confirmNewPassword"
          className="block text-gray-700 font-bold mb-2"
        >
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmNewPassword"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm your new password"
          required
          onChange={(e) =>
            setFormData({ ...formData, confirmNewPassword: e.target.value })
          }
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        disabled={isLoading}
      >
        {isLoading ? "confirming...." : "Confirm Reset Password"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mt-4">{successMessage}</p>
      )}
    </form>
  );
}
