import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  FileCheck 
} from 'lucide-react';
import { Ticket, ResolutionRecord } from '../types';

interface ResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onConfirmResolution: (ticketId: string, record: ResolutionRecord, createKb: boolean) => void;
}

export const ResolutionModal: React.FC<ResolutionModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onConfirmResolution,
}) => {
  if (!isOpen) return null;

  const [rootCause, setRootCause] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [preventativeAdvice, setPreventativeAdvice] = useState('');
  const [publishToKb, setPublishToKb] = useState(false);

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootCause.trim() || !resolutionSummary.trim()) return;

    const record: ResolutionRecord = {
      timestamp: new Date().toISOString(),
      resolvedBy: 'Candidate (IT Support Specialist)',
      rootCause: rootCause.trim(),
      resolutionSummary: resolutionSummary.trim(),
      preventativeAdvice: preventativeAdvice.trim() || 'No special action required; standard operational reboot recommended periodically.',
      kbArticleId: publishToKb ? `KB-${Math.floor(5000 + Math.random() * 4000)}` : undefined,
    };

    onConfirmResolution(ticket.id, record, publishToKb);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Log Ticket Resolution &amp; Root Cause</h3>
              <p className="text-[11px] text-slate-400">
                Ticket <span className="font-mono text-cyan-400">{ticket.id}</span> • {ticket.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleResolve} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Technical Root Cause */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Technical Root Cause *
            </label>
            <textarea
              rows={2}
              required
              placeholder="What specifically caused this failure? (e.g. Cached bad NTLM hash in Windows Credential Manager, MTU packet size mismatch on VPN adapter)..."
              value={rootCause}
              onChange={e => setRootCause(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Action Taken */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Resolution Steps Executed (Action Summary) *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Summarize the troubleshooting steps and final action that restored normal service..."
              value={resolutionSummary}
              onChange={e => setResolutionSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Preventative Advice */}
          <div>
            <label className="block text-slate-400 mb-1">
              Preventative Guidance / Customer Education
            </label>
            <input
              type="text"
              placeholder="e.g. Advised user to restart computer once weekly and clear Outlook cache."
              value={preventativeAdvice}
              onChange={e => setPreventativeAdvice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Publish to KB Checkbox */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-slate-200 font-semibold block">Publish as Standard Operating Procedure</span>
                <span className="text-slate-400 text-[11px]">Convert this resolution into a searchable IT Knowledge Base article</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={publishToKb}
              onChange={e => setPublishToKb(e.target.checked)}
              className="accent-cyan-500 h-4 w-4 rounded cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!rootCause.trim() || !resolutionSummary.trim()}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all"
            >
              <FileCheck className="h-4 w-4" />
              <span>Resolve &amp; Close Within SLA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
