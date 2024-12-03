"use client";
import { useEffect, useState } from "react";
import { AlbumCard } from "../AlbumCard";
import { useToast } from "@/hooks/use-toast";
import { AlbumSkeleton } from "./AlbumSkeleton";
import { Skeleton } from "../ui/skeleton";

type Album = {
  imgSrc: string;
  title: string;
}


export const PopularAlbum = () => {
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const endPoint = "http://localhost:8000/dataset/?is_image=true";
        const response = await fetch(endPoint, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setUploadedImages(data.images || []);
        } 
        else {
          const errorData = await response.json();
          toast({
            title: "Failed to fetch images",
            description: errorData.detail,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Failed to fetch images",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden space-y-4 py-2">
        <Skeleton className="h-[30px] w-[220px]"/>
        <div className="flex gap-10">
          {Array.from({ length: 5 }, (_, index) => index + 1).map((index) => (
            <AlbumSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden space-y-4 py-2">
      <h1 className="font-bold text-3xl text-biru-teks">Some Albums</h1>
      <div className="flex gap-10 ">
        {uploadedImages.length === 0 ? (
          <div className="h-[200px] w-full flex justify-center items-center">
            <p className="text-gray-400 italic">No Albums yet.</p>
          </div>
        ) : (
          uploadedImages.map((album, index) => (
            <AlbumCard
              key={index}
              imgSrc={album.imgSrc}
              title={album.title}
            />
          ))
        )}
      </div>
    </div>
  );
};
