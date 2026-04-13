import type { TicketDetail } from '../../types/chat.types';

export interface TicketCardsProps {
  tickets:      TicketDetail[];
  responseMode: string | null;
}

function formatLabel(value: string): string {
  return value.replace(/_/g, ' ');
}

export function TicketCards({ tickets, responseMode }: TicketCardsProps) {
  const isCritical =
    responseMode === 'critical_action_confirmation';
  const isMulti =
    responseMode === 'multi_issue_confirmation';
  const isTicketConfirmation =
    responseMode === 'ticket_confirmation';

  const showModeRow =
    isCritical ||
    isMulti ||
    (isTicketConfirmation && !isCritical && !isMulti);

  return (
    <div className="mt-3 flex w-full flex-col gap-3">
      {showModeRow && (
        <div className="flex flex-wrap items-center gap-2">
          {isCritical && (
            <span
              className="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
              aria-label="Critical action"
            >
              Critical
            </span>
          )}
          {isMulti && (
            <span
              className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900"
              aria-label="Multiple issues"
            >
              Multi-issue
            </span>
          )}
          {isTicketConfirmation && !isCritical && !isMulti && (
            <span
              className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900"
              aria-label="Ticket"
            >
              Ticket
            </span>
          )}
        </div>
      )}

      {tickets.map((ticket) => (
        <article
          key={ticket.ticket_id}
          className={`
            overflow-hidden rounded-xl border bg-white shadow-sm
            ${isCritical
              ? 'border-red-300 ring-1 ring-red-100'
              : 'border-gray-200'
            }
          `}
        >
          <header
            className={`
              flex flex-wrap items-center gap-2 border-b px-3 py-2
              ${isCritical
                ? 'border-red-100 bg-red-50'
                : 'border-gray-100 bg-gray-50'
              }
            `}
          >
            <span
              className="truncate font-mono text-[11px] text-gray-500"
              title={ticket.ticket_id}
            >
              {ticket.ticket_id}
            </span>
          </header>

          <div className="space-y-3 px-3 py-3 text-sm">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Issue type
              </p>
              <p className="font-medium capitalize text-gray-900">
                {formatLabel(ticket.issue_type)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Status
              </p>
              <p className="capitalize text-gray-700">
                {formatLabel(ticket.status)}
              </p>
            </div>
            {ticket.summary ? (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                  Summary
                </p>
                <p className="whitespace-pre-wrap text-sm leading-snug text-gray-600">
                  {ticket.summary}
                </p>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
