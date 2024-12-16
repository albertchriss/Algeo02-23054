import { AlbumCard } from "../AlbumCard";

interface AlbumWrapperProps {
  imgSrc: string;
  title: string;
  score?: number;
}

export const AlbumWrapper = ({ imgSrc, title, score }: AlbumWrapperProps) => {
  return (
    <div className="bg-white rounded-2xl px-4 pt-4 pb-8 w-fit h-fit shadow-lg hover:scale-110 hover:cursor-pointer transition-all duration-300">
      <AlbumCard imgSrc={imgSrc} title={title} className="shadow-none" />
      <div className="flex flex-col space-y-2 mt-4">
        <p className="text-sm text-gray-500">Similarity: {score?.toFixed(2)}%</p>
      </div>
    </div>
  );
};
