import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  TicketStatus, 
  TroubleshootingStepRecord, 
  EscalationRecord, 
  ResolutionRecord, 
  FollowUpRecord, 
  KnowledgeBaseArticle,
  ActivityLogEntry
} from './types';
import { INITIAL_TICKETS } from './data/initialTickets';
import { INITIAL_KB_ARTICLES } from './data/knowledgeBase';

import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { TicketList } from './components/TicketList';
import { TicketDetail } from './components/TicketDetail';

import { NewTicketModal } from './components/NewTicketModal';
import { TroubleshootingModal } from './components/TroubleshootingModal';
import { EscalationModal } from './components/EscalationModal';
import { ResolutionModal } from './components/ResolutionModal';
import { FollowUpModal } from './components/FollowUpModal';
import { KnowledgeBaseModal } from './components/KnowledgeBaseModal';
import { InterviewGuideModal } from './components/InterviewGuideModal';
import { PhoneCallSimulator } from './components/PhoneCallSimulator';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(INITIAL_TICKETS[0].id);
  const [kbArticles, setKbArticles] = useState<KnowledgeBaseArticle[]>(INITIAL_KB_ARTICLES);

  // Modals & Drawers State
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [prefillNewTicket, setPrefillNewTicket] = useState<Partial<Ticket> | undefined>(undefined);
  const [isTroubleshootingOpen, setIsTroubleshootingOpen] = useState(false);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [isResolutionOpen, setIsResolutionOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isKbOpen, setIsKbOpen] = useState(false);
  const [isInterviewGuideOpen, setIsInterviewGuideOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isPhoneRinging, setIsPhoneRinging] = useState(false);

  // Selected ticket lookup
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  // Dynamic SLA tick effect (simulates real-time helpdesk monitoring)
  useEffect(() => {
    const interval = setInterval(() => {
      setTickets(prevTickets =>
        prevTickets.map(ticket => {
          if (ticket.status === 'closed' || ticket.status === 'resolved') {
            return ticket;
          }

          // Advance elapsed response time if not yet responded
          let newResponseElapsed = ticket.sla.responseMinutesElapsed;
          let newResponseBreached = ticket.sla.responseBreached;
          if (!ticket.sla.firstRespondedAt) {
            newResponseElapsed += 1;
            if (newResponseElapsed > ticket.sla.responseMinutesTarget) {
              newResponseBreached = true;
            }
          }

          // Advance elapsed resolution time
          const resolutionTarget = ticket.sla.resolutionMinutesTarget || 480;
          const newResolutionElapsed = ticket.sla.resolutionMinutesElapsed + 1;
          const newResolutionBreached = newResolutionElapsed > resolutionTarget;

          return {
            ...ticket,
            sla: {
              ...ticket.sla,
              responseMinutesElapsed: newResponseElapsed,
              responseBreached: newResponseBreached,
              resolutionMinutesElapsed: newResolutionElapsed,
              resolutionBreached: newResolutionBreached,
            },
          };
        })
      );
    }, 60000); // Ticks every minute in background

    return () => clearInterval(interval);
  }, []);

  // Handlers for Ticket Actions
  const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const now = new Date().toISOString();
        const updatedSla = { ...t.sla };

        // If transitioning away from 'new' for the first time, record SLA first response timestamp
        if (t.status === 'new' && newStatus !== 'new' && !updatedSla.firstRespondedAt) {
          updatedSla.firstRespondedAt = now;
        }

        const logEntry: ActivityLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: now,
          author: 'Candidate (IT Support Specialist)',
          type: 'status_change',
          content: `Lifecycle state moved from "${t.status.replace('_', ' ')}" to "${newStatus.replace('_', ' ')}".`,
        };

        return {
          ...t,
          status: newStatus,
          sla: updatedSla,
          updatedAt: now,
          activityLog: [...t.activityLog, logEntry],
        };
      })
    );
  };

  const handleAddActivityLog = (ticketId: string, log: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const updatedSla = { ...t.sla };
        if (!updatedSla.firstRespondedAt && log.type === 'customer_email') {
          updatedSla.firstRespondedAt = now;
        }

        return {
          ...t,
          sla: updatedSla,
          updatedAt: now,
          activityLog: [
            ...t.activityLog,
            {
              id: `log-${Date.now()}`,
              timestamp: now,
              ...log,
            },
          ],
        };
      })
    );
  };

  const handleCreateNewTicket = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
  };

  const handleRecordTroubleshootingStep = (ticketId: string, step: TroubleshootingStepRecord) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const logEntry: ActivityLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: now,
          author: step.technician,
          type: 'internal_note',
          content: `[Runbook Diagnostic ${step.result.toUpperCase()}] ${step.actionTaken}${
            step.notes ? `\nNotes: ${step.notes}` : ''
          }`,
        };

        return {
          ...t,
          updatedAt: now,
          troubleshootingSteps: [...t.troubleshootingSteps, step],
          activityLog: [...t.activityLog, logEntry],
        };
      })
    );
  };

  const handleConfirmEscalation = (ticketId: string, record: EscalationRecord) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const logEntry: ActivityLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: now,
          author: record.escalatedBy,
          type: 'escalation',
          content: `ESCALATED TO ${record.targetTeam.toUpperCase()}.\nReason: ${record.reason}\nUrgency: ${record.urgencyJustification}\nTier 1 Checklist: Passed`,
        };

        return {
          ...t,
          status: 'escalated',
          assignedTo: record.targetTeam,
          escalationDetails: record,
          updatedAt: now,
          activityLog: [...t.activityLog, logEntry],
        };
      })
    );
  };

  const handleConfirmResolution = (ticketId: string, record: ResolutionRecord, publishToKb: boolean) => {
    const now = new Date().toISOString();

    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const logEntry: ActivityLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: now,
          author: record.resolvedBy,
          type: 'resolution',
          content: `OFFICIAL RESOLUTION RECORDED.\nRoot Cause: ${record.rootCause}\nResolution Summary: ${record.resolutionSummary}\nPreventative Guidance: ${record.preventativeAdvice}`,
        };

        return {
          ...t,
          status: 'resolved',
          resolutionDetails: record,
          updatedAt: now,
          activityLog: [...t.activityLog, logEntry],
        };
      })
    );

    // If candidate opted to publish SOP to Knowledge Base
    if (publishToKb && selectedTicket) {
      const newKbArticle: KnowledgeBaseArticle = {
        id: record.kbArticleId || `KB-${Math.floor(5000 + Math.random() * 4000)}`,
        title: `SOP: ${selectedTicket.title}`,
        category: selectedTicket.category,
        symptoms: selectedTicket.description,
        rootCause: record.rootCause,
        resolutionSteps: [
          record.resolutionSummary,
          record.preventativeAdvice,
          'Verify normal operation with user before ticket sign-off.',
        ],
        author: 'Candidate (IT Support Specialist)',
        updatedAt: 'Just now',
        views: 1,
        helpfulCount: 0,
      };
      setKbArticles(prev => [newKbArticle, ...prev]);
    }
  };

  const handleSaveFollowUp = (ticketId: string, record: FollowUpRecord) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const logEntry: ActivityLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: now,
          author: 'Candidate (IT Support Specialist)',
          type: 'customer_email',
          content: `Follow-up completed with ${t.customer.name}.\nCSAT Rating: ${record.surveyRating || 5}/5 Stars.\nCustomer Feedback: "${record.customerFeedback || 'Verified resolved'}"`,
        };

        return {
          ...t,
          status: 'closed',
          customerFollowUp: record,
          updatedAt: now,
          activityLog: [...t.activityLog, logEntry],
        };
      })
    );
  };

  // Interview Guide quick actions dispatcher
  const handleInterviewAction = (actionKey: string) => {
    switch (actionKey) {
      case 'simulate_call':
        setIsPhoneRinging(true);
        break;
      case 'new_ticket':
        setPrefillNewTicket(undefined);
        setIsNewTicketOpen(true);
        break;
      case 'open_runbook':
        setIsTroubleshootingOpen(true);
        break;
      case 'open_escalation':
        setIsEscalationOpen(true);
        break;
      case 'open_resolution':
        setIsResolutionOpen(true);
        break;
      case 'open_followup':
        setIsFollowUpOpen(true);
        break;
      case 'open_kb':
        setIsKbOpen(true);
        break;
      case 'view_queue':
        window.scrollTo({ top: 300, behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Global Application Header */}
      <Header
        onNewTicket={() => {
          setPrefillNewTicket(undefined);
          setIsNewTicketOpen(true);
        }}
        onOpenKB={() => setIsKbOpen(true)}
        onOpenInterviewGuide={() => setIsInterviewGuideOpen(true)}
        onSimulateCall={() => setIsPhoneRinging(true)}
        onOpenAiDrawer={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        isCallRinging={isPhoneRinging}
      />

      {/* Real-time KPI Helpdesk Metrics Bar */}
      <MetricsBar tickets={tickets} />

      {/* Main Command Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Helpdesk Split View: Ticket Queue & Ticket Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Multichannel Ticket Queue (5 of 12 cols) */}
          <div className="lg:col-span-5 w-full">
            <TicketList
              tickets={tickets}
              selectedTicketId={selectedTicketId}
              onSelectTicket={ticket => setSelectedTicketId(ticket.id)}
            />
          </div>

          {/* Right Column: Ticket Lifecycle & Resolution Center (7 of 12 cols) */}
          <div className="lg:col-span-7 w-full">
            {selectedTicket ? (
              <TicketDetail
                ticket={selectedTicket}
                onUpdateTicketStatus={handleUpdateTicketStatus}
                onAddActivityLog={handleAddActivityLog}
                onOpenTroubleshooting={() => setIsTroubleshootingOpen(true)}
                onOpenEscalation={() => setIsEscalationOpen(true)}
                onOpenResolution={() => setIsResolutionOpen(true)}
                onOpenFollowUp={() => setIsFollowUpOpen(true)}
                onAskAi={() => setIsAiDrawerOpen(true)}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
                <p>Select a ticket from the queue to view details and execute troubleshooting.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer with Interview Ready Badge */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-3 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div>
          Built for <strong className="text-slate-300">IT Support Specialist Interview Presentation</strong> • Aligned with ITIL v4 &amp; Helpdesk SLAs
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsInterviewGuideOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 cursor-pointer"
          >
            Review 11 Job Responsibilities Checklist
          </button>
          <span>•</span>
          <button
            onClick={() => setIsKbOpen(true)}
            className="text-slate-400 hover:text-slate-200"
          >
            Standard Operating Procedures (SOPs)
          </button>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSaveTicket={handleCreateNewTicket}
        prefill={prefillNewTicket}
      />

      {selectedTicket && (
        <>
          <TroubleshootingModal
            isOpen={isTroubleshootingOpen}
            onClose={() => setIsTroubleshootingOpen(false)}
            ticket={selectedTicket}
            onRecordStep={handleRecordTroubleshootingStep}
          />

          <EscalationModal
            isOpen={isEscalationOpen}
            onClose={() => setIsEscalationOpen(false)}
            ticket={selectedTicket}
            onConfirmEscalation={handleConfirmEscalation}
          />

          <ResolutionModal
            isOpen={isResolutionOpen}
            onClose={() => setIsResolutionOpen(false)}
            ticket={selectedTicket}
            onConfirmResolution={handleConfirmResolution}
          />

          <FollowUpModal
            isOpen={isFollowUpOpen}
            onClose={() => setIsFollowUpOpen(false)}
            ticket={selectedTicket}
            onSaveFollowUp={handleSaveFollowUp}
          />
        </>
      )}

      <KnowledgeBaseModal
        isOpen={isKbOpen}
        onClose={() => setIsKbOpen(false)}
        articles={kbArticles}
        onAddArticle={article => setKbArticles(prev => [article, ...prev])}
      />

      <InterviewGuideModal
        isOpen={isInterviewGuideOpen}
        onClose={() => setIsInterviewGuideOpen(false)}
        onSelectAction={handleInterviewAction}
      />

      <PhoneCallSimulator
        isRinging={isPhoneRinging}
        onAccept={prefill => {
          setIsPhoneRinging(false);
          setPrefillNewTicket(prefill);
          setIsNewTicketOpen(true);
        }}
        onDecline={() => setIsPhoneRinging(false)}
      />

      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        activeTicket={selectedTicket}
        onInsertDraftIntoTicket={(draft) => {
          if (selectedTicket) {
            handleAddActivityLog(selectedTicket.id, {
              author: 'Candidate (IT Support Specialist)',
              type: 'customer_email',
              content: draft,
            });
            setIsAiDrawerOpen(false);
          }
        }}
      />
    </div>
  );
}
