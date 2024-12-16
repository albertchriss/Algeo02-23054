"use client";
import { useRouter } from "next/navigation";
import { IoSearchCircleOutline } from "react-icons/io5";



export const QueryPageCard = () => {
    const router = useRouter();
  return (
    <div className="w-full h-auto aspect-[15/16] bg-gradient-to-br from-[#12c2e9] to-[#11998e] shadow-md rounded-xl flex flex-col items-center py-8 space-y-8 justify-center hover:cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
    onClick={() => router.push('/search')}
    >
      <IoSearchCircleOutline size={200} color="black"/>
    </div>
  );
};
