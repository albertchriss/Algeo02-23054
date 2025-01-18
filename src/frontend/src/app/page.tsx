import { PopularAlbum } from "@/components/home/PopularAlbum";
import { PopularSongs } from "@/components/home/PopularSongs";
import { QueryPageCard } from "@/components/home/QueryPageCard";
import { UploadedPageCard } from "@/components/home/UploadPageCard";

export default function Home() {
  return (
    <div className="w-full px-10 py-8 flex flex-col gap-10">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-7">
          <PopularAlbum />
        </div>
        <div className="col-span-5 space-y-4 flex flex-col">
          <div>
            <h1 className="font-bold text-3xl text-biru-teks">
              Upload Dataset
            </h1>
          </div>
          <div className="h-full">
            <UploadedPageCard />
          </div>
        </div>
        <div className="col-span-7">
          <PopularSongs />
        </div>
        <div className="col-span-5 space-y-4 flex flex-col">
          <div>
            <h1 className="font-bold text-3xl text-biru-teks">Search</h1>
          </div>
          <div className="h-full">
            <QueryPageCard />
          </div>
        </div>
      </div>
    </div>
  );
}
