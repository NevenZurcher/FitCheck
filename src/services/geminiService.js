import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const geminiService = {
    // Analyze clothing item from image
    async analyzeClothing(imageFile) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            // Convert image to base64
            const base64Image = await fileToBase64(imageFile);

            const prompt = `Analyze this clothing item and provide a JSON response with the following information:
      {
        "category": "one of: top, bottom, shoes, outerwear, accessory, dress, suit",
        "colors": ["primary color", "secondary color if any"],
        "season": ["spring", "summer", "fall", "winter"],
        "style": ["casual", "formal", "sporty", "elegant", etc.],
        "description": "brief description of the item"
      }
      
      Only respond with valid JSON, no additional text.`;

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: imageFile.type,
                        data: base64Image
                    }
                }
            ]);

            const response = await result.response;
            const text = response.text();

            // Parse JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw new Error('Failed to parse AI response');
        } catch (error) {
            console.error('Error analyzing clothing:', error);
            throw error;
        }
    },

    // Generate outfit suggestions
    async generateOutfit(wardrobeItems, constraints = {}) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const { weather, occasion, anchorItem, style } = constraints;

            const wardrobeDescription = wardrobeItems.map(item =>
                `${item.category}: ${item.description} (${item.colors.join(', ')})`
            ).join('\n');

            let prompt = `You are a professional fashion stylist. Based on the following wardrobe items, suggest a complete outfit.

Available items:
${wardrobeDescription}

Constraints:`;

            if (weather) {
                prompt += `\n- Weather: ${weather.temp}°F, ${weather.condition}`;
            }
            if (occasion) {
                prompt += `\n- Occasion: ${occasion}`;
            }
            if (anchorItem) {
                prompt += `\n- Must include: ${anchorItem.description}`;
            }
            if (style) {
                prompt += `\n- Style preference: ${style}`;
            }

            prompt += `\n\nProvide a JSON response with:
      {
        "outfit": {
          "top": "item description or null",
          "bottom": "item description or null",
          "shoes": "item description or null",
          "outerwear": "item description or null",
          "accessories": ["item descriptions"]
        },
        "reasoning": "brief explanation of why this outfit works",
        "tips": "styling tips",
        "visualPrompt": "A detailed, photorealistic description of this complete outfit for image generation. Describe a fashion model wearing the exact outfit in a setting appropriate for the occasion. Include specific details about each clothing item, colors, and the overall aesthetic."
      }
      
      Only respond with valid JSON.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw new Error('Failed to parse AI response');
        } catch (error) {
            console.error('Error generating outfit:', error);
            throw error;
        }
    },

    // Generate outfit image using Gemini 2.5 Flash Image
    async generateOutfitImage(visualPrompt) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

            // Create a detailed prompt for image generation
            const imagePrompt = `Professional fashion photography: ${visualPrompt}. Studio lighting, high quality, detailed, 4k resolution, fashion magazine style.`;

            const result = await model.generateContent(imagePrompt);
            const response = await result.response;

            // Check if response contains image data
            if (response.candidates && response.candidates[0]) {
                const candidate = response.candidates[0];

                // Try to extract image from response
                if (candidate.content && candidate.content.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.inlineData && part.inlineData.data) {
                            // Return base64 image data
                            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        }
                    }
                }
            }

            console.warn('No image data found in response');
            return null;
        } catch (error) {
            console.warn('Image generation unavailable:', error.message);
            return null;
        }
    }
};

// Helper function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}
