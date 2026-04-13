import Image from "next/image";
import { useState } from "react";

import LoginForm from "./login&Register/login-form";
import RegisterForm from "./login&Register/regitser-form";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  function toggleForm() {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsTransitioning(false);
    }, 300);
  }

  return (

      <div className="w-full max-w-md md:max-w-4xl bg-white rounded-2xl shadow-xl flex overflow-hidden">
        <div className="relative w-1/2 h-1/2 hidden md:block">
          <Image
            src="/images/sign-in.jpg"
            alt="Authentication page background"
            className="object-cover"
            width={500}
            height={500}
            priority
          />
        </div>

        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-xl font-bold text-center transition-all duration-300">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <div className="border-b border-gray-500 mb-6 mt-4"></div>

          <button
            onClick={toggleForm}
            disabled={isTransitioning}
            aria-label={
              isLogin ? "Switch to register form" : "Switch to login form"
            }
            className="w-full bg-black hover:bg-amber-600 disabled:bg-amber-400 text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 cursor-pointer transition-all duration-200 mt-4 flex items-center justify-center text-sm sm:text-base"
          >
            {isLogin ? "Switch to Register" : "Switch to Login"}
          </button>

          <div
            className={`mt-6 transition-opacity duration-300 ${
              isTransitioning ? "opacity-50" : "opacity-100"
            }`}
            style={{ pointerEvents: isTransitioning ? "none" : "auto" }}
          >
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
  );
}

export default AuthForm;
