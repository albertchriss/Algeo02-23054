"use client";
import { useEffect, useState } from "react";
import { AlbumCard } from "../AlbumCard";
import { useToast } from "@/hooks/use-toast";
import { AlbumSkeleton } from "./AlbumSkeleton";
import Link from "next/link";

export type Album = {
  imgSrc: string;
  title: string;
};

export const PopularAlbum = () => {
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const endPoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/dataset/?is_image=true&limit=3`;
        const response = await fetch(endPoint, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setUploadedImages(data.images || []);
        } else {
          const errorData = await response.json();
          toast({
            title: "Failed to fetch images",
            description: errorData.detail,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Failed to fetch images",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <h1 className="font-bold text-3xl text-biru-teks">Some Albums</h1>
        <div className="flex bg-white rounded-md shadow-md items-center justify-center overflow-hidden relative">
          <div className="flex gap-10 rounded-md py-4 px-8 justify-evenly w-full h-full">
            {Array.from({ length: 3 }, (_, index) => index + 1).map((index) => (
              <AlbumSkeleton key={index} className="flex-1 aspect-square max-w-[200px] overflow-hidden" showTitle={false}/>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 ">
      <h1 className="font-bold text-3xl text-biru-teks">Some Albums</h1>

      <Link
        href="/album"
        className="flex bg-white rounded-md shadow-md items-center justify-center group overflow-hidden relative hover:bg-cyan-tua/20 transition-all duration-500"
      >
        <div className="flex gap-10 rounded-md py-4 px-8 justify-evenly w-full h-full">
          {uploadedImages.length === 0 ? (
            <div className="h-[200px] w-full flex justify-center items-center group-hover:-translate-x-[370%] transition-all duration-500">
              <p className="text-gray-400 italic">No Albums yet.</p>
            </div>
          ) : (
            uploadedImages.map((album, index) => (
              <AlbumCard
                key={index}
                imgSrc={album.imgSrc}
                title=""
                divClassName="group-hover:-translate-x-[370%] transition-all duration-500 flex-1 aspect-square"
              />
            ))
          )}
        </div>
        <div className="absolute flex justify-center w-full left-[100%] group-hover:left-0 transition-all duration-500">
          <h1 className="font-bold text-5xl">See More...</h1>
        </div>
      </Link>
    </div>
  );
};
