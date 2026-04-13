import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import {  loginWithGoogle } from "@/services/authService";
import { FaGoogle } from "react-icons/fa";

export default function LoginForm() {
      const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, error, login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
   await login(formData);
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  
  return (
   <form onSubmit={handleLogin}>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm sm:text-md font-bold mb-1"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm sm:text-md font-bold mb-1"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
        />
      </div>
      <p className="text-gray-600 text-sm sm:text-md">
        Don't remember Your Password?
        <Link
          href="/auth/Reset-password"
          className="text-amber-500 hover:underline ml-1"
        >
          Reset it
        </Link>
      </p>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer mt-4 text-sm sm:text-base"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="text-gray-600 text-base sm:text-lg mt-4 text-center">or</p>
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-gray-200 text-gray-800 py-2.5 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer mt-4 flex items-center justify-center text-sm sm:text-base"
      >
        <FaGoogle className="mr-2" />
        Continue with Google
      </button>

      {error && (
        <p className="text-red-600 text-sm sm:text-base mt-3 text-center">
          {error}
        </p>
      )}
    </form>
  )
}
