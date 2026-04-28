import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import {
  getEmotionAnalytics,
  getOperationsAnalytics,
  type EmotionAnalyticsResponse,
  type OperationsAnalyticsResponse,
} from '../api/analytics.api';

// ── Constants ─────────────────────────────────────────────────────────────────

const EMOTION_COLORS: Record<string, string> = {
  angry:      '#EF4444',
  frustrated: '#F97316',
  anxious:    '#EAB308',
  distressed: '#A855F7',
  neutral:    '#9CA3AF',
};

const EMOTION_EMOJI: Record<string, string> = {
  angry:      '😠',
  frustrated: '😤',
  anxious:    '😰',
  distressed: '😨',
  neutral:    '😐',
};

const ALL_EMOTIONS = ['angry', 'frustrated', 'anxious', 'distressed', 'neutral'] as const;

const PRIORITY_COLORS: Record<string, string> = {
  P1: '#EF4444',
  P2: '#F59E0B',
  P3: '#3B82F6',
};

const STATUS_COLORS: Record<string, string> = {
  Open:     '#3B82F6',
  Resolved: '#10B981',
  Closed:   '#9CA3AF',
};

const RESPONSE_MODE_LABELS: Record<string, string> = {
  ticket_confirmation:          'Ticket Created',
  critical_action_confirmation: 'Critical Action',
  multi_issue_confirmation:     'Multi-Issue',
  informational:                'Informational',
  clarification:                'Clarification',
  refusal:                      'Refused',
};

const RESPONSE_MODE_COLORS: Record<string, string> = {
  ticket_confirmation:          '#10B981',
  critical_action_confirmation: '#EF4444',
  multi_issue_confirmation:     '#8B5CF6',
  informational:                '#3B82F6',
  clarification:                '#F59E0B',
  refusal:                      '#9CA3AF',
};

const PERIODS = [
  { label: '7D',  days: 7  },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function toTitleCase(str: string): string {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatAxisDate(dateStr: string): string {
  const parts = dateStr.split('-');
  const month = parseInt(parts[1] ?? '1', 10) - 1;
  const day   = parseInt(parts[2] ?? '1', 10);
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${MONTHS[month]} ${day}`;
}

function firstNameFromEmail(email: string | null): string {
  if (!email) return 'there';
  const local = email.split('@')[0] ?? '';
  const token = local.split(/[._-]/)[0] ?? local;
  if (!token) return 'there';
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

function modeLabel(mode: string): string {
  return RESPONSE_MODE_LABELS[mode] ?? toTitleCase(mode);
}

function modeColor(mode: string): string {
  return RESPONSE_MODE_COLORS[mode] ?? '#6B7280';
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent,
}: {
  icon?: string; label: string; value: string; sub?: string; accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-[0px_4px_16px_rgba(25,28,30,0.06)] overflow-hidden flex flex-col">
      {/* Gradient top bar — same pattern as login card */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(to right, ${accent ?? '#1e3a8a'}, #2dd4bf)` }} />
      <div className="p-5 flex flex-col gap-1.5">
        <p className="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant">
          {label}
        </p>
        <p className="text-2xl font-bold text-on-surface tracking-tight">{value}</p>
        {sub && <p className="text-[0.7rem] text-on-surface-variant leading-snug">{sub}</p>}
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-[0px_8px_28px_rgba(25,28,30,0.06)]">
      <div className="px-6 py-4 border-b border-outline-variant/10">
        <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant">
          {title}
        </h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-12 text-sm text-on-surface-variant/60">
      {message}
    </div>
  );
}

