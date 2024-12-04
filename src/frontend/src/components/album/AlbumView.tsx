"use client";
import { useEffect, useState } from "react";
import type { Song } from "../song/SongList";
import { SongCard } from "../SongCard";

interface AlbumViewProps {
  name: string;
}

export const AlbumView = ({ name }: AlbumViewProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/dataset/${name}`);
        if (response.ok) {
          const data = await response.json();
          setSongs(data.midi || []);
        } else {
          console.error("Failed to fetch album data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlbumData();
  }, []);

  if (songs.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-4xl font-semibold italic ">No Album.</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col w-full gap-3">
        {songs.map((song, index) => (
          <SongCard key={index} number={index+1} audioSrc={song.audioSrc} imgSrc={song.imgSrc} title={song.title} duration={"3:00"}/>
        ))}
      </div>
    </div>
  );
};
