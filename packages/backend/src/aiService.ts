import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export async function getAIResponse(message: string, history: string[] = []) {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/chat`, {
      message,
      history,
    });
    return res.data.response;
  } catch (error) {
    const err = error as any;
    console.error('AI service error:', err?.response?.data || err?.message || err);
    return "AI service error";
  }
}