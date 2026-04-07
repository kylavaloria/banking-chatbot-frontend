import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from '../../api/chat.api';
import type { ChatMessage } from '../../types/chat.types';

export function useChatSession() {
  const [messages,  setMessages]  = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const send = useCallback(async (text: string) => {
    if (isLoading) return;

    const userMsg: ChatMessage = {
      id:           uuidv4(),
      sender:       'user',
      text,
      responseMode: null,
      timestamp:    new Date(),
    };

    // Optimistic: add user message immediately
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendMessage(text);

      const assistantMsg: ChatMessage = {
        id:           uuidv4(),
        sender:       'assistant',
        text:         response.reply,
        responseMode: response.responseMode ?? null,
        timestamp:    new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      // Remove optimistic user message on failure, add error message
      setMessages(prev => {
        const withoutOptimistic = prev.filter(m => m.id !== userMsg.id);
        const errorMsg: ChatMessage = {
          id:           uuidv4(),
          sender:       'assistant',
          text:         'Something went wrong. Please try again.',
          responseMode: 'system-error',
          timestamp:    new Date(),
        };
        return [...withoutOptimistic, errorMsg];
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return { messages, isLoading, send, addMessage };
}
