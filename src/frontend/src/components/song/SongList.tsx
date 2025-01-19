"use client";
import { useToast } from "@/hooks/use-toast";
import { SongCard } from "../SongCard";
import { useEffect, useState } from "react";
import { SongSkeleton } from "@/components/home/SongSkeleton";
import { PaginationControl } from "../PaginationControl";
import { useSearchParams } from "next/navigation";

export type Song = {
  imgSrc: string;
  audioSrc: string;
  title: string;
};

export const SongList = () => {
  const { toast } = useToast();
  const [uploadedAudios, setUploadedAudios] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const limit = 10;

  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  let page = searchParams.get("page") ?? "1";
  if (Number(page) < 1) {
    page = "1";
  }

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        setIsLoading(true);
        const endPoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/dataset/?is_image=false&page=${page}&limit=${limit}&search=${q}`;
        const response = await fetch(endPoint, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setUploadedAudios(data.midis || []);
          setTotalPage(Math.ceil(data.total / limit));
        } else {
          const errorData = await response.json();
          setUploadedAudios([]);
          setTotalPage(1);
          toast({
            title: "Failed to fetch images",
            description: errorData.detail,
            variant: "destructive",
          });
        }
      } catch (error) {
        setUploadedAudios([]);
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
    fetchAudios();
  }, [page, q]);

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex flex-col w-full gap-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <SongSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col w-full gap-3">
        {uploadedAudios.length === 0 ? (
          <div className="h-64 w-full flex items-center justify-center">
            <p className="italic text-gray-500">No songs.</p>
          </div>
        ) : (
          uploadedAudios.map((song, index) => (
            <SongCard
              key={index}
              imgSrc={song.imgSrc}
              title={song.title}
              number={(Number(page) - 1) * limit + index + 1}
            />
          ))
        )}
        <PaginationControl currentUrl="/song?" totalPage={totalPage} />
      </div>
    </div>
  );
};
