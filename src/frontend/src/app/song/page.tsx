import { SearchBar } from "@/components/search/SearchBar";
import { SongList } from "@/components/song/SongList";
import React, { Suspense } from "react";

const AlbumPage = () => {
  return (
    <div className="p-10 px-20 flex flex-col space-y-8">
      <SearchBar currentUrl="/song" />
      <h1 className="text-5xl font-bold">Songs</h1>
      <Suspense fallback={<div className="w-full h-auto aspect-video flex justify-center items-center text-gray-500 italic">Loading...</div>}>
        <SongList />
      </Suspense>
    </div>
  );
};

export default AlbumPage;
