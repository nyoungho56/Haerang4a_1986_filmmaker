import React from 'react';

interface ZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  imageSrc2?: string | null;
}

const ZoomModal: React.FC<ZoomModalProps> = ({ isOpen, onClose, imageSrc, imageSrc2 }) => {
  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-stone-300 p-6 border-8 border-stone-800 shadow-2xl max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 0 0 10px #292524, 0 0 50px rgba(0,0,0,0.7)' }}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-700 text-white rounded-full w-10 h-10 text-2xl border-2 border-white flex items-center justify-center hover:bg-red-600 z-10"
          aria-label="Close zoomed view"
        >
          &times;
        </button>
        <div className="relative aspect-[3/2] bg-stone-400 w-full">
            {imageSrc2 ? (
                <div className="w-full h-full flex gap-1 p-1">
                    <img src={imageSrc} alt="Zoomed view 1" className="flex-1 h-full object-cover bg-stone-400 min-w-0" />
                    <div className="w-px self-stretch bg-stone-500"></div>
                    <img src={imageSrc2} alt="Zoomed view 2" className="flex-1 h-full object-cover bg-stone-400 min-w-0" />
                </div>
            ) : (
                <img src={imageSrc} alt="Zoomed view" className="w-full h-full object-cover" />
            )}
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-6 bg-stone-800 transform rotate-[-4deg]"></div>
      </div>
    </div>
  );
};

export default ZoomModal;