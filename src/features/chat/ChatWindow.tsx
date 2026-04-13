import { useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from '../../types/chat.types';
import { ChatMessage } from './ChatMessage';

// In ChatWindow, receive isLoadingHistory as a prop
interface ChatWindowProps {
  messages:         ChatMessageType[];
  isLoading:        boolean;
  isLoadingHistory: boolean;
}

export function ChatWindow({ messages, isLoading, isLoadingHistory }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Loading history state
  if (isLoadingHistory) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading conversation history...</span>
        </div>
      </div>
    );
  }

  // Empty state — only show after history has loaded
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">💬</span>
          </div>
          <div>
            <p className="text-gray-700 font-medium text-lg">How can we help you today?</p>
            <p className="text-gray-400 text-sm mt-1">
              Ask about your account, transactions, cards, or any banking issue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-400 text-sm pl-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-400 rounded-full animate-spin" />
          <span>BFSI Support is typing...</span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
