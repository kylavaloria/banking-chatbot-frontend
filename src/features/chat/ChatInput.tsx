import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/ui/Button';

interface ChatInputProps {
  onSend:    (text: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [text,    setText]    = useState('');
  const textareaRef           = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            id="chat-input-textarea"
            rows={1}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
            className="
              w-full px-4 py-3 pr-4 rounded-xl border border-gray-300
              text-sm text-gray-800 placeholder:text-gray-400
              resize-none overflow-y-auto
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              disabled:bg-gray-50 disabled:cursor-not-allowed
              transition-colors duration-150
              leading-relaxed
            "
            style={{ maxHeight: '160px' }}
          />
        </div>
        <Button
          id="chat-send-btn"
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          isLoading={isLoading}
          size="md"
          className="flex-shrink-0 h-[46px] px-5"
        >
          {!isLoading && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
          Send
        </Button>
      </div>
      <p className="text-center text-[11px] text-gray-400 mt-2">
        Press <kbd className="font-mono bg-gray-100 px-1 rounded">Enter</kbd> to send ·{' '}
        <kbd className="font-mono bg-gray-100 px-1 rounded">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
