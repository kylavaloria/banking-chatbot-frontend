import { apiFetch } from './client';
import type { TicketView } from '../types/ticket.types';

export async function getAgentTickets(): Promise<TicketView[]> {
  return apiFetch<TicketView[]>('/api/agent/tickets');
}
