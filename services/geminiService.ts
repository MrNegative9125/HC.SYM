
import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        disease: {
            type: Type.STRING,
            description: "The most likely disease based on the symptoms."
        },
        description: {
            type: Type.STRING,
            description: "A brief, one-paragraph description of the predicted disease."
        },
        precautions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 4 key precautions for the disease."
        },
        medications: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3-4 common over-the-counter or prescribed types of medication."
        },
        diet: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 4-5 dietary recommendations (foods to eat or avoid)."
        },
        workout: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3-4 recommended light exercises or physical activities."
        },
    },
    required: ["disease", "description", "precautions", "medications", "diet", "workout"]
};


export const getDiseasePrediction = async (symptoms: string[]): Promise<PredictionResult> => {
  const systemInstruction = `You are a helpful and empathetic AI medical assistant. Your role is to analyze a list of symptoms and provide potential medical insights.
  - You must provide a single, most likely disease.
  - You must provide a concise description.
  - You must list exactly 4 precautions.
  - You must list 3 to 4 common medications.
  - You must list 4 to 5 diet recommendations.
  - You must list 3 to 4 workout suggestions.
  - IMPORTANT: Your response must be in valid JSON format according to the provided schema. Do not include any markdown formatting like \`\`\`json. Your response must begin with { and end with }.
  - Maintain a professional and informative tone. Do not provide a medical diagnosis, but rather information on the potential condition. Start your description with something like "Based on the symptoms, one possibility could be [Disease Name]."`;

  const prompt = `Based on the following symptoms, please provide a potential diagnosis and related information. Symptoms: ${symptoms.join(', ')}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      }
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as PredictionResult;
    return parsedResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch prediction from Gemini API.");
  }
};
