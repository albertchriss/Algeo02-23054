import { AlbumList } from "@/components/album/AlbumList";
import { SearchBar } from "@/components/search/SearchBar";
import React, { Suspense } from "react";

const AlbumPage = () => {
  return (
    <div className="py-10 px-20 flex flex-col space-y-8">
      <SearchBar currentUrl="/album" />
      <h1 className="text-5xl font-bold">Albums</h1>
      <Suspense fallback={<div className="w-full h-auto aspect-video flex justify-center items-center text-gray-500 italic">Loading...</div>}>
        <AlbumList />
      </Suspense>
    </div>
  );
};

export default AlbumPage;
