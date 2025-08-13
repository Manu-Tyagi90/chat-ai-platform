// packages/frontend/src/services/api.ts

// Import types if you have them in shared
// import type { ChatRequest, ChatResponse, HealthCheckResponse } from '@chat-platform/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getHealth(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function sendChatMessage(message: string, history: string[] = []): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history,
    }),
  });

  if (!res.ok) {
    // Try to parse error message from backend
    let errorMsg = 'AI service error';
    try {
      const errorData = await res.json();
      errorMsg = errorData?.error || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }

  return res.json();
}