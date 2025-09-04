import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import ImageDisplay from './components/ImageDisplay';
import Uploader from './components/Uploader';
import PromptModal from './components/PromptModal';
import ZoomModal from './components/ZoomModal';
import { transformImageTo1980s } from './services/geminiService';
import type { TransformedImageResponse } from './types';

const App: React.FC = () => {
  const [originalImage1, setOriginalImage1] = useState<string | null>(null);
  const [originalMimeType1, setOriginalMimeType1] = useState<string | null>(null);
  const [originalImage2, setOriginalImage2] = useState<string | null>(null);
  const [originalMimeType2, setOriginalMimeType2] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing...');
  
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [zoomedImageSrc, setZoomedImageSrc] = useState<string | null>(null);
  const [zoomedImageSrc2, setZoomedImageSrc2] = useState<string | null>(null);
  
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const loadingMessages = [
    'Accessing flux capacitor...',
    'Calibrating time circuits...',
    'Traveling to 1986...',
    'Composing multiple timelines...',
    'Developing film in dark room...',
    'Applying retro filter...',
    'Engaging Nano-Banana AI...',
  ];

  useEffect(() => {
    audioRef.current = document.getElementById('background-music') as HTMLAudioElement;
    if (audioRef.current) {
        audioRef.current.volume = 0.3;
    }

    const playAudioOnFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(err => {
          console.warn("Audio play failed, requires user interaction.", err);
        });
      }
      // Once it's tried to play, we can remove the listener
      document.body.removeEventListener('click', playAudioOnFirstInteraction);
      document.body.removeEventListener('keydown', playAudioOnFirstInteraction);
    };
  
    document.body.addEventListener('click', playAudioOnFirstInteraction);
    document.body.addEventListener('keydown', playAudioOnFirstInteraction);
  
    return () => {
      document.body.removeEventListener('click', playAudioOnFirstInteraction);
      document.body.removeEventListener('keydown', playAudioOnFirstInteraction);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingMessage(loadingMessages[0]);
      let i = 1;
      interval = setInterval(() => {
        setLoadingMessage(loadingMessages[i % loadingMessages.length]);
        i++;
      }, 2500);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleToggleMute = () => {
      if (!audioRef.current) return;
      const newMutedState = !audioRef.current.muted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
  };
  
  const fileReaderHandler = useCallback((file: File, setImage: React.Dispatch<React.SetStateAction<string | null>>, setMime: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError("Invalid file type. Please select a JPG, PNG, or WEBP image.");
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImage(result);
      setMime(file.type);
    };
    reader.onerror = () => {
        setError("Failed to read the image file.");
    }
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setError(null);
      setTransformedImage(null);
      fileReaderHandler(event.target.files[0], setOriginalImage1, setOriginalMimeType1);
    }
  };

  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setError(null);
      setTransformedImage(null);
      fileReaderHandler(event.target.files[0], setOriginalImage2, setOriginalMimeType2);
    }
  };

  const handleSelect1Click = () => {
    fileInputRef1.current?.click();
  };

  const handleSelect2Click = () => {
    setIsPromptModalOpen(true);
  };
  
  const handlePromptSubmit = (prompt: string) => {
    setCustomPrompt(prompt);
    setIsPromptModalOpen(false);
    setTimeout(() => fileInputRef2.current?.click(), 100);
  };

  const handleZoom = (image1: string | null, image2: string | null) => {
    setZoomedImageSrc(image1);
    setZoomedImageSrc2(image2);
    setIsZoomModalOpen(true);
  };

  const handleTransform = async () => {
    if (!originalImage1 || !originalMimeType1) {
      setError("Please select image 1 to begin.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransformedImage(null);

    try {
        const base64Data1 = originalImage1.split(',')[1];
        const base64Data2 = originalImage2 ? originalImage2.split(',')[1] : null;

        const result: TransformedImageResponse = await transformImageTo1980s(base64Data1, originalMimeType1, base64Data2, originalMimeType2, customPrompt);

        if (result.imageData) {
            // The API now returns a pre-cropped 3:2 image, so we can assume the mime type is consistent
            // or default to a common one like PNG if needed. For now, let's reuse the original.
            const mimeType = originalMimeType1 || 'image/png';
            setTransformedImage(`data:${mimeType};base64,${result.imageData}`);
        } else {
            throw new Error(result.textDescription || "The AI did not return an image.");
        }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-stone-900 flex flex-col items-center bg-stone-800" style={{ fontFamily: "'VT323', monospace" }}>
      <Header isMuted={isMuted} onToggleMute={handleToggleMute} />
      <main className="w-full max-w-7xl flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        <input
            type="file"
            ref={fileInputRef1}
            onChange={handleFileChange1}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
        />
        <input
            type="file"
            ref={fileInputRef2}
            onChange={handleFileChange2}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
        />

        <div className="lg:w-1/3 w-full flex flex-col">
            <Uploader 
                onSelect1Click={handleSelect1Click}
                onSelect2Click={handleSelect2Click}
                onTransform={handleTransform}
                isImage1Selected={!!originalImage1}
                isProcessing={isLoading}
            />
             {error && (
                <div className="mt-4 p-4 bg-red-800 text-yellow-200 border-2 border-red-900 text-center">
                    <p className="font-bold text-lg">SYSTEM ERROR:</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
        <div className="lg:w-2/3 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageDisplay 
                title="[ ORIGINAL(S) ]" 
                imageSrc={originalImage1} 
                imageSrc2={originalImage2}
                onZoom={() => handleZoom(originalImage1, originalImage2)}
            />
            <ImageDisplay 
                title="[ 1986 VERSION ]" 
                imageSrc={transformedImage}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
                onZoom={() => handleZoom(transformedImage, null)}
                className="noise-card"
            />
        </div>
      </main>
      <footer className="w-full bg-stone-800 text-amber-400 p-2 text-center text-sm border-t-2 border-amber-500">
        <p>A Faded Memory Generator // Powered by Google Gemini</p>
      </footer>
      <PromptModal 
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onSubmit={handlePromptSubmit}
      />
      <ZoomModal 
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        imageSrc={zoomedImageSrc}
        imageSrc2={zoomedImageSrc2}
      />
    </div>
  );
};

export default App;