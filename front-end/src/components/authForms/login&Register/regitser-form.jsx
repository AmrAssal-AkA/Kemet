import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

import { loginWithGoogle } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { register, loading, error } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(formData);
  };

  const handleGoogleRegister = () => {
    loginWithGoogle();
  };

  return (
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
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
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
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
  );
}
