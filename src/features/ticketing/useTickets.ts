import { useState, useEffect } from 'react';
import type { TicketView } from '../../types/ticket.types';
import { getAgentTickets } from '../../api/tickets.api';
import { sortTickets } from '../../utils/sortTickets';

export function useTickets() {
  const [allTickets, setAllTickets] = useState<TicketView[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const [priorityFilter, setPriorityFilter] = useState<'all' | 'P1' | 'P2' | 'P3'>('all');
  const [statusFilter,   setStatusFilter]   = useState<'all' | TicketView['status']>('all');

  async function fetchTickets() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAgentTickets();
      setAllTickets(sortTickets(data));
    } catch (err: any) {
      setError(err.message ?? 'Failed to load tickets.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = allTickets.filter(t => {
    const matchPriority = priorityFilter === 'all' || t.ticket_priority === priorityFilter;
    const matchStatus   = statusFilter   === 'all' || t.status          === statusFilter;
    return matchPriority && matchStatus;
  });

  return {
    tickets: filtered,
    isLoading,
    error,
    retry: fetchTickets,
    priorityFilter,
    statusFilter,
    setPriorityFilter,
    setStatusFilter,
  };
}
