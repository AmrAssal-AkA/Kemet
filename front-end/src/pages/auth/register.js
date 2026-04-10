import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { loginWithGoogle, registerUser } from "@/services/authService";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === "user") {
          router.push("/user-dashboard");
        } else if (user.role === "guide") {
          router.push("/guide-dashboard");
        } else if (user.role === "admin") {
          router.push("/admin-dashboard");
        }
      }
    } catch (_) {

    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/user-dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    loginWithGoogle();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 ">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex overflow-hidden">
        <div className="relative w-1/2 hidden md:block">
          <Image
            src="/images/sign-up.jpg"
            className="object-cover"
            fill
            sizes="50vw"
            alt="sign up image"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-br from-amber-900/70 via-black/50 to-black/80" />
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-amber-500/20 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-amber-700/30 blur-3xl" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center">Register</h1>
          <div className="border-b border-gray-500 mb-6 mt-4"></div>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 error:border-red-500"
              />
              {error && <p className="text-red-600 text-xl">{error}</p>}
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 error:border-red-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 error:border-red-500"
              />
            </div>
            <p className="text-gray-600 text-lg">
              Already Have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-500 hover:underline"
              >
                Login
              </Link>
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer mt-4"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="text-gray-600 text-lg mt-4 text-center">Or</p>
            <button
              type="button"
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer mt-4 flex items-center justify-center"
              onClick={handleGoogleRegister}
            >
              <FaGoogle className="mr-2" />
              continue with Google
            </button>
            {error && <p className="text-red-600 text-xl">{error}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