function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) {
  if (percentage < 5) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${Math.round(percentage)}%`}
    </text>
  );
}

// ── Emotion tab ───────────────────────────────────────────────────────────────

function EmotionTab({ data, days, onRetry }: {
  data:    EmotionAnalyticsResponse;
  days:    number;
  onRetry: () => void;
}) {
  const mostCommon = [...data.emotion_distribution].sort((a, b) => b.count - a.count)[0];
  const totalHigh  = data.high_intensity_summary.reduce((s, e) => s + e.count, 0);
  const highBreakdown = data.high_intensity_summary
    .filter(e => e.count > 0)
    .sort((a, b) => b.count - a.count)
    .map(e => `${e.count} ${e.emotion}`)
    .join(' · ');

  const pieData = data.emotion_distribution.filter(e => e.count > 0);

  const barData = [...data.emotion_by_issue_type]
    .map(d => {
      const total = Object.values(d.emotions).reduce((a, b) => a + b, 0);
      const row: Record<string, unknown> = { issue_type: toTitleCase(d.issue_type), _total: total };
      for (const em of ALL_EMOTIONS) row[em] = d.emotions[em] ?? 0;
      return row;
    })
    .filter(d => (d._total as number) > 0)
    .sort((a, b) => (b._total as number) - (a._total as number));

  if (data.total_messages_analyzed === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center bg-white rounded-2xl border border-outline-variant/20 shadow-[0px_8px_28px_rgba(25,28,30,0.06)]">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f2f4f6]">
          <span className="material-symbols-outlined text-on-surface-variant text-2xl">sentiment_neutral</span>
        </div>
        <p className="font-semibold text-on-surface">No emotion data available for this period.</p>
        <p className="text-sm text-on-surface-variant">Try expanding the date range or wait for more conversations.</p>
        <Button id="emotion-retry-btn" variant="secondary" onClick={onRetry}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Messages Analyzed"
          value={data.total_messages_analyzed.toLocaleString()}
          sub={`User messages with emotion data — last ${days} day${days === 1 ? '' : 's'}`}
          accent="#1e3a8a"
        />
        <StatCard
          label="Most Common Emotion"
          value={mostCommon ? `${EMOTION_EMOJI[mostCommon.emotion] ?? ''} ${toTitleCase(mostCommon.emotion)}` : '—'}
          sub={mostCommon ? `${mostCommon.count} messages · ${mostCommon.percentage}% of total` : undefined}
          accent={mostCommon ? EMOTION_COLORS[mostCommon.emotion] : '#9CA3AF'}
        />
        <StatCard
          label="High Intensity Messages"
          value={totalHigh.toLocaleString()}
          sub={highBreakdown || 'No high-intensity signals detected'}
          accent="#A855F7"
        />
      </div>

      <SectionCard title="Emotion Distribution">
        {pieData.length === 0
          ? <ChartEmpty message="No emotion distribution data for this period." />
          : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={pieData} dataKey="count" nameKey="emotion" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={renderPieLabel}>
                  {pieData.map(entry => <Cell key={entry.emotion} fill={EMOTION_COLORS[entry.emotion] ?? '#6B7280'} />)}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} messages`, `${EMOTION_EMOJI[name] ?? ''} ${toTitleCase(name)}`]}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                />
                <Legend formatter={(value: string) => `${EMOTION_EMOJI[value] ?? ''} ${toTitleCase(value)}`} iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          )
        }
      </SectionCard>

      <SectionCard title="Emotion Trend Over Time">
        {data.emotion_trend.length === 0
          ? <ChartEmpty message="Not enough data to show a trend." />
          : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.emotion_trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tickFormatter={formatAxisDate} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip labelFormatter={formatAxisDate} formatter={(value: number, name: string) => [`${value} messages`, `${EMOTION_EMOJI[name] ?? ''} ${toTitleCase(name)}`]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Legend formatter={(value: string) => `${EMOTION_EMOJI[value] ?? ''} ${toTitleCase(value)}`} iconType="circle" iconSize={10} />
                {ALL_EMOTIONS.map(em => (
                  <Line key={em} type="monotone" dataKey={em} stroke={EMOTION_COLORS[em]} strokeWidth={2} dot={{ r: 3, fill: EMOTION_COLORS[em] }} activeDot={{ r: 5 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )
        }
      </SectionCard>

      <SectionCard title="Emotion by Issue Type">
        {barData.length === 0
          ? <ChartEmpty message="No issue-type emotion data for this period." />
          : (
            <ResponsiveContainer width="100%" height={Math.max(barData.length * 52, 200)}>
              <BarChart layout="vertical" data={barData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="issue_type" width={210} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number, name: string) => [`${value} messages`, `${EMOTION_EMOJI[name] ?? ''} ${toTitleCase(name)}`]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Legend formatter={(value: string) => `${EMOTION_EMOJI[value] ?? ''} ${toTitleCase(value)}`} iconType="circle" iconSize={10} />
                {ALL_EMOTIONS.map(em => (
                  <Bar key={em} dataKey={em} stackId="stack" fill={EMOTION_COLORS[em]} radius={em === 'neutral' ? [0, 4, 4, 0] : undefined} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </SectionCard>
    </div>
  );
}

// ── Operations tab ────────────────────────────────────────────────────────────

function SegmentBadge({ segment }: { segment: string | null }) {
  if (!segment) return <span className="text-xs text-on-surface-variant/40">—</span>;
  const style =
    segment === 'retail'    ? 'bg-[#d5e3fc] text-[#1e3a8a] border-[#b4c5ff]/60' :
    segment === 'corporate' ? 'bg-purple-100 text-purple-700 border-purple-200' :
    'bg-[#f2f4f6] text-on-surface-variant border-outline-variant/30';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-semibold capitalize border ${style}`}>
      {segment}
    </span>
  );
}

function OperationsTab({ data, days }: { data: OperationsAnalyticsResponse; days: number }) {
  const p1 = data.ticket_summary.by_priority.find(p => p.priority === 'P1');

  const statusData = [
    { name: 'Open',     value: data.ticket_summary.open,     color: STATUS_COLORS.Open     },
    { name: 'Resolved', value: data.ticket_summary.resolved, color: STATUS_COLORS.Resolved },
    { name: 'Closed',   value: data.ticket_summary.closed,   color: STATUS_COLORS.Closed   },
  ].filter(d => d.value > 0);

  const issueBarData = (data.top_issue_types ?? []).map(d => ({
    label: toTitleCase(d.issue_type),
    count: d.count,
  }));

  const responseModeData = (data.response_mode_distribution ?? []).map(d => ({
    label: modeLabel(d.mode),
    mode:  d.mode,
    count: d.count,
  }));

  return (
    <div className="flex flex-col gap-4">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Tickets"
          value={data.ticket_summary.total.toLocaleString()}
          sub={`Last ${days} day${days === 1 ? '' : 's'}`}
          accent="#1e3a8a"
        />
        <StatCard
          label="Open Tickets"
          value={data.ticket_summary.open.toLocaleString()}
          sub="Awaiting resolution"
          accent="#3B82F6"
        />
        <StatCard
          label="P1 Critical"
          value={(p1?.total ?? 0).toLocaleString()}
          sub={(p1?.total ?? 0) > 0 ? `${p1?.open ?? 0} still open` : 'No critical tickets'}
          accent={(p1?.total ?? 0) > 0 ? '#EF4444' : '#9CA3AF'}
        />
        <StatCard
          label="Total Sessions"
          value={data.session_summary.total_sessions.toLocaleString()}
          sub={`${data.session_summary.active_sessions} active session${data.session_summary.active_sessions === 1 ? '' : 's'}`}
          accent="#10B981"
        />
      </div>

      {/* Trend + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <SectionCard title="Ticket Volume Trend">
            {data.ticket_volume_trend.length === 0
              ? <ChartEmpty message="No ticket trend data for this period." />
              : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.ticket_volume_trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tickFormatter={formatAxisDate} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip labelFormatter={formatAxisDate} formatter={(value: number, name: string) => [`${value} tickets`, name]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Legend iconType="circle" iconSize={10} />
                    {(['P1', 'P2', 'P3'] as const).map(p => (
                      <Line key={p} type="monotone" dataKey={p} stroke={PRIORITY_COLORS[p]} strokeWidth={2} dot={{ r: 3, fill: PRIORITY_COLORS[p] }} activeDot={{ r: 5 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )
            }
          </SectionCard>
        </div>

        <div className="lg:col-span-2">
          <SectionCard title="Ticket Status Breakdown">
            {statusData.length === 0
              ? <ChartEmpty message="No status data for this period." />
              : (
                <div className="relative">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={statusData} dataKey="value" cx="50%" cy="48%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                        {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value: number, name: string) => [`${value} tickets`, name]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                      <Legend iconType="circle" iconSize={10} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: '2.5rem' }}>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-on-surface">{data.ticket_summary.total}</p>
                      <p className="text-[0.65rem] text-on-surface-variant">tickets</p>
                    </div>
                  </div>
                </div>
              )
            }
          </SectionCard>
        </div>
      </div>

      {/* Issue types + Response modes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Top Issue Types">
          {issueBarData.length === 0
            ? <ChartEmpty message="No issue type data for this period." />
            : (
              <ResponsiveContainer width="100%" height={Math.max(issueBarData.length * 44, 200)}>
                <BarChart layout="vertical" data={issueBarData} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" width={210} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [`${value} tickets`]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Bar dataKey="count" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </SectionCard>

        <SectionCard title="Response Mode Distribution">
          {responseModeData.length === 0
            ? <ChartEmpty message="No response mode data for this period." />
            : (
              <ResponsiveContainer width="100%" height={Math.max(responseModeData.length * 44, 200)}>
                <BarChart layout="vertical" data={responseModeData} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [`${value} responses`]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {responseModeData.map((entry, i) => <Cell key={i} fill={modeColor(entry.mode)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </SectionCard>
      </div>

      {/* Top customers */}
      {data.top_customers.length > 0 && (
        <SectionCard title="Top Customers by Ticket Volume">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-[#f2f4f6]">
                  {['Customer', 'Email', 'Segment', 'Total', 'P1', 'P2', 'P3'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {data.top_customers.map((c, i) => (
                  <tr key={i} className="hover:bg-[#f7f9fb] transition-colors duration-100">
                    <td className="px-4 py-3 text-sm font-semibold text-on-surface whitespace-nowrap">{c.full_name}</td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant whitespace-nowrap">{c.email}</td>
                    <td className="px-4 py-3"><SegmentBadge segment={c.segment} /></td>
                    <td className="px-4 py-3 text-sm font-bold text-on-surface text-center tabular-nums">{c.total_tickets}</td>
                    <td className="px-4 py-3 text-center tabular-nums">
                      <span className={`text-sm font-bold ${c.p1_count > 0 ? 'text-red-600' : 'text-on-surface-variant/30'}`}>{c.p1_count}</span>
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums">
                      <span className={`text-sm font-semibold ${c.p2_count > 0 ? 'text-amber-600' : 'text-on-surface-variant/30'}`}>{c.p2_count}</span>
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums">
                      <span className={`text-sm font-semibold ${c.p3_count > 0 ? 'text-[#1e3a8a]' : 'text-on-surface-variant/30'}`}>{c.p3_count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Tab = 'emotion' | 'operations';

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'operations', label: 'Operations',        icon: 'bar_chart'                  },
  { id: 'emotion',    label: 'Emotion Insights',  icon: 'sentiment_very_dissatisfied' },
];

export default function AnalyticsPage() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  const [tab,  setTab]  = useState<Tab>('operations');
  const [days, setDays] = useState(7);

  const [emotionData,    setEmotionData]    = useState<EmotionAnalyticsResponse | null>(null);
  const [emotionLoading, setEmotionLoading] = useState(true);
  const [emotionError,   setEmotionError]   = useState<string | null>(null);

  const [opsData,    setOpsData]    = useState<OperationsAnalyticsResponse | null>(null);
  const [opsLoading, setOpsLoading] = useState(true);
  const [opsError,   setOpsError]   = useState<string | null>(null);

  const fetchEmotion = useCallback(async (d: number) => {
    setEmotionLoading(true);
    setEmotionError(null);
    try { setEmotionData(await getEmotionAnalytics({ days: d })); }
    catch (err: any) { setEmotionError(err.message ?? 'Failed to load emotion analytics.'); }
    finally { setEmotionLoading(false); }
  }, []);

  const fetchOps = useCallback(async (d: number) => {
    setOpsLoading(true);
    setOpsError(null);
    try { setOpsData(await getOperationsAnalytics({ days: d })); }
    catch (err: any) { setOpsError(err.message ?? 'Failed to load operations analytics.'); }
    finally { setOpsLoading(false); }
  }, []);

  useEffect(() => {
    fetchEmotion(days);
    fetchOps(days);
  }, [days, fetchEmotion, fetchOps]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const displayName  = firstNameFromEmail(email);

  const isLoading = tab === 'emotion' ? emotionLoading : opsLoading;
  const hasError  = tab === 'emotion' ? emotionError   : opsError;

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col bg-dots">

      {/* ── Header ── */}
      <header className="bg-[#f7f9fb]/90 backdrop-blur-md sticky top-0 z-50 header-bar relative">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-[1600px] mx-auto gap-3">
          <div className="flex items-center gap-4">
            <img
              alt="Rivr Bank Logo"
              className="h-12 md:h-14 w-auto max-w-[min(100%,14rem)] object-contain object-left"
              src="/rivr-bank-logo.png"
            />
            <div className="hidden md:flex flex-col border-l border-outline-variant/40 pl-4 -mt-0.5">
              <span className="font-bold text-sm leading-tight text-[#1e3a8a] tracking-tight">Analytics</span>
              <span className="text-slate-400 font-medium text-[0.65rem] tracking-widest uppercase">Agent Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/tickets')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all duration-150 active:scale-95 text-sm font-medium"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_back</span>
              <span className="hidden sm:inline">Support Queue</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-[#f2f4f6] rounded-full px-3 py-1.5 border border-outline-variant/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-xs font-medium text-on-surface-variant">Hi, {displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#1e3a8a] hover:bg-[#1e3a8a]/10 transition-all duration-150 active:scale-95 text-sm font-medium"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Page title + period filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#2dd4bf] flex items-center justify-center shadow-md shadow-[#1e3a8a]/20 flex-shrink-0">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '1.2rem' }}>analytics</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface tracking-tight">Analytics</h1>
              <p className="text-xs text-on-surface-variant">Operational and sentiment insights across all support interactions</p>
            </div>
          </div>

          {/* Period filter */}
          <div className="flex items-center gap-1 bg-[#f2f4f6] rounded-xl p-1 border border-outline-variant/20">
            {PERIODS.map(p => (
              <button
                key={p.days}
                onClick={() => setDays(p.days)}
                className={[
                  'px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-150',
                  days === p.days
                    ? 'bg-[#1e3a8a] text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/70',
                ].join(' ')}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 border-b border-outline-variant/20">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-150 border-b-2 -mb-px',
                tab === t.id
                  ? 'border-[#1e3a8a] text-[#1e3a8a]'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center py-32">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error */}
        {!isLoading && hasError && (
          <div className="flex flex-col items-center gap-4 py-24 text-center bg-white rounded-2xl border border-outline-variant/20 shadow-[0px_8px_28px_rgba(25,28,30,0.06)]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#ffdad6]">
              <span className="material-symbols-outlined text-[#ba1a1a] text-2xl">error</span>
            </div>
            <div>
              <p className="font-semibold text-on-surface">Failed to load analytics</p>
              <p className="text-sm text-on-surface-variant mt-1">{hasError}</p>
            </div>
            <Button id="analytics-retry-btn" variant="secondary" onClick={() => tab === 'emotion' ? fetchEmotion(days) : fetchOps(days)}>
              Try again
            </Button>
          </div>
        )}

        {/* Tab content */}
        {!isLoading && !hasError && (
          <>
            {tab === 'emotion' && emotionData && (
              <EmotionTab data={emotionData} days={days} onRetry={() => fetchEmotion(days)} />
            )}
            {tab === 'operations' && opsData && (
              opsData.ticket_summary.total === 0
                ? (
                  <div className="flex flex-col items-center gap-3 py-24 text-center bg-white rounded-2xl border border-outline-variant/20 shadow-[0px_8px_28px_rgba(25,28,30,0.06)]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f2f4f6]">
                      <span className="material-symbols-outlined text-on-surface-variant text-2xl">inbox</span>
                    </div>
                    <p className="font-semibold text-on-surface">No ticket data available for this period.</p>
                    <p className="text-sm text-on-surface-variant">Try expanding the date range or wait for more activity.</p>
                  </div>
                )
                : <OperationsTab data={opsData} days={days} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
