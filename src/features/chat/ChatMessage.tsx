import type { ChatMessage as ChatMessageType } from '../../types/chat.types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser      = message.sender === 'user';
  const isSystem    = !isUser && message.sender === 'assistant' && message.responseMode === 'system-error';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center mr-3 mt-1">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {/* Bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
            ${isUser
              ? 'bg-brand-600 text-white rounded-br-sm'
              : isSystem
                ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm'
                : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-sm'
            }
          `}
        >
          {message.text}
        </div>

        {/* Metadata below bubble */}
        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-[11px] text-gray-400">
            {message.timestamp.toLocaleTimeString('en-US', {
              hour:   '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
          {!isUser && message.responseMode && message.responseMode !== 'system-error' && (
            <span className="text-[11px] text-gray-400 italic">
              {message.responseMode.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
