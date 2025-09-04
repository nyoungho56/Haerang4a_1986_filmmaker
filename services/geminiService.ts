import { GoogleGenAI, Modality } from "@google/genai";
import type { TransformedImageResponse } from '../types';

// FIX: Removed unnecessary 'as string' type assertion for API key to align with coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getFormattedDate = (): string => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `'86 ${month} ${day}`;
};

export const transformImageTo1980s = async (
  base64ImageData1: string,
  mimeType1: string,
  base64ImageData2: string | null,
  mimeType2: string | null,
  customPrompt: string
): Promise<TransformedImageResponse> => {
  try {
    const dateStamp = getFormattedDate();
    
    const retroFilterInstructions = `The image should have a strong retro aesthetic, with heavy film grain, light leaks, and slightly faded, warm, sepia-like colors. Introduce slight chromatic aberration at the edges where color channels are slightly misaligned. In the bottom right corner, add a classic orange digital date stamp showing this date: ${dateStamp}.`;
    
    let finalPrompt: string;

    if (base64ImageData2) {
      const compositionInstruction = customPrompt.trim()
        ? `First, take these two images and compose them into a single scene based on this description: "${customPrompt}".`
        : `First, creatively blend these two images into a single, cohesive scene.`;
      
      finalPrompt = `${compositionInstruction} Second, crop the resulting composite image to a strict 3:2 aspect ratio, focusing on the main subject. Finally, apply this transformation to the cropped 3:2 image: ${retroFilterInstructions}`;
    } else {
      finalPrompt = `First, crop this image to a strict 3:2 aspect ratio, focusing on the main subject. Then, apply this transformation to the cropped 3:2 image: ${retroFilterInstructions}`;
    }

    const imagePart1 = {
        inlineData: {
          data: base64ImageData1,
          mimeType: mimeType1,
        },
    };

    const parts: ({ inlineData: { data: string; mimeType: string; }; } | { text: string; })[] = [imagePart1];

    if (base64ImageData2 && mimeType2) {
      parts.push({
        inlineData: {
          data: base64ImageData2,
          mimeType: mimeType2,
        },
      });
    }
    
    parts.push({ text: finalPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let result: TransformedImageResponse = {
      imageData: null,
      textDescription: null,
    };
    
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            result.imageData = part.inlineData.data;
          } else if (part.text) {
            result.textDescription = part.text;
          }
        }
    }
    
    if (!result.imageData) {
        throw new Error(result.textDescription || "API did not return an image. It might have refused the request for safety reasons.");
    }

    return result;

  } catch (error) {
    console.error("Error transforming image:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Failed to transform image. ${errorMessage}`);
  }
};