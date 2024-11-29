import { AlbumCard } from "../AlbumCard";

interface Album {
  imgSrc: string;
  title: string;
}

interface PopularAlbumProps {
  albums: Album[];
}

export const PopularAlbum = ({ albums }: PopularAlbumProps) => {
  return (
    <div className="w-full overflow-hidden space-y-4 py-2">
      <h1 className="font-bold text-3xl text-biru-teks">Some Albums</h1>
      <div className="flex gap-10 ">
        {
            albums.map((album, index) => (
                <AlbumCard key={index} imgSrc={album.imgSrc} title={album.title} />
            ))
        }
      </div>
    </div>
  );
};
