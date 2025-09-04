import React from 'react';

interface ImageDisplayProps {
  title: string;
  imageSrc: string | null;
  imageSrc2?: string | null;
  isLoading?: boolean;
  loadingMessage?: string;
  onZoom: () => void;
  className?: string;
}

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10 p-4">
        <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-amber-300 text-center text-lg">{message}</p>
    </div>
);

const EmptyState: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center bg-stone-700/50">
        <svg className="w-16 h-16 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
    </div>
);

const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageSrc, imageSrc2, isLoading = false, loadingMessage = 'Processing...', onZoom, className }) => {
  const canZoom = imageSrc && !isLoading;
  return (
    <div className={`w-full p-3 bg-stone-300 border-4 border-stone-800 shadow-inner flex flex-col ${className || ''}`}>
      <h2 className="text-2xl text-stone-800 text-center pb-2 border-b-2 border-stone-500 mb-3">{title}</h2>
      <div 
        className={`relative aspect-[3/2] bg-stone-400 flex-grow ${canZoom ? 'cursor-pointer' : ''}`}
        onClick={canZoom ? onZoom : undefined}
      >
        {isLoading && <LoadingOverlay message={loadingMessage} />}
        {imageSrc ? (
            imageSrc2 ? (
                <div className="w-full h-full flex gap-1 p-1">
                    <img src={imageSrc} alt={`${title} 1`} className="flex-1 h-full object-cover bg-stone-400 min-w-0" />
                    <div className="w-px self-stretch bg-stone-500"></div>
                    <img src={imageSrc2} alt={`${title} 2`} className="flex-1 h-full object-cover bg-stone-400 min-w-0" />
                </div>
            ) : (
                <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
            )
        ) : (
            !isLoading && <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;