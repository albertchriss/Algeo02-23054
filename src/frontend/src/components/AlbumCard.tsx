import Image from "next/image";

interface AlbumCardProps {
  imgSrc: string;
  title: string;
  className?: string;
  divClassName?: string;
}

export const AlbumCard = ({ imgSrc, title, className, divClassName }: AlbumCardProps) => {
  return (
    <div className={`flex flex-col flex-shrink-0 gap-4 overflow-hidden max-w-[200px] ${divClassName}`}>
      <Image
        src={imgSrc}
        alt={title}
        width={1000}
        height={1000}
        className={`rounded-xl shadow-lg size-[200px] object-cover ${className}`}
      />
      <h3 className="font-bold truncate">
        {title?.substring(0, title.lastIndexOf("."))}
      </h3>
    </div>
  );
};
