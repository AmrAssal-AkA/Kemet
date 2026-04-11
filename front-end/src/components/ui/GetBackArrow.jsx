"use client";
import { useRouter } from "next/router";
import {FaArrowLeft} from "react-icons/fa";

export default function GetBackArrow() {
    const router = useRouter()
    function handleGoBack() {
        router.replace("/Blog")
    }
  return (
    <button onClick={handleGoBack} className="mb-6 flex items-center gap-2 cursor-pointer">
      <FaArrowLeft className="text-2xl text-gray-600 hover:text-gray-800 " />
    </button>
  );
}
