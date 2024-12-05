import { DatasetUpload } from "@/components/upload/DatasetUpload";

export default function UploadPage() {
  return (
    <div className="w-full p-10 flex flex-col">
      <DatasetUpload types="image" />
      <DatasetUpload types="audio" />
      <DatasetUpload types="mapper" />
    </div>
  );
}
