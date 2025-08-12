interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
}

export default function ChatBubble({ message, isUser = false }: ChatBubbleProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`relative px-4 py-2 max-w-[75%] rounded-2xl shadow
          ${isUser
            ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-br-sm"
            : "bg-white text-gray-900 rounded-bl-sm border"
          }
        `}
      >
        {message}
        {/* Bubble tail */}
        <span
          className={`absolute bottom-0 ${
            isUser
              ? "right-0 translate-x-1/2"
              : "left-0 -translate-x-1/2"
          } w-3 h-3 bg-inherit rounded-full z-0`}
        />
      </div>
    </div>
  );
}