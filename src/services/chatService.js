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

    // System Prompt Injection
    const systemPrompt = `
    You are 'JCA AI', the advanced AI Assistant of the JCA GYM application.
    
    SYSTEM CONTEXT:
    - User Name: ${userContext?.name || 'Agent'}
    - Role: ${userContext?.role || 'User'}
    - Level: ${userContext?.level || 1}
    - Archetype: ${userContext?.archetype || 'Unknown'}
    
    MISSION:
    1. Help the user plan workouts and routines.
    2. Answer questions about exercise biomechanics (you have deep knowledge of anatomy).
    3. Advise on nutrition based on their goals.
    4. Speak in a professional, slightly 'cyberpunk/military' tone suitable for an elite training OS.
    5. Be concise and actionable.
    
    FORMATTING:
    - Use Markdown for bolding key terms.
    - Use lists for steps.
    - Keep responses under 150 words unless asked for a detailed plan.
    `;

    chatSession = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "System Initialization. Acknowledge protocol." }],
            },
            {
                role: "model",
                parts: [{ text: `System Online. Greetings, ${userContext?.name || 'Agent'}. I am JCA AI. Ready to optimize your performance.` }],
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
