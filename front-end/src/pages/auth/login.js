import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import { loginUser, loginWithGoogle } from "../../services/authService";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectByRole = (role) => {
    if (role === "user") {
      router.push("/user-dashboard");
    } else if (role === "guide") {
      router.push("/guide-dashboard");
    } else if (role === "admin") {
      router.push("/admin-dashboard");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { token, user: userParam, error } = router.query;

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        redirectByRole(user.role);
        return;
      } catch (_) {}
    }

    if (error) {
      setError("Google sign-in failed. Please try again.");
    }

    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        redirectByRole(user.role);
      }
    } catch (_) {
      // Ignore localStorage parsing errors
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      redirectByRole(data.user.role);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      <div className="w-full max-w-md md:max-w-4xl bg-white rounded-2xl shadow-xl flex overflow-hidden">
        <div className="relative w-1/2 h-1/2 hidden md:block">
          <Image
            src="/images/sign-in.jpg"
            alt="Sign in"
            className="object-cover"
            width={500}
            height={500}
            priority
          />
        </div>

        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-xl font-bold text-center">
            Welcome Back
          </h1>
          <div className="border-b border-gray-500 mb-6 mt-4"></div>
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
            <p className="text-gray-600 text-base sm:text-lg mt-4 text-center">
              or
            </p>
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
        </div>
      </div>
    </main>
  );
}
