import { SearchBar } from "@/components/search/SearchBar";
import { SongList } from "@/components/song/SongList";
import React from "react";

const AlbumPage = () => {
  return (
    <div className="p-10 px-20 flex flex-col space-y-8">
      <SearchBar currentUrl="/song" />
      <h1 className="text-5xl font-bold">Songs</h1>
      <SongList />
    </div>
  );
};

export default AlbumPage;
