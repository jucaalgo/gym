import { GoogleGenerativeAI } from "@google/generative-ai";

const getDynamicKey = () => {
    return localStorage.getItem('CUSTOM_GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;
};

let chatSession = null;

// Initialize or Retrieve Session
const getChatSession = async (userContext) => {
    if (chatSession) return chatSession;

    const API_KEY = getDynamicKey();
    if (!API_KEY) throw new Error("API Key Missing");

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // System Prompt Injection (Spanish)
    const systemPrompt = `
    Eres 'JCA AI', el Asistente AI avanzado de la aplicación JCA GYM.
    
    CONTEXTO DEL USUARIO:
    - Nombre: ${userContext?.name || 'Agente'}
    - Rol: ${userContext?.role || 'Usuario'}
    - Nivel: ${userContext?.level || 1}
    - Arquetipo: ${userContext?.archetype || 'Desconocido'}
    
    MISIÓN:
    1. Ayudar al usuario a planificar entrenamientos y rutinas.
    2. Responder preguntas sobre biomecánica (tienes conocimiento profundo de anatomía).
    3. Aconsejar sobre nutrición basándote en sus objetivos.
    4. Hablar con un tono profesional, ligeramente 'cyberpunk/militar' adecuado para un sistema operativo de entrenamiento de élite.
    5. Ser conciso y accionable.
    
    FORMATO:
    - Usa Markdown para resaltar términos clave.
    - Usa listas para pasos.
    - Mantén las respuestas bajo 150 palabras a menos que se pida un plan detallado.
    `;

    chatSession = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Inicialización del Sistema. Reconocer protocolo." }],
            },
            {
                role: "model",
                parts: [{ text: `Sistema en Línea. Saludos, ${userContext?.name || 'Agente'}. Soy JCA AI. Listo para optimizar tu rendimiento.` }],
            },
        ],
        generationConfig: {
            maxOutputTokens: 500,
        },
        systemInstruction: {
            role: "system",
            parts: [{ text: systemPrompt }]
        }
    });

    return chatSession;
};

export const sendMessageToAI = async (message, userContext) => {
    try {
        const session = await getChatSession(userContext);
        const result = await session.sendMessage(message);
        return {
            success: true,
            text: result.response.text()
        };
    } catch (error) {
        console.error("AI Chat Error:", error);
        return {
            success: false,
            error: "Connection Interrupted. Retry."
        };
    }
};

export const resetChatSession = () => {
    chatSession = null;
};
