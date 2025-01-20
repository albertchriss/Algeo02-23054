import { Skeleton } from "../ui/skeleton";

export const AlbumSkeleton = ({ className, showTitle = true }: { className?: string; showTitle?: boolean }) => {
  return (
    <div className={`rounded-xl flex flex-col flex-shrink-0 gap-4 ${className} `}>
      <Skeleton className="size-[200px] rounded-xl" />
      {
        showTitle && <Skeleton className="w-12 h-4" />
      }
    </div>
  );
};
