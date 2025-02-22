import { AlbumView } from "@/components/album/AlbumView";
import Image from "next/image";
import React from "react";

const Album = async ({ params }: { params: Promise<{ name: string }> }) => {
  const name = (await params).name;
  const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/dataset/${name}`;
  return (
    <div className="w-full flex-col items-center">
      <div className="w-full flex flex-col items-center relative space-y-4">
        <div className="w-full flex items-center sticky top-0 py-10 h-[300px] overflow-hidden z-[100]">
          <Image
            src={imageUrl}
            alt={name}
            width={1000}
            height={1000}
            className="blur-lg absolute w-full aspect-square z-[-100] rounded-2xl object-cover saturate-50"
          />
          <div className="w-full h-full bg-black/20 absolute"></div>
          <Image
            src={imageUrl}
            alt={name}
            width={1000}
            height={1000}
            className="size-[200px] rounded-2xl object-cover ml-[100px] z-10"
          />
          <div className=" ml-[4%] max-w-[50%] z-10">
            <h1 className="text-4xl font-bold text-white break-all">
              {name.substring(0, name.lastIndexOf("."))}
            </h1>
          </div>
        </div>
        <div className="w-[90%] mx-auto">
          <AlbumView name={name} />
        </div>
      </div>
    </div>
  );
};

export default Album;
