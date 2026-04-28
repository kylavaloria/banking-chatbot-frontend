import { useEffect, useState } from 'react';
import type { ConversationMessage } from '../../types/ticket.types';
import { getTicketConversation } from '../../api/tickets.api';
import { EmotionBadge } from './EmotionBadge';
import { formatDate } from '../../utils/formatters';
import { Spinner } from '../../components/ui/Spinner';

interface TicketConversationProps {
  ticketId: string;
}

// Capitalise first letter of a string (used for sender label).
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function TicketConversation({ ticketId }: TicketConversationProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getTicketConversation(ticketId)
      .then(({ messages: msgs }) => {
        if (!cancelled) setMessages(msgs);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message ?? 'Failed to load conversation.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [ticketId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600 py-4 text-center">{error}</p>
    );
  }

  if (messages.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant/60 py-4 text-center">
        No conversation history available.
      </p>
    );
  }

  // Build a list of render nodes: messages interleaved with emotion-shift indicators.
  // We track the last seen user-message emotion label for comparison.
  let lastUserEmotionLabel: string | null = null;
  const nodes: React.ReactNode[] = [];

  messages.forEach((msg, idx) => {
    const isUser = msg.sender_type === 'user';

    // Emotion shift indicator — only between consecutive user messages
    // where both have a non-null emotion label and they differ.
    if (isUser && msg.emotion_label && lastUserEmotionLabel && msg.emotion_label !== lastUserEmotionLabel) {
      const from = cap(lastUserEmotionLabel);
      const to   = cap(msg.emotion_label);
      nodes.push(
        <div
          key={`shift-${idx}`}
          className="flex items-center justify-center gap-1.5 py-1"
        >
          <span className="text-[0.65rem] italic text-on-surface-variant/50">
            ↑ Emotion shifted: {from} → {to}
          </span>
        </div>
      );
    }

    // Update tracker
    if (isUser && msg.emotion_label) {
      lastUserEmotionLabel = msg.emotion_label;
    }

    nodes.push(
      <div key={msg.message_id} className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Sender + timestamp */}
        <div className={`flex items-center gap-2 text-[0.6rem] text-on-surface-variant/60 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="font-semibold">{isUser ? 'Customer' : 'Assistant'}</span>
          <span>·</span>
          <span>{formatDate(msg.created_at)}</span>
        </div>

        {/* Bubble */}
        <div
          className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? 'bg-[#1e3a8a] text-white rounded-br-sm'
              : 'bg-[#f2f4f6] text-on-surface rounded-bl-sm border border-outline-variant/20'
          }`}
        >
          {msg.message_text}
        </div>

        {/* Emotion badge — user messages only */}
        {isUser && msg.emotion_label && (
          <div className="mt-0.5">
            <EmotionBadge label={msg.emotion_label} intensity={msg.emotion_intensity} />
          </div>
        )}
      </div>
    );

    // Thin divider between messages (not after the last one)
    if (idx < messages.length - 1) {
      nodes.push(
        <hr key={`div-${idx}`} className="border-outline-variant/10 my-1" />
      );
    }
  });

  return (
    <div className="flex flex-col gap-2 py-1">
      {nodes}
    </div>
  );
}
