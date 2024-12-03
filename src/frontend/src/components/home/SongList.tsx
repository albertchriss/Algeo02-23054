"use client";
import { useToast } from "@/hooks/use-toast";
import { SongCard } from "../SongCard";
import { useEffect, useState } from "react";

type Song = {
  imgSrc: string;
  audioSrc: string;
  title: string;
};

export const SongList = () => {
  const { toast } = useToast();
  const [uploadedAudios, setUploadedAudios] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        setIsLoading(true);
        const endPoint = "http://localhost:8000/dataset/?is_image=false";
        const response = await fetch(endPoint, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setUploadedAudios(data.midis || []);
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
    fetchAudios();
  }, []);
  return (
    <div className="w-full space-y-4">
      <h1 className="font-bold text-3xl text-biru-teks">Some Musics</h1>
      <div className="flex flex-col w-full gap-3">
        {uploadedAudios.map((song, index) => (
          <SongCard
            key={index}
            imgSrc={song.imgSrc}
            title={song.title}
            duration={"3:00"}
            number={index + 1}
            songUrl={song.audioSrc}
          />
        ))}
      </div>
    </div>
  );
};
