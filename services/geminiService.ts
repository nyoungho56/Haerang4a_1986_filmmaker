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
    
    const retroFilterInstructions = `The image must be authentically transformed to look like a photo taken with a typical 1980s point-and-shoot 35mm film camera. The goal is a nostalgic, film-like quality that feels like a real memory. Key characteristics to apply:
1. **Direct On-Camera Flash:** Emulate the harsh, direct look of a built-in camera flash. This should create sharp-edged shadows directly behind subjects, slightly flatten the scene's depth, and make surfaces facing the camera bright.
2. **Imperfect Focus & Motion:** The image should be slightly blurry. This can be achieved through a gentle softness typical of consumer-grade plastic lenses AND a subtle motion blur, as if from a slight handshake during a slow shutter exposure. The focus should not be perfectly crisp.
3. **Film Grain:** Add a prominent, natural-looking film grain, characteristic of high-ASA film like Kodak Gold 400 or Fujicolor Superia 400. The grain should be visible but not overwhelming.
4. **Color Palette:** Introduce subtle, warm color shifts. Colors should have a rich, slightly saturated filmic look, with a gentle lean towards magenta in the shadows and a warm yellow/golden cast in the highlights. Avoid a heavily washed-out or faded appearance.
5. **Dynamic Range:** Emulate the limited dynamic range of film, with slightly crushed blacks (less detail in dark areas) and soft, bloomed highlights that are not sharply clipped.
6. **Lens Artifacts:** Introduce subtle chromatic aberration (slight color fringing on high-contrast edges) and a mild, natural vignetting (darkening of the corners). Occasional, minor light leaks (a soft red or orange flare near the edge of the frame) can be added for authenticity, but they should not dominate the image.
7. **Date Stamp:** In the bottom right corner, add a classic, slightly pixelated orange or yellow digital date stamp showing this date: ${dateStamp}.
The final result should have that special 'kick' of authenticity – make it look like a real, treasured snapshot discovered in a dusty photo album from 1986.`;
    
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