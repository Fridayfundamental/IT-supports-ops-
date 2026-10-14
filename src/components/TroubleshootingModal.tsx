import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Terminal, 
  Copy, 
  Check, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Ticket, TroubleshootingStepRecord, RunbookStep } from '../types';
import { TROUBLESHOOTING_RUNBOOKS } from '../data/troubleshootingRunbooks';

interface TroubleshootingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onRecordStep: (ticketId: string, step: TroubleshootingStepRecord) => void;
}

export const TroubleshootingModal: React.FC<TroubleshootingModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onRecordStep,
}) => {
  if (!isOpen) return null;

  // Find matching runbook or fallback to default
  const runbook =
    TROUBLESHOOTING_RUNBOOKS.find(rb => rb.category === ticket.category) ||
    TROUBLESHOOTING_RUNBOOKS[0];

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [stepResult, setStepResult] = useState<'passed' | 'failed' | 'inconclusive'>('passed');
  const [stepNotes, setStepNotes] = useState('');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const currentStep: RunbookStep = runbook.steps[activeStepIdx] || runbook.steps[0];

  const copyCli = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleSaveStep = () => {
    const record: TroubleshootingStepRecord = {
      id: `step-${Date.now()}`,
      timestamp: new Date().toISOString(),
      technician: 'Candidate (IT Support Specialist)',
      actionTaken: `Step ${currentStep.stepNumber}: ${currentStep.title} - ${currentStep.instruction}`,
      result: stepResult,
      notes: stepNotes.trim() || undefined,
    };

    onRecordStep(ticket.id, record);
    setStepNotes('');

    // Advance to next step if available
    if (activeStepIdx < runbook.steps.length - 1) {
      setActiveStepIdx(prev => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Tier 1 Diagnostic Runbook</h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {runbook.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ticket: <span className="text-slate-200 font-medium">{ticket.id}</span> • {ticket.title}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Runbook Overview Banner */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="font-bold text-white text-xs mb-1">{runbook.title}</h4>
            <p className="text-slate-300 text-[11px] mb-2">{runbook.issueDescription}</p>
            <div className="text-[11px] text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-900/40 flex items-start gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span><strong>Common Root Cause:</strong> {runbook.commonRootCause}</span>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {runbook.steps.map((step, idx) => {
              const isCurrent = idx === activeStepIdx;
              const isPast = idx < activeStepIdx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm ring-2 ring-cyan-500/30'
                      : isPast
                      ? 'bg-slate-800 text-emerald-400 border-slate-700'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <span>Step {step.stepNumber}</span>
                  {isPast && <Check className="h-3 w-3" />}
                </button>
              );
            })}
          </div>

          {/* Active Step Diagnostic Workspace */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-cyan-400">
                Step {currentStep.stepNumber}: {currentStep.title}
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                {activeStepIdx + 1} of {runbook.steps.length}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">
                  Specialist Action Instructions:
                </span>
                <p className="text-slate-200 text-xs mt-0.5 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                  {currentStep.instruction}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">
                  Expected Diagnostic Outcome:
                </span>
                <p className="text-emerald-400 text-xs mt-0.5 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/40">
                  ✓ {currentStep.expectedResult}
                </p>
              </div>

              {/* CLI Command Snippet (if step includes terminal execution) */}
              {currentStep.cliCommand && (
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                    Recommended Terminal / PowerShell Command:
                  </span>
                  <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-cyan-300 text-xs">
                    <code className="truncate mr-2">{currentStep.cliCommand}</code>
                    <button
                      type="button"
                      onClick={() => copyCli(currentStep.cliCommand!)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 transition-colors shrink-0"
                    >
                      {copiedCommand === currentStep.cliCommand ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy CLI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Diagnostic Outcome Selector */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-slate-300 font-medium mb-1.5">
                Record Diagnostic Test Result:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'passed', label: 'Passed / Fixed', icon: CheckCircle2, color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40' },
                  { id: 'failed', label: 'Failed / Persists', icon: XCircle, color: 'text-rose-400 border-rose-800 bg-rose-950/40' },
                  { id: 'inconclusive', label: 'Inconclusive / Logged', icon: HelpCircle, color: 'text-amber-400 border-amber-800 bg-amber-950/40' },
                ].map(res => {
                  const Icon = res.icon;
                  const isSelected = stepResult === res.id;
                  return (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setStepResult(res.id as any)}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
                        isSelected
                          ? `${res.color} ring-2 ring-cyan-500/50`
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{res.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Diagnostic Notes */}
            <div>
              <label className="block text-slate-400 mb-1">
                Technician Observations & Log Notes:
              </label>
              <input
                type="text"
                placeholder="e.g. Ping latency 14ms; adapter renewed to 10.200.14.88; AnyConnect daemon started successfully."
                value={stepNotes}
                onChange={e => setStepNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors text-xs"
          >
            Close Runbook
          </button>

          <button
            type="button"
            onClick={handleSaveStep}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-950/50 transition-all text-xs"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Record Step &amp; Advance</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
