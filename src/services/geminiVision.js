import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you have VITE_GEMINI_API_KEY in your .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

// UPDATED: Now supports both Gym Machine and Food analysis
export const analyzeGymMachine = async (imageFile, mode = 'gym') => {
    if (!genAI) {
        return {
            success: false,
            error: "API Key Missing. Please configure VITE_GEMINI_API_KEY."
        };
    }

    try {
        // Convert file to base64
        const base64Data = await fileToGenerativePart(imageFile);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Efficient model for vision

        let prompt = '';

        if (mode === 'food') {
            prompt = `
            You are an expert nutritionist AI. Analyze this food image.
            1. Identify the food items present.
            2. Estimate the total calories and macros for the visible portion.
            3. Return ONLY valid JSON in this format:
             {
               "isFood": true,
               "name": "Dish Name",
               "description": "Brief nutritional breakdown (e.g. 'Rich in protein, moderate carbs')",
               "calories": 500,
               "protein": 30,
               "carbs": 45,
               "fat": 15,
               "confidence": 0.95
             }
            4. If NO food is detected:
               Return JSON: { "isFood": false, "message": "No recognizable food found." }
            
            Return STRICTLY JSON. No markdown formatting.
            `;
        } else {
            // GYM MODE (Default)
            prompt = `
            You are an elite gym coach AI. Analyze this image.
            1. Identify if this is a gym machine.
            2. If YES:
               - Name the machine.
               - Give a brief 1-sentence description of its function.
               - List 3 specific exercises that can be performed on it.
               - Return ONLY valid JSON in this format:
                 {
                   "isMachine": true,
                   "name": "Machine Name",
                   "description": "Brief description",
                   "exercises": [
                     { "name": "Exercise 1", "difficulty": "Beginner" },
                     { "name": "Exercise 2", "difficulty": "Intermediate" },
                     { "name": "Exercise 3", "difficulty": "Advanced" }
                   ]
                 }
            3. If NO (it's not a gym machine):
               Return JSON: { "isMachine": false, "message": "No recognized gym machine found." }
            
            Return STRICTLY JSON. No markdown formatting.
            `;
        }

        const result = await model.generateContent([prompt, base64Data]);
        const response = await result.response;
        const text = response.text();

        // Clean markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return { success: true, data: JSON.parse(jsonStr) };

    } catch (error) {
        console.error("Gemini Vision Error:", error);
        return { success: false, error: "Failed to analyze image. Try again." };
    }
};

// Helper to encode file
async function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64String,
                    mimeType: file.type
                }
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
