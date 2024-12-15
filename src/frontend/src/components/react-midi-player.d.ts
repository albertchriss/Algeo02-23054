declare module 'react-midi-player' {
    interface MidiPlayerProps {
      src: string;
      autoplay?: boolean;
      loop?: boolean;
      onStart?: () => void;
      onStop?: () => void;
      onPause?: () => void;
      onEnd?: () => void;
    }
  
    const MidiPlayer: React.FC<MidiPlayerProps>;
    export default MidiPlayer;
  }
  
