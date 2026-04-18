import type { ChatMessage as ChatMessageType } from '../../types/chat.types';
import { TicketCards } from './TicketCard';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ZENI_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJQ397LjRKMGaMUiYF5NhbKF5RRij3D4vYRoqu1Hu9jChnfMlP5OStuItdEshDHu3Ts6Qi6R6ApYNboHM9T0w7dbEGJBdWJP-sqWNxZT063f3nl2pLFMxQqX-C3PmEkpXINYLxLHBnsJgJDTdlwhl98Hq6u1Ru_NNbRZVs_pVrkqmEFnPdkXJ0atH6NEPgKTUz-hcALimDdyZyJob1FwW3laObOe8RMNXnYvHewn7hx1Lz1VeRCT0gLD9RCil9BIgn3cGf6AsQWxG9';

const TICKET_RESPONSE_MODES = new Set([
  'ticket_confirmation',
  'critical_action_confirmation',
  'multi_issue_confirmation',
]);

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser   = message.sender === 'user';
  const isSystem = !isUser && message.responseMode === 'system-error';

  const showTickets =
    !isUser &&
    message.responseMode !== null &&
    TICKET_RESPONSE_MODES.has(message.responseMode) &&
    message.tickets && message.tickets.length > 0;

  // ── User bubble ─────────────────────────────────────────────────────────
  if (isUser) {
    return (
      <div className="msg-user flex justify-end w-full">
        <div className="max-w-[80%] md:max-w-[58%] flex flex-col items-end gap-1">
          <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white px-5 py-3.5 rounded-2xl rounded-br-sm shadow-md shadow-[#1e3a8a]/15 text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </div>
          <span className="text-[0.7rem] text-on-surface-variant/70 mt-0.5 pr-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  // ── Assistant (Zeni) bubble ─────────────────────────────────────────────
  return (
    <div className="msg-bot flex justify-start w-full">
      <div className="max-w-[88%] md:max-w-[72%] flex flex-col items-start gap-2.5">
        {/* Avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className="zeni-ring w-10 h-10 flex-shrink-0">
            <img
              alt="Zeni AI Assistant"
              className="w-full h-full object-cover"
              src={ZENI_AVATAR_URL}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-on-surface">Zeni</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[0.58rem] font-bold tracking-widest uppercase bg-[#d5e3fc] text-[#1e3a8a]">
              AI
            </span>
          </div>
        </div>

        {/* Bubble */}
        <div
          className={`
            px-5 py-3.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap
            ${isSystem
              ? 'bg-error-container text-on-error-container border border-error/30 shadow-sm'
              : 'bg-surface-container-lowest text-on-surface border border-outline-variant/20 shadow-sm'
            }
          `}
        >
          {message.text}
        </div>

        {/* Tickets */}
        {showTickets && (
          <TicketCards
            tickets={message.tickets!}
            responseMode={message.responseMode}
          />
        )}

        <span className="text-[0.7rem] text-on-surface-variant/70 pl-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
