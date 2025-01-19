"use client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Song } from "../home/PopularSongs";
import { SongSkeleton } from "../home/SongSkeleton";
import { SongCard } from "../SongCard";

type extendedSong = Song & {
  score: string;
};

export const AudioResult = () => {
  const { toast } = useToast();
  const [resultAudios, setResultAudios] = useState<extendedSong[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const endPoint = `${process.env.BACKEND_URL}/query/?is_image=false`;
        const response = await fetch(endPoint, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setResultAudios(data.result || []);
          setTimeTaken(Number(data.time));
        } else {
          const errorData = await response.json();
          setResultAudios([]);
          setTimeTaken(0);
          toast({
            title: "Failed to fetch images",
            description: errorData.detail,
            variant: "destructive",
          });
        }
      } catch (error) {
        setResultAudios([]);
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
      <div className="flex flex-col w-full gap-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <SongSkeleton key={index} />
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
        {resultAudios.length === 0 ? (
          <div className="h-64 w-full flex items-center justify-center">
            <p className="italic text-gray-500">No songs.</p>
          </div>
        ) : (
          resultAudios.map((song, index) => (
            <SongCard
              key={index}
              imgSrc={song.imgSrc}
              title={song.title}
              score={Number(song.score)}
              number={index + 1}
            />
          ))
        )}
      </div>
    </>
  );
};
