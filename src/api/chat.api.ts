import { apiFetch } from './client';
import type { SendMessageResponse, CreateSessionResponse } from '../types/chat.types';

export async function createSession(): Promise<CreateSessionResponse> {
  return apiFetch<CreateSessionResponse>('/api/chat/session', {
    method: 'POST',
  });
}

export async function sendMessage(
  messageText: string
): Promise<SendMessageResponse> {
  return apiFetch<SendMessageResponse>('/api/chat/message', {
    method: 'POST',
    body: JSON.stringify({ messageText }),
  });
}

export async function getMessageHistory(): Promise<{
  sessionId: string;
  messages: Array<{
    message_id: string;
    sender_type: 'user' | 'assistant' | 'system';
    message_text: string;
    response_mode: string | null;
    created_at: string;
  }>;
}> {
  return apiFetch('/api/chat/messages');
}
