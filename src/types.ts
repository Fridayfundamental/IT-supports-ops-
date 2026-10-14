export type TicketStatus =
  | 'new'
  | 'in_progress'
  | 'waiting_customer'
  | 'escalated'
  | 'resolved'
  | 'closed';

export type TicketPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TicketChannel = 'phone' | 'email' | 'portal' | 'chat';
export type TicketImpact = 'individual' | 'department' | 'organization';
export type TicketUrgency = 'low' | 'medium' | 'high' | 'critical';

export type TicketCategory =
  | 'Identity & Access'
  | 'Network & VPN'
  | 'Hardware & Peripherals'
  | 'Software & M365'
  | 'Operating System'
  | 'Security & Compliance';

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  assetTag: string;
  device: string;
  isVip?: boolean;
}

export interface TicketSLA {
  responseMinutesTarget: number;
  responseMinutesElapsed: number;
  responseBreached: boolean;
  resolutionMinutesTarget: number;
  resolutionMinutesElapsed: number;
  resolutionBreached: boolean;
  firstRespondedAt?: string;
  resolvedAt?: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  author: string;
  type: 'internal_note' | 'customer_email' | 'status_change' | 'sla_event' | 'escalation' | 'resolution' | 'phone_log';
  content: string;
}

export interface TroubleshootingStepRecord {
  id: string;
  timestamp: string;
  technician: string;
  actionTaken: string;
  result: 'passed' | 'failed' | 'inconclusive';
  notes?: string;
}

export interface EscalationRecord {
  timestamp: string;
  escalatedBy: string;
  targetTeam: 'Tier 2 Systems' | 'Network Operations' | 'SecOps & Compliance' | 'Hardware Logistics';
  reason: string;
  urgencyJustification: string;
  checklistPassed: boolean;
}

export interface ResolutionRecord {
  timestamp: string;
  resolvedBy: string;
  rootCause: string;
  resolutionSummary: string;
  preventativeAdvice: string;
  kbArticleId?: string;
}

export interface FollowUpRecord {
  sentAt: string;
  surveyRating?: number; // 1 to 5 stars
  customerFeedback?: string;
  confirmedResolved: boolean;
  notes?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  channel: TicketChannel;
  status: TicketStatus;
  priority: TicketPriority;
  impact: TicketImpact;
  urgency: TicketUrgency;
  category: TicketCategory;
  customer: CustomerProfile;
  sla: TicketSLA;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  activityLog: ActivityLogEntry[];
  troubleshootingSteps: TroubleshootingStepRecord[];
  escalationDetails?: EscalationRecord;
  resolutionDetails?: ResolutionRecord;
  customerFollowUp?: FollowUpRecord;
}

export interface RunbookStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  expectedResult: string;
  cliCommand?: string;
}

export interface TroubleshootingRunbook {
  id: string;
  category: TicketCategory;
  title: string;
  issueDescription: string;
  steps: RunbookStep[];
  commonRootCause: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: TicketCategory;
  symptoms: string;
  rootCause: string;
  resolutionSteps: string[];
  commandSnippets?: string[];
  author: string;
  updatedAt: string;
  views: number;
  helpfulCount: number;
}

export interface HelpdeskMetrics {
  openTickets: number;
  inProgress: number;
  unassigned: number;
  slaAtRisk: number;
  slaBreached: number;
  avgFirstResponseMin: number;
  firstContactResolutionRate: number;
  csatScore: number;
  resolvedToday: number;
}
