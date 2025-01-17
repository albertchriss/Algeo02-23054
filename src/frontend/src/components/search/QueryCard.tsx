"use client";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Progress } from "../ui/progress";

type QueryType = "image" | "audio";

interface QueryCardProps {
  types: QueryType;
  children?: React.ReactNode;
  className?: string;
}

export const QueryCard = ({ types, children, className }: QueryCardProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
    // Generate preview URL for the uploaded image
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(uploadedFile);
      setPreview(url);
    } else if (uploadedFile && uploadedFile.type.startsWith("audio/")) {
      setPreview(uploadedFile.name);
    } else {
      setPreview(null);
    }
  };

  const fileInputRef = useRef<null | HTMLInputElement>(null);

  const handleElementClick = () => {
    fileInputRef.current?.click();
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
      setProgress(0); // Initialize progress state

      const endPoint = "http://localhost:8000/uploadquery/";
      const response = await fetch(endPoint, {
        method: "POST",
        body: formData,
      });

      // SSE stream reading starts here
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to read response stream.");
      }

      const decoder = new TextDecoder();
      let done = false;
      let receivedText = "";

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          receivedText += decoder.decode(value, { stream: true });

          // Process each line of the SSE message
          const messages = receivedText.split("\n\n"); // Split by SSE message format
          for (const message of messages) {
            if (message.startsWith("data:")) {
              const data = message.slice(5).trim();

              // Handle error messages
              if (data.startsWith("error:")) {
                const errorMessage = data.slice(6).trim();
                toast({
                  title: "Error during processing",
                  description: errorMessage,
                  variant: "destructive",
                });
                setIsLoading(false);
                return;
              }

              // Update progress
              const progress = parseInt(data, 10);
              if (!isNaN(progress)) {
                setProgress(progress);
              }

              // If progress reaches 100, finish loading
              if (progress === 100) {
                toast({
                  title: "File processed successfully",
                  variant: "default",
                });
                router.push(`/search/result`);
              }
            }
          }

          // Remove processed messages
          receivedText = "";
        }
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
      <Label htmlFor="file_upload">Upload an {types} file</Label>
      <div
        className={`${className} size-64 hover:cursor-pointer rounded-xl shadow-lg shadow-gray-300`}
        onClick={handleElementClick}
      >
        {preview ? (
          types == "image" ? (
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-xl"
            />
          ) : (
            <p className="break-all p-4 text-center text-lg font-semibold text-cyan-800">
              {preview}
            </p>
          )
        ) : (
          children
        )}
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
      {isLoading && <Progress value={progress} />}
    </form>
  );
};
