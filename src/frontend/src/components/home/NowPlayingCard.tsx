"use client";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MidiPlayerComponent } from "../MidiPlayer";

interface NowPlayingCardProps {
  midiUrl: string;
}

export const NowPlayingCard = ({ midiUrl }: NowPlayingCardProps) => {
  const { toast } = useToast();
  const [imgSrc, setImgSrc] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSong() {
      try {
        setIsLoading(true);
        const endPoint = `http://localhost:8000/song/?name=${midiUrl}`;
        const response = await fetch(endPoint, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setImgSrc(data.song["imgSrc"]);
          setTitle(data.song["title"]);
          setAudioSrc(data.song["audioSrc"]);
        } else {
          const errorData = await response.json();
          toast({
            title: "Failed to fetch song",
            description: errorData.detail,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Failed to fetch song",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    getSong();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-auto aspect-[15/16] bg-white shadow-md rounded-xl flex flex-col items-center py-8 space-y-8">
        <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-40 h-6 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-40 h-6 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-40 h-6 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="w-[400px] h-auto aspect-[15/16] bg-white shadow-md rounded-xl flex flex-col items-center py-8 space-y-8">
      <Image
        src={imgSrc}
        alt="Now Playing"
        width={1000}
        height={1000}
        className="rounded-full object-cover size-[300px] shadow-2xl shadow-black/30"
      />
      <div className="w-[80%]">
        <h2 className="text-2xl font-bold truncate">
          {title}
        </h2>
      </div>
      {audioSrc && <MidiPlayerComponent midiUrl={audioSrc} />}
    </div>
  );
};
