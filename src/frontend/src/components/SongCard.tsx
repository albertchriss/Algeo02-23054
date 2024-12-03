"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { FaPlay } from "react-icons/fa";
import MIDIPlayer from "midi-player-js";

interface SongCardProps {
  imgSrc: string;
  title: string;
  duration: string;
  number: number;
  songUrl: string;
}

export const SongCard = ({
  imgSrc,
  title,
  duration,
  number,
  songUrl,
}: SongCardProps) => {
  // const playerRef = useRef<MIDIPlayer.Player | null>(null);

  // const playSong = () => {
  //   if (playerRef.current) {
  //     playerRef.current.play();
  //   }
  // };

  // // useEffect(() => {
  //   const player = new MIDIPlayer.Player((event: MIDIPlayer.Event) => {
  //     console.log(`MIDI event: ${event.name}`);
  //   });
  //   player.loadFile(songUrl);
  //   playerRef.current = player;

  //   return () => {
  //     // Stop the player and clean up when the component unmounts
  //     player.stop();
  //   };
  // }, [songUrl]);
  return (
    <div
      className="w-full grid grid-cols-12 py-3 px-6 text-biru-teks bg-white shadow-xl shadow-gray-200/50"
      // onClick={playSong}
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
      <div className="col-span-8 flex items-center">
        <h3 className="text-md font-bold">{title}</h3>
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <p className="text-center text-gray-500">{duration}</p>
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <FaPlay className="text-2xl" />
      </div>
    </div>
  );
};
