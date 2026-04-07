import type { TicketView } from '../types/ticket.types';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month:  'short',
    day:    'numeric',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}

export function priorityLabel(priority: TicketView['ticket_priority']): string {
  switch (priority) {
    case 'P1': return 'P1 CRITICAL';
    case 'P2': return 'P2 URGENT';
    case 'P3': return 'P3 STANDARD';
  }
}

export function modeLabel(mode: TicketView['ticket_mode']): string {
  switch (mode) {
    case 'live_escalation': return 'Live Escalation';
    case 'urgent_ticket':   return 'Urgent Ticket';
    case 'standard_ticket': return 'Standard Ticket';
  }
}

export function statusLabel(status: TicketView['status']): string {
  switch (status) {
    case 'open':        return 'Open';
    case 'in_progress': return 'In Progress';
    case 'resolved':    return 'Resolved';
    case 'closed':      return 'Closed';
  }
}

export function truncateId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}
