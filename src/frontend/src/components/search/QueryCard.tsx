"use client";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

type QueryType = "image" | "audio";

interface QueryCardProps {
  types: QueryType;
  children?: React.ReactNode;
  className?: string;
}

export const QueryCard = ({ types, children, className }: QueryCardProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); 
  const [query, setQuery] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
    // Generate preview URL for the uploaded image
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(uploadedFile);
        setPreview(url);
    } 
    else if (uploadedFile && uploadedFile.type.startsWith("audio/")) {
        setPreview(uploadedFile.name)
    }
    else {
        setPreview(null);
    }
  };

  const fileInputRef = useRef<null | HTMLInputElement>(null);

  const handleElementClick = () => {
    fileInputRef.current?.click();
  }

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
      const endPoint = "http://localhost:8000/uploadquery/";
      const response = await fetch(endPoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully");
        const responseData = await response.json();
        setQuery(responseData.file_name);
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
      <h1 className="text-2xl font-bold mb-2">Upload {types} file</h1>
      <Label htmlFor="file_upload">
        Upload an {types} file
      </Label>
      <div 
        className={`${className} size-64 hover:cursor-pointer rounded-xl shadow-lg shadow-gray-300`}
        onClick={handleElementClick}>
        {preview ? 
            types == "image" ? 
                <Image src={preview} alt="Preview" width={200} height={200} className="rounded-xl" /> 
                :
                <p className="break-all p-4 text-center text-lg font-semibold text-cyan-800">{preview}</p>
            :
            children
        }
      </div>
      <Input
        type="file"
        onChange={handleInputChange}
        accept={`${types === "image" ? ".png, .jpg, .jpeg" : ".mid"}`}
        className="hidden"
        ref={fileInputRef}
      />
      <Button type="submit" disabled={!file || isLoading} className="w-full">
        Submit
      </Button>
    </form>
  );
};
