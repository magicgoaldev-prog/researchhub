
import { GoogleGenAI, Type } from "@google/genai";
import { User, Study } from "../types";
import { Language } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getStudyRecommendations = async (user: User, studies: Study[], lang: Language): Promise<string[]> => {
  if (!process.env.API_KEY) return [];

  const studySummaries = studies.map(s => `${s.id}: ${s.title} - ${s.description}`).join('\n');
  const userProfile = `Name: ${user.name}, Major: ${user.metadata?.major}, Age: ${user.metadata?.age}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following studies and the user profile, suggest the top 3 study IDs that would be most relevant or interesting for the participant. Return ONLY a JSON array of study IDs.
      The analysis should be done for a user preferred language: ${lang}.
      
      USER PROFILE:
      ${userProfile}
      
      STUDIES:
      ${studySummaries}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini recommendation error:", error);
    return [];
  }
};

export const getStudySummary = async (study: Study, lang: Language): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this research study in one simple, engaging sentence for a potential participant in language: ${lang}.
      Title: ${study.title}
      Description: ${study.description}`,
    });
    return response.text || "No summary available.";
  } catch (error) {
    return "Study overview unavailable.";
  }
};
