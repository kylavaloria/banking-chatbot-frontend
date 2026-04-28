import { apiFetch } from './client';

export interface EmotionDistributionEntry {
  emotion:    string;
  count:      number;
  percentage: number;
}

export interface EmotionByIssueType {
  issue_type:       string;
  emotions:         Record<string, number>;
  dominant_emotion: string;
}

export interface EmotionTrendEntry {
  date:       string;
  angry:      number;
  frustrated: number;
  anxious:    number;
  distressed: number;
  neutral:    number;
}

export interface HighIntensityEntry {
  emotion: string;
  count:   number;
}

export interface EmotionAnalyticsResponse {
  period_days:             number;
  emotion_distribution:    EmotionDistributionEntry[];
  emotion_by_issue_type:   EmotionByIssueType[];
  emotion_trend:           EmotionTrendEntry[];
  high_intensity_summary:  HighIntensityEntry[];
  total_messages_analyzed: number;
}

// ── Operations analytics ─────────────────────────────────────────────────────

export interface TicketPrioritySummary {
  priority: string;
  total:    number;
  open:     number;
  resolved: number;
}

export interface OperationsAnalyticsResponse {
  period_days:     number;
  ticket_summary:  {
    total:       number;
    open:        number;
    resolved:    number;
    closed:      number;
    by_priority: TicketPrioritySummary[];
  };
  ticket_volume_trend: Array<{
    date: string;
    P1:   number;
    P2:   number;
    P3:   number;
  }>;
  top_issue_types: Array<{
    issue_type:  string;
    count:       number;
    percentage:  number;
  }>;
  response_mode_distribution: Array<{
    mode:        string;
    count:       number;
    percentage:  number;
  }>;
  top_customers: Array<{
    full_name:     string;
    email:         string;
    segment:       string | null;
    total_tickets: number;
    p1_count:      number;
    p2_count:      number;
    p3_count:      number;
  }>;
  session_summary: {
    total_sessions:  number;
    active_sessions: number;
  };
}

export async function getOperationsAnalytics(params?: {
  days?: number;
}): Promise<OperationsAnalyticsResponse> {
  const query = new URLSearchParams();
  if (params?.days) query.set('days', String(params.days));
  const qs = query.toString();
  return apiFetch<OperationsAnalyticsResponse>(`/api/agent/analytics/operations${qs ? `?${qs}` : ''}`);
}

// ── Emotion analytics ─────────────────────────────────────────────────────────

export async function getEmotionAnalytics(params?: {
  days?:     number;
  priority?: string;
}): Promise<EmotionAnalyticsResponse> {
  const query = new URLSearchParams();
  if (params?.days)     query.set('days', String(params.days));
  if (params?.priority) query.set('priority', params.priority);
  const qs = query.toString();
  return apiFetch<EmotionAnalyticsResponse>(`/api/agent/analytics/emotions${qs ? `?${qs}` : ''}`);
}
