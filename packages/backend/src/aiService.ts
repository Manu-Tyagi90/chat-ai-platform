import axios from "axios";

/**
 * Calls your deployed AI API with the given prompt.
 * 
 * @param prompt - Text prompt to send to the AI service
 * @returns Response data from AI API
 */
export default async function aiService(prompt: string) {
  if (!process.env.AI_API_URL) {
    throw new Error("AI_API_URL environment variable is not set");
  }

  try {
    const response = await axios.post(process.env.AI_API_URL, { prompt }, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    return response.data;

  } catch (error) {
    console.error("Error calling AI API:", error);
    throw new Error("Failed to get a response from AI API");
  }
}