import Image from "next/image";

interface NowPlayingCardProps {
  imgSrc: string;
  title: string;
  duration: string;
}

export const NowPlayingCard = ({
  imgSrc,
  title,
  duration,
}: NowPlayingCardProps) => {
  return (
    <div className="w-full h-auto aspect-[15/16] bg-abu-abu shadow-md rounded-xl flex flex-col items-center py-8 space-y-8">
        <Image
          src={imgSrc}
          alt="Now Playing"
          width={1000}
          height={1000}
          className="rounded-full object-cover size-[300px] shadow-2xl shadow-black/30"
        />
        <h2 className="text-2xl font-bold">{title}</h2>
      <div className="w-[70%] flex flex-col items-center">
        <div className="w-full h-1 rounded-full bg-slate-400/50"></div>
        <div className="flex justify-between w-full">
          <p className="text-gray-500">0:00</p>
          <p className="text-gray-500">{duration}</p>
        </div>
      </div>
    </div>
  );
};
