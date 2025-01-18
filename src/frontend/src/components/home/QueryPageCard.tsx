"use client";
import { useRouter } from "next/navigation";
import { IoSearchCircleOutline } from "react-icons/io5";

export const QueryPageCard = () => {
  const router = useRouter();
  return (
    <div
      className="w-full h-full bg-gradient-to-br from-[#00d4ff] to-[#66b3ff] shadow-md rounded-xl flex items-center justify-center hover:cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
      onClick={() => router.push("/search")}
    >
      <IoSearchCircleOutline size={200} color="black" />
    </div>
  );
};
