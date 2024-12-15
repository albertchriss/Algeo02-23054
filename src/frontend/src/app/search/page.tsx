// import { MidiPlayerComponent } from "@/components/MidiPlayer";
import { QueryCard } from "@/components/search/QueryCard";
import { MdOutlineImageSearch } from "react-icons/md";
import { TbMusicSearch } from "react-icons/tb";

const SearchPage = () => {
  return (
    <div className="w-full p-10 h-screen flex items-center">
      <div className="w-full flex justify-around">
        <QueryCard types="image" className="flex items-center justify-center border-cyan-tua border-[5px]">
          <MdOutlineImageSearch size={100} />
        </QueryCard>
        <QueryCard types="audio" className="flex items-center justify-center border-cyan-tua border-[5px]">
          <TbMusicSearch size={100} />
        </QueryCard>
      </div>
      {/* <MidiPlayerComponent
        midiUrl="http://localhost:8000/uploads/dataset/All_I_Want_for_Christmas_Is_You.mid"
      /> */}
    </div>
  );
};

export default SearchPage;
