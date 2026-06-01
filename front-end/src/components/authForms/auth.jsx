import Image from "next/image";
import { useState } from "react";

import LoginForm from "./login&Register/login-form";
import RegisterForm from "./login&Register/regitser-form";
import { useLanguage } from "@/i18n/LanguageContext";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useLanguage();

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
            {isLogin ? t("auth.welcomeBack") : t("auth.createAccount")}
          </h1>
          <div className="border-b border-gray-500 mb-6 mt-4"></div>

          <button
            onClick={toggleForm}
            disabled={isTransitioning}
            aria-label={
              isLogin ? t("auth.switchRegisterAria") : t("auth.switchLoginAria")
            }
            className="w-full text-black font-medium py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 cursor-pointer transition-all duration-200 mt-4 flex items-center justify-center text-sm sm:text-base shadow-[0_2px_10px_rgba(255,206,42,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #FFCE2A 0%, #f5b800 100%)" }}
          >
            {isLogin ? t("auth.switchRegister") : t("auth.switchLogin")}
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
