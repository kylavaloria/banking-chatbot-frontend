import type { TicketView } from '../../types/ticket.types';

interface CustomerBlockProps {
  ticket: TicketView;
}

export function CustomerBlock({ ticket }: CustomerBlockProps) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      <div>
        <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">Name</p>
        <p className="text-sm text-on-surface mt-0.5">{ticket.customer_full_name ?? '—'}</p>
      </div>
      <div>
        <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">Email</p>
        <p className="text-sm text-on-surface mt-0.5">{ticket.customer_email}</p>
      </div>
      <div>
        <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">Mobile</p>
        <p className="text-sm text-on-surface mt-0.5">{ticket.customer_mobile ?? '—'}</p>
      </div>
      <div>
        <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">Segment</p>
        <p className="text-sm text-on-surface mt-0.5 capitalize">{ticket.customer_segment ?? '—'}</p>
      </div>
    </div>
  );
}
