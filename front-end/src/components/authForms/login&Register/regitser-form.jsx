import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";

import { loginWithGoogle } from "@/services/authServices";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    Nationality: "",
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
    toast.success("Registration successful");
  };

  const handleGoogleRegister = () => {
    try{
      loginWithGoogle();
      toast.success("Registration with google successful");
    }catch(error){
      toast.error("Registration with google failed")
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 error:border-red-500"
        />

      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
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
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 error:border-red-500"
        />
    </div>
      <div className="mb-4">
        <label htmlFor="Nationality" className="block text-gray-700 font-bold mb-2">Nationality</label>
        <select
          id="Nationality"
          name="Nationality"
          value={formData.Nationality}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 error:border-red-500"
        >
          <option value="">Select your nationality</option>
          <option value="EG">Egypt</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
          <option value="IT">Italy</option>
          <option value="ES">Spain</option>
          <option value="CN">China</option>
          <option value="JP">Japan</option>
          <option value="IN">India</option>
          <option value="BR">Brazil</option>
          <option value="RU">Russia</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="MX">Mexico</option>
          <option value="KR">South Korea</option>
          <option value="SA">Saudi Arabia</option>
          <option value="ZA">South Africa</option>
          <option value="NG">Nigeria</option>
          <option value="AR">Argentina</option>
          <option value="CL">Chile</option>
          <option value="EUR">Europe</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full text-black py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer mt-4 font-semibold shadow-[0_2px_10px_rgba(255,206,42,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
        style={{ background: "linear-gradient(135deg, #FFCE2A 0%, #f5b800 100%)" }}
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
