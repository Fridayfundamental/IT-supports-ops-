import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  CheckSquare, 
  Square, 
  Users, 
  ShieldAlert, 
  Server, 
  Network, 
  Cpu 
} from 'lucide-react';
import { Ticket, EscalationRecord } from '../types';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onConfirmEscalation: (ticketId: string, record: EscalationRecord) => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onConfirmEscalation,
}) => {
  if (!isOpen) return null;

  const [targetTeam, setTargetTeam] = useState<EscalationRecord['targetTeam']>('Tier 2 Systems');
  const [reason, setReason] = useState('');
  const [urgencyJustification, setUrgencyJustification] = useState('');

  // Handover checklist (mandatory for professional IT operations)
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(false);
  const [check4, setCheck4] = useState(true);

  const allChecklistPassed = check1 && check2 && check3 && check4;

  const handleEscalate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const record: EscalationRecord = {
      timestamp: new Date().toISOString(),
      escalatedBy: 'Candidate (IT Support Specialist)',
      targetTeam,
      reason: reason.trim(),
      urgencyJustification: urgencyJustification.trim() || 'Tier 1 troubleshooting scope exhausted; customer requires senior escalation.',
      checklistPassed: allChecklistPassed,
    };

    onConfirmEscalation(ticket.id, record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tier 2 Escalation Handover</h3>
              <p className="text-[11px] text-slate-400">
                Ticket <span className="font-mono text-cyan-400">{ticket.id}</span> • {ticket.customer.name} ({ticket.customer.department})
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
        <form onSubmit={handleEscalate} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Target Escalation Team */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Escalation Group / Support Tier
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Tier 2 Systems', label: 'Tier 2 Systems (Active Directory / OS / Servers)', icon: Server },
                { id: 'Network Operations', label: 'Network Operations (Firewall / VPN / DNS)', icon: Network },
                { id: 'SecOps & Compliance', label: 'SecOps & InfoSec (Phishing / Compromise)', icon: ShieldAlert },
                { id: 'Hardware Logistics', label: 'Hardware Depot / RMA (Motherboard / Swap)', icon: Cpu },
              ].map(team => {
                const Icon = team.icon;
                const isSelected = targetTeam === team.id;
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => setTargetTeam(team.id as any)}
                    className={`flex items-start gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-purple-950/70 border-purple-600 text-purple-200 ring-2 ring-purple-600/30 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{team.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason for Escalation */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Detailed Technical Escalation Reason *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detail the exact root cause hypotheses, error codes discovered, and why this exceeds Tier 1 scope (e.g. requires domain admin permissions or kernel debugging)..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Business Urgency */}
          <div>
            <label className="block text-slate-400 mb-1">
              Business Urgency Justification / Deadlines
            </label>
            <input
              type="text"
              placeholder="e.g. Employee presenting quarterly board meeting at 2:00 PM; no loaner machine available."
              value={urgencyJustification}
              onChange={e => setUrgencyJustification(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Handover Checklist */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Tier 1 Handover Checklist (Best Practices)
            </span>

            {[
              { checked: check1, setChecked: setCheck1, text: 'Verified customer identity and recorded accurate asset tag.' },
              { checked: check2, setChecked: setCheck2, text: 'Attempted first-line diagnostic runbook steps without resolution.' },
              { checked: check3, setChecked: setCheck3, text: 'Attached diagnostic logs (Event Viewer / Minidump / CLI output).' },
              { checked: check4, setChecked: setCheck4, text: 'Informed customer that ticket has been transferred to specialized tier.' },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => item.setChecked(!item.checked)}
                className="flex items-center gap-2 cursor-pointer text-slate-300 select-none py-0.5"
              >
                {item.checked ? (
                  <CheckSquare className="h-4 w-4 text-purple-400 shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-slate-600 shrink-0" />
                )}
                <span className={item.checked ? 'text-slate-200' : 'text-slate-500'}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
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
              disabled={!reason.trim()}
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-purple-950/50 transition-all"
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>Confirm Escalation Handover</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
