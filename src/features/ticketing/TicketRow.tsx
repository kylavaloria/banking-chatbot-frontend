import { useState } from 'react';
import type { TicketView } from '../../types/ticket.types';
import { CustomerBlock } from './CustomerBlock';
import { formatDate, modeLabel, priorityLabel, statusLabel, truncateId } from '../../utils/formatters';

interface TicketRowProps {
  ticket: TicketView;
  index:  number;
}

function priorityChip(priority: TicketView['ticket_priority']) {
  const styles: Record<TicketView['ticket_priority'], string> = {
    P1: 'bg-red-100 text-red-700 border border-red-200',
    P2: 'bg-amber-100 text-amber-700 border border-amber-200',
    P3: 'bg-[#dbe1ff] text-[#1e3a8a] border border-[#b4c5ff]/60',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-bold tracking-wide uppercase ${styles[priority]}`}
    >
      {priorityLabel(priority)}
    </span>
  );
}

function statusChip(status: TicketView['status']) {
  const styles: Record<TicketView['status'], string> = {
    open:        'border border-[#1e3a8a]/30 text-[#1e3a8a] bg-[#d5e3fc]/50',
    in_progress: 'border border-amber-300 text-amber-700 bg-amber-50',
    resolved:    'border border-emerald-300 text-emerald-700 bg-emerald-50',
    closed:      'border border-outline-variant/40 text-on-surface-variant bg-surface-container',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.65rem] font-semibold ${styles[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}

/**
 * Render the `Card Block` cell.
 *   • `not_applicable`  → dash
 *   • `offered`         → amber Pending pill with pulsing dot (matches mockup)
 *   • `confirmed`/`completed` → emerald Confirmed pill
 *   • anything else     → neutral Declined pill
 */
function CardBlockCell({ status }: { status: TicketView['card_block_status'] }) {
  if (status === 'not_applicable') {
    return <span className="text-xs text-on-surface-variant/40">—</span>;
  }
  if (status === 'offered') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot" />
        Pending
      </span>
    );
  }
  if (status === 'confirmed' || status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="material-symbols-outlined text-[0.75rem]">check_circle</span>
        Confirmed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold bg-red-50 text-red-700 border border-red-200">
      Declined
    </span>
  );
}

export function TicketRow({ ticket, index }: TicketRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Main row */}
      <tr
        id={`ticket-row-${ticket.ticket_id}`}
        className="ticket-row"
        onClick={() => setExpanded(prev => !prev)}
      >
        <td className="px-4 py-3.5 whitespace-nowrap">{priorityChip(ticket.ticket_priority)}</td>
        <td className="px-4 py-3.5 text-xs text-on-surface-variant">
          {modeLabel(ticket.ticket_mode)}
        </td>
        <td className="px-4 py-3.5 text-xs text-on-surface font-mono">
          <span className="line-clamp-1">{ticket.issue_type}</span>
        </td>
        <td className="px-4 py-3.5">
          <div className="text-xs font-semibold text-on-surface line-clamp-1">
            {ticket.customer_full_name ?? ticket.customer_email}
          </div>
          {ticket.customer_full_name && (
            <div className="text-[0.65rem] text-on-surface-variant line-clamp-1">
              {ticket.customer_email}
            </div>
          )}
        </td>
        <td className="px-4 py-3.5 text-xs text-on-surface max-w-[180px]">
          <span className="line-clamp-1">{ticket.case_summary}</span>
        </td>
        <td className="px-4 py-3.5 whitespace-nowrap">
          <CardBlockCell status={ticket.card_block_status} />
        </td>
        <td className="px-4 py-3.5 whitespace-nowrap">{statusChip(ticket.status)}</td>
        <td className="px-4 py-3.5 text-[0.65rem] text-on-surface-variant whitespace-nowrap">
          {formatDate(ticket.created_at)}
        </td>
        <td className="px-4 py-3.5">
          <span
            className={`material-symbols-outlined text-on-surface-variant/40 hover:text-[#1e3a8a] transition-all duration-200 inline-block ${expanded ? 'rotate-90 text-[#1e3a8a]' : ''}`}
            style={{ fontSize: '1rem' }}
          >
            chevron_right
          </span>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-[#f7f9fb]">
          <td colSpan={9} className="px-6 py-5 border-t border-outline-variant/20">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Customer */}
              <div>
                <h3 className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                  Customer
                </h3>
                <CustomerBlock ticket={ticket} />
              </div>

              {/* Case */}
              <div>
                <h3 className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                  Case
                </h3>
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">
                      Case ID
                    </p>
                    <p className="text-sm font-mono text-on-surface mt-0.5">
                      {truncateId(ticket.case_id)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">
                      Summary
                    </p>
                    <p className="text-sm text-on-surface mt-0.5 leading-relaxed">
                      {ticket.case_summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ticket */}
              <div>
                <h3 className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                  Ticket
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                    <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">
                      Issue
                    </p>
                    <p className="text-sm text-on-surface mt-0.5 font-mono">{ticket.issue_type}</p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">
                      Priority
                    </p>
                    <div className="mt-0.5">{priorityChip(ticket.ticket_priority)}</div>
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">
                      Mode
                    </p>
                    <p className="text-sm text-on-surface mt-0.5">
                      {modeLabel(ticket.ticket_mode)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">
                      Status
                    </p>
                    <div className="mt-0.5">{statusChip(ticket.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">
                      Created
                    </p>
                    <p className="text-sm text-on-surface mt-0.5">{formatDate(ticket.created_at)}</p>
                  </div>
                  {ticket.card_block_status !== 'not_applicable' && (
                    <div className="col-span-2">
                      <p className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-wide">
                        Card Block
                      </p>
                      <div className="mt-1">
                        <CardBlockCell status={ticket.card_block_status} />
                      </div>
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
