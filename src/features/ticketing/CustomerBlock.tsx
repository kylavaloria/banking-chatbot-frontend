import type { TicketView } from '../../types/ticket.types';

interface CustomerBlockProps {
  ticket: TicketView;
}

export function CustomerBlock({ ticket }: CustomerBlockProps) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</p>
        <p className="text-sm text-gray-800 mt-0.5">{ticket.customer_full_name ?? '—'}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</p>
        <p className="text-sm text-gray-800 mt-0.5">{ticket.customer_email}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Mobile</p>
        <p className="text-sm text-gray-800 mt-0.5">{ticket.customer_mobile ?? '—'}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Segment</p>
        <p className="text-sm text-gray-800 mt-0.5 capitalize">{ticket.customer_segment ?? '—'}</p>
      </div>
    </div>
  );
}
