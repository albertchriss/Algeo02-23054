"use client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { Album } from "@/components/home/PopularAlbum";
import { AlbumSkeleton } from "../home/AlbumSkeleton";
import { AlbumWrapper } from "@/components/album/AlbumWrapper";
import { useRouter } from "next/navigation";

type extendedAlbum = Album & {
  score: string;
};

export const ImageResult = () => {
  // const limit = 12;

  const router = useRouter();
  const { toast } = useToast();
  const [resultImages, setresultImages] = useState<extendedAlbum[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const endPoint = `http://localhost:8000/query/?is_image=true`;
        const response = await fetch(endPoint, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setresultImages(data.result || []);
          setTimeTaken(Number(data.time));
        } else {
          const errorData = await response.json();
          setresultImages([]);
          setTimeTaken(0);
          toast({
            title: "Failed to fetch images",
            description: errorData.detail,
            variant: "destructive",
          });
        }
      } catch (error) {
        setresultImages([]);
        setTimeTaken(0);
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
      <div className="w-full grid grid-cols-4 gap-y-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            className="bg-white rounded-2xl px-4 pt-4 pb-8 w-fit h-fit shadow-lg"
            key={index}
          >
            <AlbumSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl">
        Images found in {timeTaken.toFixed(2)} seconds.
      </h1>
      <div className="w-full grid grid-cols-4 gap-y-8">
        {resultImages.length === 0 ? (
          <div className="h-[200px] col-span-4 flex justify-center items-center">
            <p className="text-gray-400 italic">No Albums.</p>
          </div>
        ) : (
          resultImages.map((album, index) => (
            <div
              key={index}
              onClick={() => router.push(`/album/${album.title}`)}
            >
              <AlbumWrapper
                imgSrc={album.imgSrc}
                title={album.title}
                score={Number(album.score)}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};
