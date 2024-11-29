"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setContent(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append("file_upload", file);
    }

    try {
      const endPoint = "http://localhost:8000/uploadfile/";
      const response = await fetch(endPoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("File uploaded successfully");
        setContent(data.content);
      } else {
        console.error("Failed to upload file.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-screen p-10 flex flex-col items-center gap-10 justify-center">
      <form className="space-y-3 " onSubmit={handleSubmit}>
        <Label htmlFor="file_upload">Upload a .txt file</Label>
        <Input type="file" onChange={handleInputChange} accept=".txt" />
        <Button type="submit" disabled={!file}>
          Submit
        </Button>
      </form>
      <div className="flex flex-col items-center space-y-2 w-[30%]">
        <h1 className="font-semibold">
          This is the content of the file you uploaded.
        </h1>
        <div className="h-fit max-h-36 rounded-lg border bg-gray-200 py-2 px-4 w-full overflow-auto">
          {content ? <p>{content}</p> : <p className="text-gray-500 italic">No content yet</p>}
        </div>
      </div>
    </div>
  );
}
