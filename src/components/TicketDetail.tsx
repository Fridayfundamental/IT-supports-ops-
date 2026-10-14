import React, { useState } from 'react';
import { 
  Ticket, 
  TicketStatus, 
  ActivityLogEntry 
} from '../types';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Send, 
  Wrench, 
  ArrowUpRight, 
  FileText, 
  User, 
  Laptop, 
  Phone, 
  Mail, 
  Sparkles, 
  HelpCircle, 
  MessageSquare, 
  Copy, 
  Check, 
  History, 
  Flame, 
  ShieldCheck,
  Tag
} from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onAddActivityLog: (ticketId: string, log: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  onOpenTroubleshooting: (ticket: Ticket) => void;
  onOpenEscalation: (ticket: Ticket) => void;
  onOpenResolution: (ticket: Ticket) => void;
  onOpenFollowUp: (ticket: Ticket) => void;
  onAskAi: (ticket: Ticket) => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({
  ticket,
  onUpdateTicketStatus,
  onAddActivityLog,
  onOpenTroubleshooting,
  onOpenEscalation,
  onOpenResolution,
  onOpenFollowUp,
  onAskAi,
}) => {
  const [activeTab, setActiveTab] = useState<'communication' | 'troubleshooting' | 'details'>('communication');
  const [noteType, setNoteType] = useState<'internal_note' | 'customer_email'>('customer_email');
  const [messageText, setMessageText] = useState('');
  const [copiedAsset, setCopiedAsset] = useState(false);

  // Quick Canned Responses for customer communication standards
  const cannedTemplates = [
    {
      label: '1st Contact SLA Ack',
      type: 'customer_email' as const,
      text: `Hi ${ticket.customer.name},\n\nThank you for reaching out to the IT Support Helpdesk. I have taken ownership of ticket ${ticket.id} regarding "${ticket.title}".\n\nI am currently reviewing your asset (${ticket.customer.assetTag}) and initiating diagnostic checks. I will provide you with a status update within the hour.\n\nBest regards,\nCandidate (IT Support Specialist)`,
    },
    {
      label: 'Triage / Logs Request',
      type: 'customer_email' as const,
      text: `Hi ${ticket.customer.name},\n\nDuring initial troubleshooting, we noticed intermittent connectivity. Could you please confirm if this issue occurs while connected to the corporate office Ethernet, or exclusively on Wi-Fi/remote connections?\n\nIf possible, please run a quick test and reply to this email.\n\nBest regards,\nIT Support Specialist`,
    },
    {
      label: 'Workaround Provided',
      type: 'customer_email' as const,
      text: `Hi ${ticket.customer.name},\n\nWe have applied an interim workaround for your account/system. Please reboot your workstation and attempt login again.\n\nWe are keeping this ticket in progress while monitoring stability.\n\nBest regards,\nIT Support Specialist`,
    },
    {
      label: 'Internal Tech Note',
      type: 'internal_note' as const,
      text: `Internal Tier 1 Note: Verified AD account status on DC01. Bad password count was 3. Tested gateway ping and flushed local DNS resolver cache. No network packet drops detected.`,
    },
  ];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    onAddActivityLog(ticket.id, {
      author: 'Candidate (IT Support Specialist)',
      type: noteType,
      content: messageText.trim(),
    });

    // If ticket was 'new' and specialist sends first customer response, auto-move to 'in_progress' to fulfill First Response SLA!
    if (ticket.status === 'new') {
      onUpdateTicketStatus(ticket.id, 'in_progress');
    }

    setMessageText('');
  };

  const copyAssetTag = () => {
    navigator.clipboard.writeText(ticket.customer.assetTag);
    setCopiedAsset(true);
    setTimeout(() => setCopiedAsset(false), 2000);
  };

  // Calculate SLA countdowns
  const responseRemaining = Math.max(0, ticket.sla.responseMinutesTarget - ticket.sla.responseMinutesElapsed);
  const resolutionRemaining = Math.max(0, (ticket.sla.resolutionMinutesTarget || 480) - ticket.sla.resolutionMinutesElapsed);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[750px] shadow-sm overflow-hidden">
      {/* Top Banner: Ticket ID, Title, Status Progression */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                {ticket.id}
              </span>
              <span className="text-xs text-slate-400">
                Category: <strong className="text-slate-200">{ticket.category}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                Channel: <span className="capitalize text-slate-300 font-medium">{ticket.channel}</span>
              </span>
            </div>
            <h2 className="text-base lg:text-lg font-bold text-white tracking-tight leading-snug">
              {ticket.title}
            </h2>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => onOpenTroubleshooting(ticket)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600/90 hover:bg-cyan-500 text-white shadow-sm transition-all"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Troubleshoot Runbook</span>
            </button>

            <button
              onClick={() => onAskAi(ticket)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800/80 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>AI Triage</span>
            </button>

            {ticket.status !== 'escalated' && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
              <button
                onClick={() => onOpenEscalation(ticket)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-all"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-purple-400" />
                <span>Escalate Tier 2</span>
              </button>
            )}

            {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
              <button
                onClick={() => onOpenResolution(ticket)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Resolve Ticket</span>
              </button>
            )}

            {(ticket.status === 'resolved' || ticket.status === 'closed') && (
              <button
                onClick={() => onOpenFollowUp(ticket)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/90 hover:bg-amber-500 text-white shadow-sm transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Customer Follow-Up & CSAT</span>
              </button>
            )}
          </div>
        </div>

        {/* Lifecycle Status Progression Bar */}
        <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between overflow-x-auto gap-2 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Support Lifecycle:
          </span>
          <div className="flex items-center gap-1.5 flex-1 min-w-[450px]">
            {[
              { id: 'new', label: '1. New / Inbound' },
              { id: 'in_progress', label: '2. In Progress' },
              { id: 'waiting_customer', label: '3. Waiting on User' },
              { id: 'escalated', label: 'Tier 2 Escalation' },
              { id: 'resolved', label: '4. Resolved' },
              { id: 'closed', label: '5. Closed' },
            ].map(step => {
              const isActive = ticket.status === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => onUpdateTicketStatus(ticket.id, step.id as TicketStatus)}
                  className={`flex-1 py-1 px-2 rounded text-[11px] font-medium text-center transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SLA Status & Customer Asset Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-800 bg-slate-950/40 text-xs divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Customer Profile */}
        <div className="p-3 flex items-start gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-slate-300 border border-slate-700">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white truncate">{ticket.customer.name}</span>
              {ticket.customer.isVip && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  VIP EXECUTIVE
                </span>
              )}
            </div>
            <p className="text-slate-400 text-[11px] truncate">{ticket.customer.department} • {ticket.customer.location}</p>
            <p className="text-slate-500 text-[10px] truncate">{ticket.customer.email} • {ticket.customer.phone}</p>
          </div>
        </div>

        {/* Device & Asset Details */}
        <div className="p-3 flex items-start gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-slate-300 border border-slate-700">
            <Laptop className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-400 font-bold">{ticket.customer.assetTag}</span>
              <button
                onClick={copyAssetTag}
                className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
                title="Copy Asset Tag"
              >
                {copiedAsset ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <p className="text-slate-300 text-[11px] truncate">{ticket.customer.device}</p>
            <p className="text-slate-500 text-[10px]">MDM Managed • BitLocker Enabled</p>
          </div>
        </div>

        {/* SLA Timers & Targets */}
        <div className="p-3 flex flex-col justify-center space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3 text-cyan-400" />
              1st Response SLA:
            </span>
            <span className={`font-mono font-bold ${responseRemaining < 10 && !ticket.sla.firstRespondedAt ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
              {ticket.sla.firstRespondedAt ? (
                <span className="text-emerald-400">✓ Met ({ticket.sla.responseMinutesElapsed}m)</span>
              ) : (
                `${responseRemaining}m remaining`
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-400" />
              Resolution SLA ({ticket.priority}):
            </span>
            <span className="font-mono font-bold text-slate-200">
              {ticket.status === 'resolved' || ticket.status === 'closed' ? (
                <span className="text-emerald-400">✓ Resolved ({ticket.sla.resolutionMinutesElapsed}m)</span>
              ) : (
                `${resolutionRemaining}m remaining`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-800 bg-slate-900 px-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('communication')}
          className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'communication'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Customer Communication & Audit Log</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
            {ticket.activityLog.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('troubleshooting')}
          className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'troubleshooting'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>Troubleshooting Steps Log</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
            {ticket.troubleshootingSteps.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'details'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Incident Details & Root Cause</span>
        </button>
      </div>

      {/* Tab 1: Communication & Activity Log */}
      {activeTab === 'communication' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Scrollable Conversation Timeline */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* User reported issue box */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-semibold text-slate-200">Original User Description</span>
                <span className="text-[11px] text-slate-500">
                  {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </p>
            </div>

            {/* Timeline Entries */}
            {ticket.activityLog.map(entry => {
              const isCustomerEmail = entry.type === 'customer_email';
              const isInternal = entry.type === 'internal_note';
              const isEscalation = entry.type === 'escalation';

              return (
                <div
                  key={entry.id}
                  className={`p-3 rounded-lg border text-xs leading-relaxed ${
                    isCustomerEmail
                      ? 'bg-blue-950/30 border-blue-800/60'
                      : isInternal
                      ? 'bg-amber-950/20 border-amber-800/40'
                      : isEscalation
                      ? 'bg-purple-950/30 border-purple-800/60'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200">{entry.author}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-mono font-medium ${
                        isCustomerEmail
                          ? 'bg-blue-900/60 text-blue-300'
                          : isInternal
                          ? 'bg-amber-900/60 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {entry.type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-slate-500">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap">{entry.content}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Canned Responses Bar */}
          <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/70 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              SOP Quick Inserts:
            </span>
            {cannedTemplates.map((template, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setNoteType(template.type);
                  setMessageText(template.text);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] whitespace-nowrap transition-colors"
              >
                {template.label}
              </button>
            ))}
          </div>

          {/* Send Input Area */}
          <div className="p-3 border-t border-slate-800 bg-slate-900">
            <div className="flex items-center gap-3 mb-2">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="noteType"
                  checked={noteType === 'customer_email'}
                  onChange={() => setNoteType('customer_email')}
                  className="accent-cyan-500"
                />
                <span className="text-slate-300 font-medium">Customer Email / Update</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="noteType"
                  checked={noteType === 'internal_note'}
                  onChange={() => setNoteType('internal_note')}
                  className="accent-amber-500"
                />
                <span className="text-amber-400 font-medium">Internal IT Diagnostic Note (Private)</span>
              </label>
            </div>

            <div className="flex gap-2">
              <textarea
                rows={2}
                placeholder={
                  noteType === 'customer_email'
                    ? `Reply to ${ticket.customer.name}... (Updates customer on status, next steps, and satisfies SLA)`
                    : 'Log internal technical diagnostics, commands run, or handover observations...'
                }
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Troubleshooting Steps Log */}
      {activeTab === 'troubleshooting' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Diagnostic Audit Trail ({ticket.troubleshootingSteps.length} Actions Recorded)
            </h3>
            <button
              onClick={() => onOpenTroubleshooting(ticket)}
              className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded shadow-sm"
            >
              <Wrench className="h-3 w-3" />
              <span>Launch Diagnostic Runbook</span>
            </button>
          </div>

          {ticket.troubleshootingSteps.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">No troubleshooting steps recorded yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Click &quot;Launch Diagnostic Runbook&quot; above to execute standard Tier 1 procedures.
              </p>
            </div>
          ) : (
            ticket.troubleshootingSteps.map((step, idx) => (
              <div key={step.id || idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">Step #{idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      step.result === 'passed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : step.result === 'failed'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {step.result}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-200 font-medium mb-1">{step.actionTaken}</p>
                {step.notes && (
                  <p className="text-slate-400 text-[11px] bg-slate-900 p-2 rounded border border-slate-800/80 font-mono">
                    Notes: {step.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Incident Details & Escalation/Resolution Dossier */}
      {activeTab === 'details' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Escalation Dossier if present */}
          {ticket.escalationDetails && (
            <div className="p-3.5 rounded-lg bg-purple-950/30 border border-purple-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <ArrowUpRight className="h-4 w-4 text-purple-400" />
                  Tier 2 Escalation Handover Dossier
                </span>
                <span className="text-slate-400 text-[11px]">
                  Target: <strong className="text-white">{ticket.escalationDetails.targetTeam}</strong>
                </span>
              </div>
              <p className="text-slate-300"><strong className="text-slate-400">Reason:</strong> {ticket.escalationDetails.reason}</p>
              <p className="text-slate-300"><strong className="text-slate-400">Urgency Justification:</strong> {ticket.escalationDetails.urgencyJustification}</p>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                <span>Tier 1 Handover Checklist Completed by {ticket.escalationDetails.escalatedBy}</span>
              </div>
            </div>
          )}

          {/* Resolution Dossier if present */}
          {ticket.resolutionDetails && (
            <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Official Resolution Record
                </span>
                <span className="text-slate-400 text-[11px]">
                  Resolved by: <strong className="text-white">{ticket.resolutionDetails.resolvedBy}</strong>
                </span>
              </div>
              <p className="text-slate-300"><strong className="text-slate-400">Root Cause:</strong> {ticket.resolutionDetails.rootCause}</p>
              <p className="text-slate-300"><strong className="text-slate-400">Summary:</strong> {ticket.resolutionDetails.resolutionSummary}</p>
              <p className="text-slate-300"><strong className="text-slate-400">Preventative Advice:</strong> {ticket.resolutionDetails.preventativeAdvice}</p>
            </div>
          )}

          {/* Customer Follow-Up CSAT if present */}
          {ticket.customerFollowUp && (
            <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  Customer Post-Resolution Feedback & CSAT
                </span>
                {ticket.customerFollowUp.surveyRating && (
                  <span className="text-amber-400 font-bold">
                    {'★'.repeat(ticket.customerFollowUp.surveyRating)}{'☆'.repeat(5 - ticket.customerFollowUp.surveyRating)}
                  </span>
                )}
              </div>
              {ticket.customerFollowUp.customerFeedback ? (
                <blockquote className="text-slate-300 italic border-l-2 border-amber-500 pl-2">
                  &quot;{ticket.customerFollowUp.customerFeedback}&quot;
                </blockquote>
              ) : (
                <p className="text-slate-400">Follow-up check email sent. Awaiting user survey response.</p>
              )}
            </div>
          )}

          {/* ITIL Prioritization Reference */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <h4 className="font-bold text-slate-300 mb-2">ITIL Prioritization Analysis</h4>
            <div className="grid grid-cols-2 gap-3 text-slate-400">
              <div>
                <span className="text-slate-500 block">Impact:</span>
                <span className="text-slate-200 capitalize font-medium">{ticket.impact} Scope</span>
              </div>
              <div>
                <span className="text-slate-500 block">Urgency:</span>
                <span className="text-slate-200 capitalize font-medium">{ticket.urgency} Business Impact</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
