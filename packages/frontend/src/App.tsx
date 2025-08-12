import { useEffect, useState, useRef } from 'react';
import type { ChatMessage } from '@chat-platform/shared';
import { getHealth, sendChatMessage } from './services/api';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';

function App() {
  const [apiStatus, setApiStatus] = useState<string>('Loading...');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    getHealth()
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus('Backend not reachable'));
  }, []);

  const handleSendMessage = async (message: string) => {
    // Add user message immediately
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    
    setChat((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Add "sending..." message
    const sendingMsg: ChatMessage = {
      id: 'sending',
      role: 'assistant',
      content: 'Sending...',
      timestamp: new Date().toISOString(),
    };
    setChat((prev) => [...prev, sendingMsg]);

    try {
      const history = chat.map((msg) => msg.content);
      console.log('Sending to backend:', { message, history });
      
      const data = await sendChatMessage(message, history);
      console.log('Received from backend:', data);
      
      // Remove "sending..." and add real response
      setChat((prev) => {
        const withoutSending = prev.filter(msg => msg.id !== 'sending');
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
        };
        return [...withoutSending, aiMsg];
      });
      
    } catch (error) {
      console.error('Error:', error);
      
      // Remove "sending..." and add error message
      setChat((prev) => {
        const withoutSending = prev.filter(msg => msg.id !== 'sending');
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        };
        return [...withoutSending, errorMsg];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-100 via-blue-50 to-green-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 shadow text-white">
        <img
          src="https://ui-avatars.com/api/?name=Chat+Bot&background=22c55e&color=fff"
          alt="Avatar"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <div>
          <div className="font-bold text-lg">AI Chat Bot</div>
          <div className="text-xs text-green-100">
            {apiStatus === 'Backend is running!' ? 'online' : 'offline'}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {chat.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Start a conversation with your AI assistant!</p>
          </div>
        ) : (
          chat.map((message) => (
            <div key={message.id}>
              <ChatBubble 
                message={message.content} 
                isUser={message.role === 'user'} 
              />
              {message.id === 'sending' && (
                <div className="flex justify-start mb-2">
                  <div className="flex space-x-1 px-3 py-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}

export default App;