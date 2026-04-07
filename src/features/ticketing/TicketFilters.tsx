import type { TicketView } from '../../types/ticket.types';

interface TicketFiltersProps {
  priority:    'all' | 'P1' | 'P2' | 'P3';
  status:      'all' | TicketView['status'];
  onPriority:  (v: 'all' | 'P1' | 'P2' | 'P3') => void;
  onStatus:    (v: 'all' | TicketView['status']) => void;
  totalCount:  number;
}

const SELECT_CLASS = `
  text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white
  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
  cursor-pointer transition-colors duration-150 hover:border-gray-400
`;

export function TicketFilters({
  priority, status, onPriority, onStatus, totalCount,
}: TicketFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-gray-500 font-medium">
        {totalCount} ticket{totalCount !== 1 ? 's' : ''}
      </span>

      <div className="flex items-center gap-2 ml-auto">
        <label htmlFor="filter-priority" className="text-sm text-gray-600 font-medium whitespace-nowrap">
          Priority
        </label>
        <select
          id="filter-priority"
          value={priority}
          onChange={e => onPriority(e.target.value as any)}
          className={SELECT_CLASS}
        >
          <option value="all">All</option>
          <option value="P1">P1 Critical</option>
          <option value="P2">P2 Urgent</option>
          <option value="P3">P3 Standard</option>
        </select>

        <label htmlFor="filter-status" className="text-sm text-gray-600 font-medium whitespace-nowrap ml-3">
          Status
        </label>
        <select
          id="filter-status"
          value={status}
          onChange={e => onStatus(e.target.value as any)}
          className={SELECT_CLASS}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  );
}
