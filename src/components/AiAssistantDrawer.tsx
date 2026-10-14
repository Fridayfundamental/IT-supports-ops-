import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Terminal, 
  Copy, 
  Check, 
  AlertTriangle, 
  ArrowUpRight, 
  Mail, 
  Loader2 
} from 'lucide-react';
import { Ticket } from '../types';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTicket: Ticket | null;
  onInsertDraftIntoTicket?: (draft: string) => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  activeTicket,
  onInsertDraftIntoTicket,
}) => {
  if (!isOpen) return null;

  const [promptIssue, setPromptIssue] = useState(
    activeTicket
      ? `${activeTicket.title}\n\n${activeTicket.description}`
      : 'User reports Outlook keeps prompting for password every 10 minutes after corporate password reset.'
  );
  const [deviceContext, setDeviceContext] = useState(
    activeTicket ? `${activeTicket.customer.device} (${activeTicket.customer.assetTag})` : 'Windows 11 Enterprise'
  );
  const [loading, setLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [draftResult, setDraftResult] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleRunAiDiagnosis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeTicket?.title || 'User technical issue',
          description: promptIssue,
          category: activeTicket?.category || 'Software & M365',
          os: deviceContext,
          assetTag: activeTicket?.customer.assetTag || 'CORP-LT-TEST',
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setDiagnosticResult(data.analysis);
      }
    } catch (err) {
      console.error('AI diagnosis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDraftCustomerEmail = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/draft-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketTitle: activeTicket?.title || 'Support Request',
          customerName: activeTicket?.customer.name || 'Valued Colleague',
          updateType: type,
          internalNotes: promptIssue,
        }),
      });
      const data = await res.json();
      if (data.draft) {
        setDraftResult(data.draft);
      }
    } catch (err) {
      console.error('Draft error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCli = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-xs">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI IT Helpdesk Copilot</h3>
            <p className="text-[11px] text-slate-400">Powered by Gemini 3.8 Flash • Tier 1 Diagnostic Intelligence</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Ticket Context */}
        {activeTicket && (
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Currently Selected Ticket
            </span>
            <div className="font-semibold text-slate-200">{activeTicket.id}: {activeTicket.title}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {activeTicket.customer.name} ({activeTicket.customer.department}) • {activeTicket.category}
            </div>
          </div>
        )}

        {/* Input prompt */}
        <div>
          <label className="block text-slate-300 font-medium mb-1">
            Technical Problem Description:
          </label>
          <textarea
            rows={3}
            value={promptIssue}
            onChange={e => setPromptIssue(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-purple-500 resize-none font-sans"
            placeholder="Paste symptoms, user report, or error logs..."
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleRunAiDiagnosis}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold transition-all shadow-sm"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span>Diagnose &amp; Triage</span>
          </button>

          <button
            onClick={() => handleDraftCustomerEmail('investigating')}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold transition-all shadow-sm"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Draft Status Email</span>
          </button>
        </div>

        {/* Diagnostic Results */}
        {diagnosticResult && (
          <div className="space-y-3 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
            {/* ITIL Priority recommendation */}
            {diagnosticResult.itilPriorityRecommendation && (
              <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/60 text-purple-300">
                <span className="font-bold block text-[11px]">Recommended ITIL Priority:</span>
                <span className="text-slate-200">{diagnosticResult.itilPriorityRecommendation}</span>
              </div>
            )}

            {/* Root Cause Hypotheses */}
            {diagnosticResult.likelyRootCauses && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider">
                  Likely Root Causes:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {diagnosticResult.likelyRootCauses.map((rc: string, i: number) => (
                    <li key={i}>{rc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Tier 1 Steps */}
            {diagnosticResult.diagnosticSteps && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-cyan-400 block text-[11px] uppercase tracking-wider">
                  Tier 1 Diagnostic Checklist:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  {diagnosticResult.diagnosticSteps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Terminal Commands */}
            {diagnosticResult.suggestedCommands && diagnosticResult.suggestedCommands.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-400 block text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                  CLI &amp; PowerShell Commands:
                </span>
                {diagnosticResult.suggestedCommands.map((cmd: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 font-mono text-cyan-300"
                  >
                    <code className="truncate mr-2">{cmd}</code>
                    <button
                      onClick={() => copyCli(cmd)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1 shrink-0"
                    >
                      {copiedCmd === cmd ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Escalation Recommendation */}
            {diagnosticResult.escalationRecommendation && (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <span className="font-bold text-slate-400 block text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5 text-purple-400" />
                  Escalation Threshold:
                </span>
                <p className="mt-0.5 leading-relaxed">{diagnosticResult.escalationRecommendation}</p>
              </div>
            )}
          </div>
        )}

        {/* Draft Result */}
        {draftResult && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-900/60 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-300 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                AI Generated Customer Email Draft
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(draftResult);
                  alert('Draft copied to clipboard!');
                }}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Copy Draft
              </button>
            </div>
            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-sans">
              {draftResult}
            </p>
            {onInsertDraftIntoTicket && activeTicket && (
              <button
                onClick={() => onInsertDraftIntoTicket(draftResult)}
                className="w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
              >
                Insert Directly into Ticket Reply Box
              </button>
            )}
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Tier 1 Technical Guidance
        </span>
        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
