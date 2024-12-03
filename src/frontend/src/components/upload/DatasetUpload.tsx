"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";

type DatasetType = "image" | "audio" | "mapper";

interface DatasetUploadProps {
  types: DatasetType;
}

export const DatasetUpload = ({ types }: DatasetUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append("file_upload", file);
      if (types === "image") {
        formData.append("is_image", "true");
      } else if (types === "audio") {
        formData.append("is_image", "false");
      }
    }

    try {
      setIsLoading(true);
      let endPoint;
      if (types === "mapper") {
        endPoint = "http://localhost:8000/uploadmapper/";
      } else {
        endPoint = "http://localhost:8000/uploaddataset/";
      }
      const response = await fetch(endPoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully");
        toast({
          title: "File uploaded successfully",
          variant: "default",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to upload file.",
          description: errorData.detail,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to upload file.",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-3 mb-10" onSubmit={handleSubmit}>
      <h1 className="text-xl font-bold mb-2">Upload {types} file</h1>
      <Label htmlFor="file_upload">
        Upload a {types === "mapper" ? "txt" : "zip"} file
      </Label>
      <Input type="file" onChange={handleInputChange} accept={`${types==="mapper" ? ".txt" : ".zip"}`} />
      <Button type="submit" disabled={!file || isLoading}>
        Submit
      </Button>
    </form>
  );
};
