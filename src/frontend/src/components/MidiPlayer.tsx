"use client";

import MidiPlayer from "react-midi-player";

interface MidiPlayerComponentProps {
  midiUrl: string;
}

export const MidiPlayerComponent = ({midiUrl}: MidiPlayerComponentProps) => {

  return (
    <div>
      <MidiPlayer
        src={midiUrl} // Path ke file MIDI
        autoplay={false} // Atur autoplay
        loop={false} // Atur apakah loop diaktifkan
      />
    </div>
  );
};