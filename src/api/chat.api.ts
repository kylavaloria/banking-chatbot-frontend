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
