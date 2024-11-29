import Image from "next/image";

interface MusicCardProps {
    imgSrc: string;
    title: string;
}

export const AlbumCard = ({imgSrc, title}: MusicCardProps) => {
    return (
        <div className="rounded-xl flex flex-col flex-shrink-0 gap-4">
            <Image src={imgSrc} alt={title} width={1000} height={1000} className="rounded-xl shadow-lg size-[200px] object-cover" />
            <h3 className="text-md font-bold">{title}</h3>
        </div>
    )
}