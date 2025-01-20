import { DatasetUpload } from "@/components/upload/DatasetUpload";
import { RiFolderImageLine } from "react-icons/ri";
import { RiFolderMusicLine } from "react-icons/ri";
import { RiFileSettingsLine } from "react-icons/ri";
import { PiFolderLock } from "react-icons/pi";

export default function UploadPage() {
  const isOnProduction = process.env.NODE_ENV === "production";
  return (
    <div className="w-full h-screen flex items-center relative">
      {isOnProduction && (
        <div className="absolute w-full h-full inset-0 z-100 flex items-center justify-center bg-black/10">
          <PiFolderLock size={200} />
          <h1 className="text-5xl font-bold w-[50%] ml-10">
            Clone the repository locally to upload dataset.
          </h1>
        </div>
      )}
      <div className={`flex w-full justify-evenly ${isOnProduction && "blur-md saturate-50"}`}>
        <DatasetUpload
          types="image"
          className="flex items-center justify-center border-cyan-tua border-[5px]"
        >
          <RiFolderImageLine size={100} />
        </DatasetUpload>
        <DatasetUpload
          types="audio"
          className="flex items-center justify-center border-cyan-tua border-[5px]"
        >
          <RiFolderMusicLine size={100} />
        </DatasetUpload>
        <DatasetUpload
          types="mapper"
          className="flex items-center justify-center border-cyan-tua border-[5px]"
        >
          <RiFileSettingsLine size={100} />
        </DatasetUpload>{" "}
      </div>
    </div>
  );
}
