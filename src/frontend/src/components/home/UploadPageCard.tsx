"use client";
import { useRouter } from "next/navigation";
import { MdOutlineFileUpload } from "react-icons/md";

export const UploadedPageCard = () => {
  const router = useRouter();
  return (
    <div
      className="w-full h-full bg-gradient-to-br from-cyan-tua to-[#54ddff] shadow-md rounded-xl flex items-center justify-center hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
      onClick={() => router.push("/upload")}
    >
      <MdOutlineFileUpload size={150} color="black" />
    </div>
  );
};
