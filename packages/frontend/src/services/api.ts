export async function getHealth() {
  const res = await fetch('http://localhost:3001/api/health');
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function sendChatMessage(message: string, history: string[] = []) {
  const res = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}