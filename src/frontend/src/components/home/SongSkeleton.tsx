import { Skeleton } from "../ui/skeleton";

export const SongSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-12 py-3 px-6 text-biru-teks bg-white shadow-xl shadow-gray-200/50">
      <div className="col-span-1 flex items-center">
        <Skeleton className="h-[20px] w-5" />
      </div>
      <div className="col-span-1 flex items-center">
        <Skeleton className="size-10 rounded-sm" />
      </div>
      <div className="col-span-8 flex items-center">
        <Skeleton className="h-[16px] w-40" />
      </div>
      <div className="col-span-2 flex items-center justify-end">
        <Skeleton className="h-[16px] w-20" />
      </div>
    </div>
  );
};
