import { NowPlayingCard } from "@/components/home/NowPlayingCard";
import React from "react";

const SongNamePage = ({ params }: { params: { name: string } }) => {
  const { name } = params; 
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <NowPlayingCard midiUrl={name} />
    </div>
  );
};

export default SongNamePage;
