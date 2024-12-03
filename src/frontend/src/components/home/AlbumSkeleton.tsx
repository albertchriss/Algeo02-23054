import { Skeleton } from "../ui/skeleton"

export const AlbumSkeleton = () => {
    return (
        <div className="rounded-xl flex flex-col flex-shrink-0 gap-4">
            <Skeleton className="size-[200px] rounded-xl"/>
            <Skeleton className="w-12 h-4"/>
        </div>
    )
}