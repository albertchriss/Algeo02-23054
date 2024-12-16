"use client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Song } from "../home/PopularSongs";

export const ImageResult = () => {
  // const limit = 12;

  const router = useRouter();
  const { toast } = useToast();
  const [resultAudios, setResultAudios] = useState<Song[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const endPoint = `http://localhost:8000/query/?is_image=false`;
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
        Audio found in {timeTaken.toFixed(2)} seconds.
      </h1>
      <div className="flex flex-col w-full gap-3">
        {uploadedAudios.length === 0 ? (
          <div className="h-64 w-full flex items-center justify-center">
            <p className="italic text-gray-500">No songs.</p>
          </div>
        ) : (
          uploadedAudios.map((song, index) => (
            <SongCard
              key={index}
              imgSrc={song.imgSrc}
              title={song.title}
              duration={"3:00"}
              number={(Number(page) - 1) * limit + index + 1}
              audioSrc={song.audioSrc}
            />
          ))
        )}
      </div>
    </>
  );
};
