import type { TicketView } from '../../types/ticket.types';

interface TicketFiltersProps {
  priority:   'all' | 'P1' | 'P2' | 'P3';
  status:     'all' | TicketView['status'];
  onPriority: (v: 'all' | 'P1' | 'P2' | 'P3') => void;
  onStatus:   (v: 'all' | TicketView['status']) => void;
  totalCount: number;
}

const SELECT_CLASS =
  'portal-select text-xs font-medium text-on-surface bg-white border border-outline-variant/50 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1e3a8a]/50 focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all cursor-pointer';

export function TicketFilters({
  priority,
  status,
  onPriority,
  onStatus,
  totalCount,
}: TicketFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <span className="text-sm font-semibold text-on-surface-variant">
        {totalCount} ticket{totalCount !== 1 ? 's' : ''}
      </span>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-priority" className="text-xs font-medium text-on-surface-variant">
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
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="filter-status" className="text-xs font-medium text-on-surface-variant">
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
    </div>
  );
}
