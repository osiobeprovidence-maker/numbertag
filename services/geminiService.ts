
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNumberTag = async (description: string, goal: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a 'Number Tag' profile based on this user description: "${description}" and goal: "${goal}". 
      
      A Number Tag is a concise representation of intent.
      
      CRITICAL INSTRUCTION FOR PRIVACY:
      If the goal or description contains sensitive, discreet, or private personal intents (e.g., dating, hookups, job hunting while employed, or highly specific niche interests), generate a "Public Mask". 
      A Public Mask is a neutral, professional-sounding alternative that allows the user to remain discreet in a public directory (e.g., 'Social Connection', 'Strategic Networking', 'Consulting Discovery').
      
      Return the result as a structured JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The 'True Title' (e.g. 'Discreet Networking', 'SaaS Growth')" },
            intent: { type: Type.STRING, description: "The 'True Intent' - what they actually want." },
            publicTitleMask: { type: Type.STRING, description: "A neutral, professional-sounding mask for the title." },
            publicIntentMask: { type: Type.STRING, description: "A neutral, professional-sounding mask for the intent statement." },
            category: { type: Type.STRING, description: "One of: Hiring, Collaboration, Investment, Mentorship, Sales, Social" },
            suggestedColor: { type: Type.STRING, description: "A Tailwind color class (e.g. 'indigo-600', 'emerald-500', 'rose-500')" },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-4 keywords including true intent keywords for matching"
            }
          },
          required: ["title", "intent", "publicTitleMask", "publicIntentMask", "category", "suggestedColor", "tags"]
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: "New Connect",
      intent: "Open to new professional opportunities and networking.",
      publicTitleMask: "General Networking",
      publicIntentMask: "Open to professional dialogue and connection.",
      category: "Collaboration",
      suggestedColor: "indigo-600",
      tags: ["Networking", "Innovation"]
    };
  }
};

export const globalSignalScout = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for professional signals, industry leads, or active networking nodes related to this query: "${query}". 
      Identify specific entities, companies, or professional groups that align with the intent of Number Tag (networking/advertising).
      Provide a concise summary of your findings.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const links = groundingChunks
      .filter(chunk => chunk.web && chunk.web.uri)
      .map(chunk => ({
        uri: chunk.web!.uri,
        title: chunk.web!.title || 'External Signal'
      }));

    return {
      text,
      links: Array.from(new Map(links.map(l => [l.uri, l])).values()) 
    };
  } catch (error) {
    console.error("Scout Error:", error);
    return {
      text: "Unable to reach global search layer at this moment.",
      links: []
    };
  }
};
