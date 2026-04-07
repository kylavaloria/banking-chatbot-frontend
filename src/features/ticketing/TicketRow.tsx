import { useState } from 'react';
import type { TicketView } from '../../types/ticket.types';
import { Badge } from '../../components/ui/Badge';
import { CustomerBlock } from './CustomerBlock';
import { formatDate, modeLabel, statusLabel, truncateId } from '../../utils/formatters';

interface TicketRowProps {
  ticket: TicketView;
  index:  number;
}

function cardBlockDisplay(status: TicketView['card_block_status']) {
  if (status === 'not_applicable') return null;
  if (status === 'confirmed' || status === 'completed') return '✅ Confirmed';
  if (status === 'offered') return '🟡 Pending';
  return '❌ Declined';
}

function statusChip(status: TicketView['status']) {
  const map: Record<TicketView['status'], string> = {
    open:        'bg-blue-50 text-blue-700 border-blue-200',
    in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
    resolved:    'bg-green-50 text-green-700 border-green-200',
    closed:      'bg-gray-100 text-gray-500 border-gray-200',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${map[status]}`}>
      {statusLabel(status)}
    </span>
  );
}

export function TicketRow({ ticket, index }: TicketRowProps) {
  const [expanded, setExpanded] = useState(false);
  const cardBlock = cardBlockDisplay(ticket.card_block_status);

  return (
    <>
      {/* Main row */}
      <tr
        className={`
          cursor-pointer transition-colors duration-100
          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
          hover:bg-brand-50
        `}
        onClick={() => setExpanded(prev => !prev)}
        id={`ticket-row-${ticket.ticket_id}`}
      >
        <td className="px-4 py-3 whitespace-nowrap">
          <Badge priority={ticket.ticket_priority} />
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
          {modeLabel(ticket.ticket_mode)}
        </td>
        <td className="px-4 py-3 text-sm text-gray-800 max-w-[180px]">
          <span className="line-clamp-1">{ticket.issue_type}</span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-800">
          <div className="font-medium line-clamp-1">
            {ticket.customer_full_name ?? ticket.customer_email}
          </div>
          {ticket.customer_full_name && (
            <div className="text-xs text-gray-400 line-clamp-1">{ticket.customer_email}</div>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 max-w-[220px]">
          <span className="line-clamp-2">{ticket.case_summary}</span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm">
          {cardBlock ?? <span className="text-gray-300 text-xs">—</span>}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          {statusChip(ticket.status)}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
          {formatDate(ticket.created_at)}
        </td>
        <td className="px-4 py-3 text-center">
          <span className={`text-gray-400 transition-transform duration-200 inline-block ${expanded ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
          <td colSpan={9} className="px-6 py-5 border-t border-gray-100">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* Customer */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Customer
                </h3>
                <CustomerBlock ticket={ticket} />
              </div>

              {/* Case */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Case
                </h3>
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Case ID</p>
                    <p className="text-sm font-mono text-gray-700 mt-0.5">{truncateId(ticket.case_id)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Summary</p>
                    <p className="text-sm text-gray-800 mt-0.5 leading-relaxed">{ticket.case_summary}</p>
                  </div>
                </div>
              </div>

              {/* Ticket */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Ticket
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Issue</p>
                    <p className="text-sm text-gray-800 mt-0.5">{ticket.issue_type}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Priority</p>
                    <div className="mt-0.5"><Badge priority={ticket.ticket_priority} /></div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Mode</p>
                    <p className="text-sm text-gray-800 mt-0.5">{modeLabel(ticket.ticket_mode)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</p>
                    <div className="mt-0.5">{statusChip(ticket.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Created</p>
                    <p className="text-sm text-gray-800 mt-0.5">{formatDate(ticket.created_at)}</p>
                  </div>
                  {cardBlock && (
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Card Block</p>
                      <p className="text-sm mt-0.5">{cardBlock}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
