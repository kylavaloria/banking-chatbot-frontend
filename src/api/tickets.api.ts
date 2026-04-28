import { apiFetch } from './client';
import type { TicketView, ConversationMessage } from '../types/ticket.types';

export async function getAgentTickets(): Promise<TicketView[]> {
  return apiFetch<TicketView[]>('/api/agent/tickets');
}

export async function getTicketConversation(ticketId: string): Promise<{ messages: ConversationMessage[] }> {
  return apiFetch<{ messages: ConversationMessage[] }>(`/api/agent/tickets/${ticketId}/conversation`);
}
