"use client";
import { useEffect, useState } from "react";
import type { Song } from "../song/SongList";
import { SongCard } from "../SongCard";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { SongSkeleton } from "../home/SongSkeleton";
import { PaginationControl } from "../PaginationControl";

interface AlbumViewProps {
  name: string;
}

export const AlbumView = ({ name }: AlbumViewProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const limit = 10;
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  let page = searchParams.get("page") ?? "1";
  if (Number(page) < 1) {
    page = "1";
  }
  const { toast } = useToast();

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/dataset/${name}/?page=${page}&limit=${limit}`
        );
        if (response.ok) {
          const data = await response.json();
          setSongs(data.midi || []);
          setTotalPage(Math.ceil(data.total / limit));
        } else {
          const errorData = await response.json();
          setSongs([]);
          setTotalPage(1);
          toast({
            title: "Failed to fetch album data",
            description: errorData.detail,
            variant: "destructive",
          });
        }
      } catch (error) {
        setSongs([]);
        setTotalPage(1);
        toast({
          title: "Failed to fetch album data",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumData();
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <SongSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-4xl font-semibold italic ">No Album.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-3x">
      {songs.map((song, index) => (
        <SongCard
          key={index}
          number={(Number(page)-1)*limit+index+1}
          audioSrc={song.audioSrc}
          imgSrc={song.imgSrc}
          title={song.title}
          duration={"3:00"}
        />
      ))}
      <PaginationControl currentUrl={`/album/${name}?`} totalPage={totalPage} />
    </div>
  );
};
