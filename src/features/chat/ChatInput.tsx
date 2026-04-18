import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend:    (text: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
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

  const canSend = !!text.trim() && !isLoading;

  return (
    <div className="bg-[#f7f9fb]/85 backdrop-blur-2xl border-t border-outline-variant/20 p-4 fixed bottom-0 left-0 w-full z-40">
      <div
        className="max-w-5xl mx-auto flex items-end gap-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 px-3 py-2 shadow-[0px_4px_24px_rgba(25,28,30,0.08)] focus-within:border-[#1e3a8a]/50 focus-within:ring-4 focus-within:ring-[#1e3a8a]/10 transition-all duration-200"
      >
        <textarea
          ref={textareaRef}
          id="chat-input-textarea"
          rows={1}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
          className="chat-textarea flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-36 py-2.5 px-2 text-sm text-on-surface placeholder:text-outline/80 leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          id="chat-send-btn"
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="btn-send h-11 px-5 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#2dd4bf] text-white font-semibold text-sm flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all duration-150 shadow-md shadow-[#1e3a8a]/20 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <span>Send</span>
          {isLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
          ) : (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '1rem' }}
            >
              send
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
