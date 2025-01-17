"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { ImageResult } from "./ImageResult";
import { AudioResult } from "./AudioResult";

export const QueryResult = () => {
  const [type, setType] = useState("image");
  const { toast } = useToast();
  useEffect(() => {
    const fetchType = async () => {
      try {
        const endPoint = `http://localhost:8000/query/type/`;
        const response = await fetch(endPoint, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setType(data.type);
        } else {
          const errorData = await response.json();
          toast({
            title: "Failed to fetch images",
            description: errorData.detail,
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
    fetchType();
  }, []);

  if (type == "image") {
    return <ImageResult />;
  } else {
    return <AudioResult />;
  }
};
