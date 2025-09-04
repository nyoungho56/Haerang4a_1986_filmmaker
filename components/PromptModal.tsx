import React, { useState, useEffect } from 'react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setPrompt(''); 
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(prompt);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-stone-900 border-4 border-amber-500 p-6 shadow-lg w-full max-w-lg text-amber-300 flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl mb-4 tracking-wider">// COMPOSITION PROMPT</h2>
        <p className="text-amber-400 mb-4 text-lg">Describe how you want to combine the two images. Ex: "A cat driving a tiny car".</p>
        <div className="relative w-full h-48 bg-black p-2 border-2 border-amber-500/50">
           <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-full bg-transparent text-amber-300 text-xl resize-none focus:outline-none placeholder-amber-500/50"
            placeholder="TYPE HERE..."
            autoFocus
          />
          <div className="absolute bottom-2 right-2 w-3 h-6 bg-amber-300 animate-pulse"></div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button 
            onClick={onClose}
            className="text-2xl px-6 py-2 border-2 border-stone-600 text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
          >
            CANCEL
          </button>
          <button 
            onClick={handleSubmit}
            className="text-2xl px-6 py-2 border-2 border-amber-500 text-stone-900 bg-amber-500 hover:bg-amber-400 transition-colors"
          >
            CONFIRM & SELECT
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;