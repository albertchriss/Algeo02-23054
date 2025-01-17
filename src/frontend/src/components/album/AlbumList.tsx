"use client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { Album } from "@/components/home/PopularAlbum";
import { AlbumSkeleton } from "../home/AlbumSkeleton";
import { AlbumWrapper } from "./AlbumWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationControl } from "../PaginationControl";

export const AlbumList = () => {
  const searchParams = useSearchParams();
  let page = searchParams.get("page") ?? "1";
  if (Number(page) < 1) {
    page = "1";
  }

  const q = searchParams.get("q") ?? "";
  const limit = 12;

  const router = useRouter();
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const endPoint = `http://localhost:8000/dataset/?is_image=true&limit=${limit}&page=${page}&search=${q}`;
        const response = await fetch(endPoint, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setUploadedImages(data.images);
          setTotalPage(Math.ceil(data.total / limit));
        } else {
          const errorData = await response.json();
          setUploadedImages([]);
          setTotalPage(1);
          toast({
            title: "Failed to fetch images",
            description: errorData.detail,
            variant: "destructive",
          });
        }
      } catch (error) {
        setUploadedImages([]);
        setTotalPage(1);
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
  }, [page, q]);

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-4 gap-y-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            className="bg-white rounded-2xl px-4 pt-4 pb-8 w-fit h-fit shadow-lg"
            key={index}
          >
            <AlbumSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="w-full grid grid-cols-4 gap-y-8">
        {uploadedImages.length === 0 ? (
          <div className="h-[200px] col-span-3 flex justify-center items-center">
            <p className="text-gray-400 italic">No Albums yet.</p>
          </div>
        ) : (
          uploadedImages.map((album, index) => (
            <div
              key={index}
              onClick={() => router.push(`/album/${album.title}`)}
            >
              <AlbumWrapper imgSrc={album.imgSrc} title={album.title} />
            </div>
          ))
        )}
      </div>
      <PaginationControl totalPage={totalPage} currentUrl={`/album?`} />
    </>
  );
};
