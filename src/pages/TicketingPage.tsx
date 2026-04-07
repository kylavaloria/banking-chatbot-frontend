import { AppShell } from '../components/layout/AppShell';
import { TicketTable } from '../features/ticketing/TicketTable';

export default function TicketingPage() {
  return (
    <AppShell>
      <div className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Support Queue</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Active tickets sorted by priority and wait time
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              P1 Critical — Immediate action
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              P2 Urgent — High priority
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              P3 Standard — Normal queue
            </span>
          </div>
        </div>

        <TicketTable />
      </div>
    </AppShell>
  );
}
