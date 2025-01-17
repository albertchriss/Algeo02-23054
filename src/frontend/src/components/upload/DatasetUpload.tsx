"use client";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "../ui/progress";

type DatasetType = "image" | "audio" | "mapper";

interface DatasetUploadProps {
  types: DatasetType;
  children?: React.ReactNode;
  className?: string;
}

export const DatasetUpload = ({
  types,
  children,
  className,
}: DatasetUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const fileInputRef = useRef<null | HTMLInputElement>(null);

  const handleElementClick = () => {
    fileInputRef.current?.click();
  };

  const handleOnClick = async () => {
    try {
      setIsLoading(true);
      const endPoint = "http://localhost:8000/mapper/generate/";
      const response = await fetch(endPoint, {
        method: "POST",
      });
      if (response.ok) {
        toast({
          title: "Mapper generated successfully",
          variant: "default",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to generate mapper.",
          description: errorData.detail,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to generate mapper.",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

      if (types === "mapper") {
        if (response.ok) {
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
      } else {
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
                    title: "Dataset uploaded successfully",
                    variant: "default",
                  });
                }
              }
            }
          }
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
      <h1 className="text-2xl font-bold mb-2">Upload {types === "audio" ? "midi" : types} {types === "mapper" ? "file" : "dataset"}</h1>
      <Label htmlFor="file_upload">
        Upload a {types === "mapper" ? "txt" : "zip"} file
      </Label>
      <div
        className={`${className} size-[300px] hover:cursor-pointer rounded-xl shadow-lg shadow-gray-300 `}
        onClick={handleElementClick}
      >
        {file ? (
          <p className="break-all p-4 text-center text-lg font-semibold text-cyan-800">
            {file.name}
          </p>
        ) : (
          children
        )}
      </div>
      <Input
        type="file"
        onChange={handleInputChange}
        accept={`${types === "mapper" ? ".txt" : ".zip"}`}
        className="hidden"
        ref={fileInputRef}
      />
      <Button
        type="submit"
        disabled={!file || isLoading}
        className={`${types === "mapper" ? "" : "w-full"}`}
      >
        Submit
      </Button>
      {types === "mapper" && (
        <Button className="ml-4 px-9" disabled={isLoading} onClick={handleOnClick}>
          Generate mapper
        </Button>
      )}
      {isLoading && <Progress value={progress} />}
    </form>
  );
};
