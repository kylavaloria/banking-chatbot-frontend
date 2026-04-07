import type { TicketView } from '../../types/ticket.types';
import { priorityLabel } from '../../utils/formatters';

interface BadgeProps {
  priority: TicketView['ticket_priority'];
}

const BADGE_CLASSES: Record<TicketView['ticket_priority'], string> = {
  P1: 'bg-red-600 text-white',
  P2: 'bg-amber-400 text-amber-900',
  P3: 'bg-blue-600 text-white',
};

export function Badge({ priority }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap ${BADGE_CLASSES[priority]}`}
    >
      {priorityLabel(priority)}
    </span>
  );
}
