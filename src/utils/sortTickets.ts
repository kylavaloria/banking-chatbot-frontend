import type { TicketView } from '../types/ticket.types';

const PRIORITY_RANK: Record<TicketView['ticket_priority'], number> = {
  P1: 0,
  P2: 1,
  P3: 2,
};

const MODE_RANK: Record<TicketView['ticket_mode'], number> = {
  live_escalation: 0,
  urgent_ticket:   1,
  standard_ticket: 2,
};

/**
 * Sorts tickets for the agent queue:
 * 1. Priority ascending (P1 first)
 * 2. Within same priority: mode rank (live_escalation first)
 * 3. Within same priority + mode: created_at ascending (oldest first)
 */
export function sortTickets(tickets: TicketView[]): TicketView[] {
  return [...tickets].sort((a, b) => {
    const pA = PRIORITY_RANK[a.ticket_priority];
    const pB = PRIORITY_RANK[b.ticket_priority];
    if (pA !== pB) return pA - pB;

    const mA = MODE_RANK[a.ticket_mode];
    const mB = MODE_RANK[b.ticket_mode];
    if (mA !== mB) return mA - mB;

    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}
