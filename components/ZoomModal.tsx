import * as React from 'react';

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
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-stone-300 p-6 border-8 border-stone-800 shadow-2xl max-w-4xl w-full my-auto"
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
        <div className="relative bg-stone-400 w-full">
            {imageSrc2 ? (
                <div className="flex flex-row gap-2 items-start">
                    <img src={imageSrc} alt="Zoomed view 1" className="w-1/2 h-auto" />
                    <img src={imageSrc2} alt="Zoomed view 2" className="w-1/2 h-auto" />
                </div>
            ) : (
                <img src={imageSrc} alt="Zoomed view" className="w-full h-auto" />
            )}
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-6 bg-stone-800 transform rotate-[-4deg]"></div>
      </div>
    </div>
  );
};

export default ZoomModal;