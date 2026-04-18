import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useChatSession } from '../features/chat/useChatSession';
import { ChatMessage } from '../features/chat/ChatMessage';
import { ChatInput } from '../features/chat/ChatInput';

function firstNameFromEmail(email: string | null): string {
  if (!email) return 'there';
  const local = email.split('@')[0] ?? '';
  const token = local.split(/[._-]/)[0] ?? local;
  if (!token) return 'there';
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

export default function ChatbotPage() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const { messages, isLoading, isLoadingHistory, send } = useChatSession();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = firstNameFromEmail(email);

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col bg-dots">
      {/* ── Top Nav ── */}
      <header className="bg-[#f7f9fb]/90 backdrop-blur-md sticky top-0 z-50 header-bar relative">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-5xl mx-auto gap-3">
          <div className="flex items-center gap-4">
            <img
              alt="Rivr Bank Logo"
              className="h-12 md:h-14 w-auto max-w-[min(100%,14rem)] object-contain object-left"
              src="/rivr-bank-logo.png"
            />
            <div className="hidden md:flex flex-col border-l border-outline-variant/40 pl-4 -mt-0.5">
              <span className="font-bold text-sm leading-tight text-[#1e3a8a] tracking-tight">
                Chat with Zeni
              </span>
              <span className="text-slate-400 font-medium text-[0.65rem] tracking-widest uppercase">
                Customer Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-surface-container-low rounded-full px-3 py-1.5 border border-outline-variant/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-xs font-medium text-on-surface-variant">
                Hi, {displayName}
              </span>
            </div>
            <button
              id="navbar-logout-btn"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#1e3a8a] hover:bg-[#1e3a8a]/10 transition-all duration-150 active:scale-95 text-sm font-medium"
            >
              <span
                className="material-symbols-outlined text-base"
                style={{ fontSize: '1.1rem' }}
              >
                logout
              </span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Chat Area ── */}
      <main
        className="chat-main flex-1 overflow-y-auto w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 relative"
        style={{ paddingBottom: 140 }}
      >
        {isLoadingHistory ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-on-surface-variant/70">
              <div className="w-6 h-6 border-2 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading conversation history…</span>
            </div>
          </div>
        ) : messages.length === 0 && !isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center px-8">
              <div className="zeni-ring w-16 h-16">
                <img
                  alt="Zeni AI Assistant"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJQ397LjRKMGaMUiYF5NhbKF5RRij3D4vYRoqu1Hu9jChnfMlP5OStuItdEshDHu3Ts6Qi6R6ApYNboHM9T0w7dbEGJBdWJP-sqWNxZT063f3nl2pLFMxQqX-C3PmEkpXINYLxLHBnsJgJDTdlwhl98Hq6u1Ru_NNbRZVs_pVrkqmEFnPdkXJ0atH6NEPgKTUz-hcALimDdyZyJob1FwW3laObOe8RMNXnYvHewn7hx1Lz1VeRCT0gLD9RCil9BIgn3cGf6AsQWxG9"
                />
              </div>
              <div>
                <p className="text-on-surface font-semibold text-lg">
                  How can Zeni help you today?
                </p>
                <p className="text-on-surface-variant text-sm mt-1">
                  Ask about your account, transactions, cards, or any banking issue.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="msg-bot flex justify-start w-full">
                <div className="flex items-center gap-2.5">
                  <div className="zeni-ring w-10 h-10 flex-shrink-0">
                    <img
                      alt="Zeni AI Assistant"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJQ397LjRKMGaMUiYF5NhbKF5RRij3D4vYRoqu1Hu9jChnfMlP5OStuItdEshDHu3Ts6Qi6R6ApYNboHM9T0w7dbEGJBdWJP-sqWNxZT063f3nl2pLFMxQqX-C3PmEkpXINYLxLHBnsJgJDTdlwhl98Hq6u1Ru_NNbRZVs_pVrkqmEFnPdkXJ0atH6NEPgKTUz-hcALimDdyZyJob1FwW3laObOe8RMNXnYvHewn7hx1Lz1VeRCT0gLD9RCil9BIgn3cGf6AsQWxG9"
                    />
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm border border-outline-variant/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline pulse-dot" />
                    <span className="w-1.5 h-1.5 rounded-full bg-outline pulse-dot" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-outline pulse-dot" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </main>

      {/* ── Input Bar ── */}
      <ChatInput onSend={send} isLoading={isLoading} />
    </div>
  );
}
