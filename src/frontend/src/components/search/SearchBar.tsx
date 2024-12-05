"use client";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { IoSearch } from "react-icons/io5";

interface SearchBarProps {
  currentUrl: string;
}

export const SearchBar = ({ currentUrl }: SearchBarProps) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.trim()) {
        router.push(`${currentUrl}?q=${searchInput}`);
    }
    else{
        router.push(`${currentUrl}`);
    }
  };

  return (
    <form onSubmit={handleOnSubmit} className="flex gap-4">
      <Input
        className="rounded-full bg-white px-5"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search..."
      />
      <Button className="bg-white hover:bg-slate-100 rounded-2xl" type="submit">
        <IoSearch className="text-black" />
      </Button>
    </form>
  );
};
