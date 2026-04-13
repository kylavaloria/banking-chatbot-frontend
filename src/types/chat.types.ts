export interface TicketDetail {
  ticket_id:  string;
  issue_type: string;
  status:     string;
  summary:    string;
}

export interface ChatMessage {
  id:           string;
  sender:       'user' | 'assistant';
  text:         string;
  responseMode: string | null;
  timestamp:    Date;
  tickets?:     TicketDetail[];
}

export interface SendMessageResponse {
  sessionId:    string;
  messageId:    string;
  reply:        string;
  responseMode: string;
  caseId:       string | null;
  ticketId:     string | null;
  ticketIds:    string[];
  tickets:      TicketDetail[];
}

export interface CreateSessionResponse {
  sessionId:     string;
  status:        string;
  currentCaseId: string | null;
  startedAt:     string;
}
