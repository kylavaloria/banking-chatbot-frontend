import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage, getMessageHistory, getTicketsByCaseIds } from '../../api/chat.api';
import type { ChatMessage, TicketDetail } from '../../types/chat.types';

const TICKET_RESPONSE_MODES = new Set([
  'ticket_confirmation',
  'critical_action_confirmation',
  'multi_issue_confirmation',
]);

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

        const historical: ChatMessage[] = data.messages
          .filter(m => m.sender_type !== 'system')
          .map(m => ({
            id:           m.message_id,
            sender:       m.sender_type === 'user' ? 'user' : 'assistant',
            text:         m.message_text,
            responseMode: m.response_mode ?? null,
            timestamp:    new Date(m.created_at),
            caseId:       m.case_id   ?? null,
            ticketId:     m.ticket_id ?? null,
            tickets:      [],
          }));

        const caseIds = historical
          .filter(m =>
            m.sender === 'assistant' &&
            m.responseMode !== null &&
            TICKET_RESPONSE_MODES.has(m.responseMode) &&
            m.caseId !== null
          )
          .map(m => m.caseId as string);

        const uniqueCaseIds = [...new Set(caseIds)];

        if (uniqueCaseIds.length > 0) {
          const tickets = await getTicketsByCaseIds(uniqueCaseIds);

          const ticketsByCaseId = new Map<string, TicketDetail[]>();
          for (const ticket of tickets) {
            const existing = ticketsByCaseId.get(ticket.case_id) ?? [];
            ticketsByCaseId.set(ticket.case_id, [...existing, ticket]);
          }

          for (const msg of historical) {
            if (msg.caseId && ticketsByCaseId.has(msg.caseId)) {
              msg.tickets = ticketsByCaseId.get(msg.caseId)!;
            }
          }
        }

        if (!isMounted.current) return;
        setMessages(historical);
      } catch (err) {
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
