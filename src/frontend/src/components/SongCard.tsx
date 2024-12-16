"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SongCardProps {
  imgSrc: string;
  title: string;
  number: number;
  score?: number;
}

export const SongCard = ({ imgSrc, title, number, score }: SongCardProps) => {
  const router = useRouter();

  return (
    <div
      className="w-full grid grid-cols-12 py-3 px-6 text-biru-teks bg-white shadow-xl shadow-gray-200/50 hover:scale-105 hover:bg-cyan-tua/10 transition-all duration-300 hover:cursor-pointer"
      onClick={() => router.push(`/song/${title}.mid`)}
    >
      <div className="col-span-1 flex items-center">
        <p className="font-extrabold text-xl">{number}</p>
      </div>
      <div className="col-span-1 flex items-center">
        <Image
          src={imgSrc}
          alt={title}
          width={100}
          height={100}
          className="size-10 object-cover rounded-sm"
        />
      </div>
      <div
        className={`${score ? "col-span-8" : "col-span-10"} flex items-center`}
      >
        <h3 className="text-md font-bold">{title}</h3>
      </div>
      {score && (
        <div className="col-span-2 flex items-center justify-end">
          <p className="text-center text-gray-500">Similarity: {(score*100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};
