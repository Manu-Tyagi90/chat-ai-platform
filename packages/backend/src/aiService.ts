import axios from 'axios';

export async function getAIResponse(message: string, history: string[] = []) {
  const res = await axios.post('http://localhost:8000/chat', {
    message,
    history,
  });
  return res.data.response;
}