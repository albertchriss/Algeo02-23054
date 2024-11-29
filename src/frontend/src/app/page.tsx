import { NowPlayingCard } from "@/components/home/NowPlayingCard";
import { PopularAlbum } from "@/components/home/PopularAlbum";
import { SongList } from "@/components/home/SongList";

const albums = [
  {
    imgSrc: "/cover.jpeg",
    title: "Album 1",
  },
  {
    imgSrc: "/cover.jpeg",
    title: "Album 2",
  },
  {
    imgSrc: "/cover.jpeg",
    title: "Album 3",
  },
  {
    imgSrc: "/cover.jpeg",
    title: "Album 4",
  },
  {
    imgSrc: "/cover.jpeg",
    title: "Album 5",
  },
];

const songs = [
  {
    imgSrc: "/cover.jpeg",
    title: "Song 1",
    duration: "3:00",
  },
  {
    imgSrc: "/cover.jpeg",
    title: "Song 2",
    duration: "3:00",
  },
  {
    imgSrc: "/cover.jpeg",
    title: "Song 3",
    duration: "3:00",
  },
  {
    imgSrc: "/cover.jpeg",
    title: "Song 4",
    duration: "3:00",
  },
  {
    imgSrc: "/cover.jpeg",
    title: "Song 5",
    duration: "3:00",
  },
  {
    imgSrc: "/cover.jpeg",
    title: "Song 5",
    duration: "3:00",
  },
  {
    imgSrc: "/cover.jpeg",
    title: "Song 5",
    duration: "3:00",
  },
];

export default function Home() {
  return (
    <div className="w-full px-10 py-4 flex flex-col gap-10">
      <PopularAlbum albums={albums} />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-7">
          <SongList songs={songs} />
        </div>
        <div className="col-span-5 space-y-4">
          <h1 className="font-bold text-3xl text-biru-teks">Now Playing</h1>
          <NowPlayingCard imgSrc="/cover.jpeg" title="Ian ngerap" duration="10:00"/>
        </div>
      </div>
    </div>
  );
}
