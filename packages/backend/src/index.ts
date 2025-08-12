import express from 'express';
import cors from 'cors';
import { getAIResponse } from './aiService';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  try {
    const aiResponse = await getAIResponse(message, history);
    res.json({
      response: aiResponse,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ response: 'AI service error', success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});