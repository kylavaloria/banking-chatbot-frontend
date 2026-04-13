import { AppShell } from '../components/layout/AppShell';
import { ChatWindow } from '../features/chat/ChatWindow';
import { ChatInput } from '../features/chat/ChatInput';
import { useChatSession } from '../features/chat/useChatSession';

export default function ChatbotPage() {
  const { messages, sessionId, isLoading, isLoadingHistory, error, send } = useChatSession();
  void sessionId;
  void error;

  return (
    <AppShell>
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">BFSI Support Assistant</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Online · AI-powered
            </p>
          </div>
        </div>

        {/* Messages */}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          isLoadingHistory={isLoadingHistory}
        />

        {/* Input */}
        <ChatInput onSend={send} isLoading={isLoading} />
      </div>
    </AppShell>
  );
}
