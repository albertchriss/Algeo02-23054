import { AlbumCard } from "../AlbumCard";

interface AlbumWrapperProps {
  imgSrc: string;
  title: string;
}

export const AlbumWrapper = ({ imgSrc, title }: AlbumWrapperProps) => {
  return (
    <div className="bg-white rounded-2xl px-4 pt-4 pb-8 w-fit h-fit shadow-lg hover:scale-110 hover:cursor-pointer transition-all duration-300">
      <AlbumCard imgSrc={imgSrc} title={title} className="shadow-none" />
    </div>
  );
};
