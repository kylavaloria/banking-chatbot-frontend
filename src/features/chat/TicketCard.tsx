import { useState } from 'react';
import type { TicketDetail } from '../../types/chat.types';

export interface TicketCardsProps {
  tickets:      TicketDetail[];
  responseMode: string | null;
}

function formatLabel(value: string): string {
  return value.replace(/_/g, ' ');
}

function toTitleCase(value: string): string {
  return formatLabel(value)
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function isOpenStatus(status: string): boolean {
  const s = status.toLowerCase();
  return s === 'open' || s === 'in_progress' || s === 'pending';
}

// ── Per-ticket card component ─────────────────────────────────────────────
function TicketCard({
  ticket,
  isCritical,
}: {
  ticket:     TicketDetail;
  isCritical: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const statusOpen = isOpenStatus(ticket.status);

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.ticket_id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Choose accent based on criticality
  const accentBar = isCritical
    ? 'bg-gradient-to-r from-red-500 to-rose-400'
    : 'bg-gradient-to-r from-emerald-500 to-teal-400';

  return (
    <div
      className={`
        ticket-card w-full bg-surface-container-lowest rounded-xl overflow-hidden
        border shadow-[0px_8px_28px_rgba(25,28,30,0.07)] mt-1
        ${isCritical ? 'border-red-300/60' : 'border-outline-variant/20'}
      `}
    >
      {/* Gradient accent top bar */}
      <div className={`h-1 w-full ${accentBar}`} />

      <div className="p-5 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <span
              className={`
                inline-flex items-center gap-1 px-2 py-0.5 rounded
                text-[0.62rem] font-bold tracking-widest uppercase w-fit
                ${isCritical
                  ? 'bg-red-100 text-red-700'
                  : 'bg-secondary-container text-on-secondary-container'
                }
              `}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '0.75rem', lineHeight: 1 }}
              >
                confirmation_number
              </span>
              {isCritical ? 'Critical' : 'Ticket'}
            </span>
            <h3 className="text-xs text-on-surface-variant">
              ID{' '}
              <span
                className="font-semibold text-on-surface font-mono tracking-tight break-all"
                title={ticket.ticket_id}
              >
                {ticket.ticket_id}
              </span>
            </h3>
          </div>

          {/* Copy ID button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy ticket ID"
            className={`
              flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border
              active:scale-95 transition-all duration-150 text-[0.7rem] font-medium
              ${copied
                ? 'border-emerald-400 text-emerald-600 bg-emerald-50'
                : 'border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:border-[#1e3a8a]/40 hover:text-[#1e3a8a] hover:bg-secondary-container/60'
              }
            `}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '0.85rem', lineHeight: 1 }}
            >
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy ID'}</span>
          </button>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-widest">
              Issue Type
            </span>
            <span className="text-sm text-on-surface font-medium">
              {toTitleCase(ticket.issue_type)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-widest">
              Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={`w-2 h-2 rounded-full pulse-dot ${
                  statusOpen ? 'bg-emerald-500' : 'bg-outline'
                }`}
              />
              <span
                className={`text-sm font-semibold capitalize ${
                  statusOpen ? 'text-emerald-600' : 'text-on-surface-variant'
                }`}
              >
                {formatLabel(ticket.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        {ticket.summary ? (
          <div className="flex flex-col gap-1 p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/15">
            <span className="text-[0.65rem] font-semibold text-on-surface-variant uppercase tracking-widest">
              Summary
            </span>
            <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
              {ticket.summary}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ── Public wrapper — renders one card per ticket ──────────────────────────
export function TicketCards({ tickets, responseMode }: TicketCardsProps) {
  const isCritical = responseMode === 'critical_action_confirmation';

  return (
    <div className="w-full flex flex-col gap-3">
      {tickets.map(ticket => (
        <TicketCard
          key={ticket.ticket_id}
          ticket={ticket}
          isCritical={isCritical}
        />
      ))}
    </div>
  );
}
