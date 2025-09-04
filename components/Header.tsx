import * as React from 'react';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMuted, onToggleMute }) => {
  return (
    <header className="relative w-full bg-stone-800 text-amber-300 p-4 border-b-4 border-amber-500 shadow-lg">
      <h1 className="text-4xl md:text-5xl text-center tracking-widest">
        1986 // HAERANG4A RETRO-MATIC
      </h1>
      <p className="text-center text-amber-400 text-lg">
        Nano-Banana Powered Time Machine
      </p>
      <button 
        onClick={onToggleMute} 
        className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-amber-500/20 rounded-full hover:bg-amber-500/40 transition-colors"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l4-4m0 4l-4-4" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </header>
  );
};

export default Header;
