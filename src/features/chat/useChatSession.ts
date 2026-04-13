import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage, getMessageHistory } from '../../api/chat.api';
import type { ChatMessage } from '../../types/chat.types';

export function useChatSession() {
  const [messages, setMessages]     = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId]   = useState<string | null>(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const isMounted                   = useRef(true);

  // ── Load message history on mount ────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true;

    async function loadHistory() {
      try {
        setIsLoadingHistory(true);
        const data = await getMessageHistory();

        if (!isMounted.current) return;

        setSessionId(data.sessionId);

        // Filter out system messages, map to ChatMessage shape
        const historical: ChatMessage[] = data.messages
          .filter(m => m.sender_type !== 'system')
          .map(m => ({
            id:           m.message_id,
            sender:       m.sender_type === 'user' ? 'user' : 'assistant',
            text:         m.message_text,
            responseMode: m.response_mode ?? null,
            timestamp:    new Date(m.created_at),
            tickets:      [],
          }));

        setMessages(historical);
      } catch (err) {
        // History load failure is non-fatal — start with empty chat
        console.warn('[useChatSession] Could not load message history:', err);
      } finally {
        if (isMounted.current) setIsLoadingHistory(false);
      }
    }

    loadHistory();

    return () => { isMounted.current = false; };
  }, []);

  // ── Send a new message ────────────────────────────────────────────────────
  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id:           uuidv4(),
      sender:       'user',
      text:         text.trim(),
      responseMode: null,
      timestamp:    new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(text.trim());

      if (!isMounted.current) return;

      if (response.sessionId && !sessionId) {
        setSessionId(response.sessionId);
      }

      const assistantMsg: ChatMessage = {
        id:           response.messageId ?? uuidv4(),
        sender:       'assistant',
        text:         response.reply,
        responseMode: response.responseMode ?? null,
        timestamp:    new Date(),
        tickets:      response.tickets ?? [],
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      void err;
      if (!isMounted.current) return;
      // Remove the optimistic user message on failure
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
      setError('Something went wrong. Please try again.');
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [isLoading, sessionId]);

  return { messages, sessionId, isLoading, isLoadingHistory, error, send };
}
