import { SongCard } from "../SongCard";

interface Song {
    imgSrc: string;
    title: string;
    duration: string;
}

interface SongListProps {
    songs: Song[];
}

export const SongList = ({songs}: SongListProps) => {
    return (
        <div className="w-full space-y-4">
            <h1 className="font-bold text-3xl text-biru-teks">Some Musics</h1>
            <div className="flex flex-col w-full gap-3">
                {
                    songs.map((song, index) => (
                        <SongCard key={index} imgSrc={song.imgSrc} title={song.title} duration={song.duration} number={index + 1} />
                    ))
                }
            </div>
        </div>
    )
}