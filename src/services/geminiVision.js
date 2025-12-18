import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to get key dynamically
const getDynamicKey = () => {
    return localStorage.getItem('CUSTOM_GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;
};

// UPDATED: Now supports both Gym Machine and Food analysis
export const analyzeGymMachine = async (imageFile, mode = 'gym') => {
    const API_KEY = getDynamicKey();

    if (!API_KEY) {
        return {
            success: false,
            error: "API Key Missing. Please add it in Admin Panel or .env"
        };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    try {
        // Convert file to base64
        const base64Data = await fileToGenerativePart(imageFile);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Efficient model for vision

        let prompt = '';

        if (mode === 'food') {
            prompt = `
            Actúa como un nutricionista deportivo de élite. Analiza esta imagen con alta precisión.
            1. Identifica los alimentos visibles. Si es un plato complejo, deconstruye sus ingredientes principales.
            2. Estima las calorías totales y los macronutrientes (Proteína, Carbohidratos, Grasas) basándote en el volumen visual.
            3. Devuelve SOLO un JSON válido con este formato exacta:
             {
               "isFood": true,
               "name": "Nombre del Plato",
               "description": "Breve desglose nutricional (ej. 'Alto en proteínas, carbohidratos complejos').",
               "calories": 500,
               "protein": 30,
               "carbs": 45,
               "fat": 15,
               "confidence": 0.95
             }
            4. Si NO detectas comida claramente:
               Devuelve JSON: { "isFood": false, "message": "No se detectó comida reconocible." }
            
            IMPORTANTE: Responde siempre en JSON puro sin formato markdown.
            `;
        } else {
            // GYM MODE (Default)
            prompt = `
            Actúa como un entrenador experto en biomecánica. Analiza esta imagen de equipamiento de gimnasio.
            1. Identifica qué máquina o equipo es, analizando su estructura, levas, poleas y asientos.
            2. Si es una máquina de gimnasio:
               - Nómbrala con su nombre técnico en Español.
               - Describe brevemente su función principal.
               - Lista 3 ejercicios clave que se pueden realizar en ella.
               - Devuelve SOLO un JSON válido con este formato:
                 {
                   "isMachine": true,
                   "name": "Nombre de la Máquina",
                   "description": "Descripción técnica breve",
                   "primaryMuscle": "Pecho", // Debe ser uno de: Pecho, Espalda, Hombros, Bíceps, Tríceps, Cuádriceps, Isquios, Glúteos, Gemelos, Abdominales
                   "exercises": [
                     { "name": "Ejercicio 1", "difficulty": "Principiante" },
                     { "name": "Ejercicio 2", "difficulty": "Intermedio" },
                     { "name": "Ejercicio 3", "difficulty": "Avanzado" }
                   ]
                 }
            3. Si NO es una máquina de gimnasio:
               Devuelve JSON: { "isMachine": false, "message": "No se reconoció ninguna máquina de gimnasio." }
            
            IMPORTANTE: Analiza con cuidado incluso si la imagen es parcial. Responde en JSON puro sin markdown.
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
