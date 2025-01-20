"use client";

import { ImageResult } from "./ImageResult";
import { AudioResult } from "./AudioResult";
import { useParameter } from "@/app/search/SearchContext";

export const QueryResult = () => {
  const { parameter } = useParameter();
  if (parameter == "image") {
    return <ImageResult />;
  } else {
    return <AudioResult />;
  }
};
