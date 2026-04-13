export interface TicketDetail {
  ticket_id:  string;
  case_id:    string;
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
  caseId?:      string | null;
  ticketId?:    string | null;
}

export interface MessageHistoryItem {
  message_id:    string;
  sender_type:   'user' | 'assistant' | 'system';
  message_text:  string;
  response_mode: string | null;
  case_id:       string | null;
  ticket_id:     string | null;
  created_at:    string;
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
