import { TicketFilters } from './TicketFilters';
import { TicketRow } from './TicketRow';
import { useTickets } from './useTickets';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

const TH_CLASS = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap';

export function TicketTable() {
  const {
    tickets, isLoading, error, retry,
    priorityFilter, statusFilter,
    setPriorityFilter, setStatusFilter,
  } = useTickets();

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
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <div>
            <p className="font-medium text-gray-800">Failed to load tickets</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
          <Button id="tickets-retry-btn" variant="secondary" onClick={retry}>
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !error && tickets.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <p className="font-medium text-gray-700">No active tickets found</p>
          <p className="text-sm text-gray-500">All clear — no open or in-progress tickets match your filters.</p>
        </div>
      )}

      {!isLoading && !error && tickets.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={TH_CLASS}>Priority</th>
                <th className={TH_CLASS}>Mode</th>
                <th className={TH_CLASS}>Issue Type</th>
                <th className={TH_CLASS}>Customer</th>
                <th className={TH_CLASS}>Case Summary</th>
                <th className={TH_CLASS}>Card Block</th>
                <th className={TH_CLASS}>Status</th>
                <th className={TH_CLASS}>Created</th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.map((ticket, i) => (
                <TicketRow key={ticket.ticket_id} ticket={ticket} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
