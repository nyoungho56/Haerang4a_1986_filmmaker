import React from 'react';

interface UploaderProps {
  onSelect1Click: () => void;
  onSelect2Click: () => void;
  onTransform: () => void;
  isImage1Selected: boolean;
  isProcessing: boolean;
}

const Uploader: React.FC<UploaderProps> = ({ onSelect1Click, onSelect2Click, onTransform, isImage1Selected, isProcessing }) => {

  const buttonClasses = "w-full text-2xl px-6 py-3 border-4 tracking-wider transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryButtonClasses = `${buttonClasses} bg-amber-500 border-amber-700 text-stone-900 hover:bg-amber-400 hover:border-amber-600 disabled:bg-amber-500 disabled:border-amber-700`;
  const secondaryButtonClasses = `${buttonClasses} bg-green-500 border-green-700 text-stone-900 hover:bg-green-400 hover:border-green-600 disabled:bg-stone-500 disabled:border-stone-700`;

  return (
    <div className="w-full bg-stone-800 p-6 border-4 border-stone-900 shadow-lg flex flex-col space-y-4">
      <button
        onClick={onSelect1Click}
        disabled={isProcessing}
        className={primaryButtonClasses}
      >
        [ 1 ] SELECT IMAGE 1
      </button>

      <button
        onClick={onSelect2Click}
        disabled={isProcessing}
        className={primaryButtonClasses}
      >
        [ 2 ] ADD IMAGE & PROMPT
      </button>

      <div className="text-center text-amber-300">
        <p className="text-4xl animate-pulse">▼</p>
      </div>

      <button
        onClick={onTransform}
        disabled={!isImage1Selected || isProcessing}
        className={secondaryButtonClasses}
      >
        [ 3 ] TRANSFORM
      </button>
      
      {isProcessing ? (
          <p className="text-amber-300 text-center text-lg animate-pulse">PROCESSING REQUEST...</p>
      ) : (
          <p className="text-amber-400 text-center text-sm h-5">
            {isImage1Selected ? 'Ready to transform.' : 'Select image 1 to start.'}
          </p>
      )}
    </div>
  );
};

export default Uploader;