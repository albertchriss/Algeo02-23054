"use client";
import { useEffect, useState } from "react";
import { AlbumCard } from "../AlbumCard";
import { useToast } from "@/hooks/use-toast";

export const PopularAlbum = () => {
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImageNames, setUploadedImageNames] = useState([]);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const endPoint = "http://localhost:8000/dataset/?is_image=true";
        const response = await fetch(endPoint, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setUploadedImages(data.images || []);
          setUploadedImageNames(data.image_names || []);
        } else {
          toast({
            title: "Failed to fetch images",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Failed to fetch images",
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    };
    fetchImages();
  }, []);
  return (
    <div className="w-full overflow-hidden space-y-4 py-2">
      <h1 className="font-bold text-3xl text-biru-teks">Some Albums</h1>
      <div className="flex gap-10 ">
        {uploadedImages.map((album, index) => (
          <AlbumCard
            key={index}
            imgSrc={album}
            title={uploadedImageNames[index]}
          />
        ))}
      </div>
    </div>
  );
};
