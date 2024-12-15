import { DatasetUpload } from "@/components/upload/DatasetUpload";
import { RiFolderImageLine } from "react-icons/ri";
import { RiFolderMusicLine } from "react-icons/ri";
import { RiFileSettingsLine } from "react-icons/ri";

export default function UploadPage() {
  return (
    <div className="w-full h-screen flex items-center">
      <div className="flex w-full justify-around">
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
