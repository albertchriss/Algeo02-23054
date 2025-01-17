"use client";
import dynamic from "next/dynamic";
const MidiPlayer = dynamic(() => import("react-midi-player"), { ssr: false });

interface MidiPlayerComponentProps {
  midiUrl: string;
}

export const MidiPlayerComponent = ({ midiUrl }: MidiPlayerComponentProps) => {
  return (
    <div className="midi-player-wrapper bg-cyan-tua/20 rounded-md p-1">
      <MidiPlayer
        src={midiUrl} // Path ke file MIDI
        autoplay={false} // Atur autoplay
        loop={false} // Atur apakah loop diaktifkan
      />
    </div>
  );
};
