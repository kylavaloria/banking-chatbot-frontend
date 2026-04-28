import { useState } from 'react';
import { TicketFilters } from './TicketFilters';
import { TicketRow } from './TicketRow';
import { useTickets } from './useTickets';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

const TH_CLASS =
  'text-left px-4 py-3 text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap';

export function TicketTable() {
  const {
    tickets,
    isLoading,
    error,
    retry,
    priorityFilter,
    statusFilter,
    setPriorityFilter,
    setStatusFilter,
  } = useTickets();

  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  const handleRowClick = (ticketId: string) => {
    setExpandedTicketId(prev => (prev === ticketId ? null : ticketId));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <TicketFilters
        priority={priorityFilter}
        status={statusFilter}
        onPriority={setPriorityFilter}
        onStatus={setStatusFilter}
        totalCount={tickets.length}
      />

      {/* States */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-outline-variant/20 shadow-[0px_8px_28px_rgba(25,28,30,0.06)]">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center gap-4 py-16 text-center bg-white rounded-2xl border border-outline-variant/20 shadow-[0px_8px_28px_rgba(25,28,30,0.06)]">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#ffdad6]">
            <span className="material-symbols-outlined text-[#ba1a1a] text-2xl">error</span>
          </div>
          <div>
            <p className="font-semibold text-on-surface">Failed to load tickets</p>
            <p className="text-sm text-on-surface-variant mt-1">{error}</p>
          </div>
          <Button id="tickets-retry-btn" variant="secondary" onClick={retry}>
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !error && tickets.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center bg-white rounded-2xl border border-outline-variant/20 shadow-[0px_8px_28px_rgba(25,28,30,0.06)]">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#ccfbf1]">
            <span className="material-symbols-outlined text-[#0d9488] text-2xl">check_circle</span>
          </div>
          <p className="font-semibold text-on-surface">No active tickets found</p>
          <p className="text-sm text-on-surface-variant">
            All clear — no open or in-progress tickets match your filters.
          </p>
        </div>
      )}

      {!isLoading && !error && tickets.length > 0 && (
        <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-[0px_8px_28px_rgba(25,28,30,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-[#f2f4f6]">
                  <th className={TH_CLASS}>Priority</th>
                  <th className={TH_CLASS}>Mode</th>
                  <th className={TH_CLASS}>Issue Type</th>
                  <th className={TH_CLASS}>Customer</th>
                  <th className={TH_CLASS}>Case Summary</th>
                  <th className={TH_CLASS}>Card Block</th>
                  <th className={TH_CLASS}>Status</th>
                  <th className={TH_CLASS}>Emotion</th>
                  <th className={TH_CLASS}>Created</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {tickets.map((ticket, i) => (
                  <TicketRow
                    key={ticket.ticket_id}
                    ticket={ticket}
                    index={i}
                    isExpanded={expandedTicketId === ticket.ticket_id}
                    onToggle={handleRowClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
