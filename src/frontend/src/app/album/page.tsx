import { AlbumList } from "@/components/album/AlbumList";
import { SearchBar } from "@/components/search/SearchBar";
import React from "react";

const AlbumPage = () => {
  return (
    <div className="py-10 px-20 flex flex-col space-y-8">
      <SearchBar currentUrl="/album" />
      <h1 className="text-5xl font-bold">Albums</h1>
      <AlbumList />
    </div>
  );
};

export default AlbumPage;
