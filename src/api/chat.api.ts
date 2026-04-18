import { apiFetch } from './client';
import type { SendMessageResponse, CreateSessionResponse, TicketDetail } from '../types/chat.types';

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
    message_id:    string;
    sender_type:   'user' | 'assistant' | 'system';
    message_text:  string;
    response_mode: string | null;
    case_id:       string | null;
    ticket_id:     string | null;
    created_at:    string;
  }>;
}> {
  return apiFetch('/api/chat/messages');
}

export async function getTicketsByCaseIds(
  caseIds: string[]
): Promise<TicketDetail[]> {
  if (caseIds.length === 0) return [];
  const query = caseIds.join(',');
  const data  = await apiFetch<{ tickets?: TicketDetail[] }>(
    `/api/chat/tickets?caseIds=${encodeURIComponent(query)}`
  );
  return data.tickets ?? [];
}
