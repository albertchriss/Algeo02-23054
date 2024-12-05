import { NowPlayingCard } from "@/components/home/NowPlayingCard";
import { PopularAlbum } from "@/components/home/PopularAlbum";
import { PopularSongs } from "@/components/home/PopularSongs";


export default function Home() {
  return (
    <div className="w-full px-10 py-4 flex flex-col gap-10">
      <PopularAlbum />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-7">
          <PopularSongs/>
        </div>
        <div className="col-span-5 space-y-4">
          <h1 className="font-bold text-3xl text-biru-teks">Now Playing</h1>
          <NowPlayingCard imgSrc="/cover.jpeg" title="Ian ngerap" duration="10:00"/>
        </div>
      </div>
    </div>
  );
}
