export interface ChatMessage {
  id:           string;
  sender:       'user' | 'assistant';
  text:         string;
  responseMode: string | null;
  timestamp:    Date;
}

export interface SendMessageResponse {
  sessionId:    string;
  messageId:    string;
  reply:        string;
  responseMode: string;
  caseId:       string | null;
  ticketId:     string | null;
  ticketIds:    string[];
}

export interface CreateSessionResponse {
  sessionId:     string;
  status:        string;
  currentCaseId: string | null;
  startedAt:     string;
}
