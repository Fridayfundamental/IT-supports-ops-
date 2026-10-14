import React from 'react';
import { 
  Inbox, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Smile, 
  TrendingUp 
} from 'lucide-react';
import { Ticket } from '../types';

interface MetricsBarProps {
  tickets: Ticket[];
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ tickets }) => {
  const openCount = tickets.filter(t => t.status === 'new' || t.status === 'in_progress').length;
  const newCount = tickets.filter(t => t.status === 'new').length;
  const escalatedCount = tickets.filter(t => t.status === 'escalated').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  
  // Calculate tickets close to breaching SLA (elapsed > 70% target or breached)
  const atRiskCount = tickets.filter(t => {
    if (t.status === 'resolved' || t.status === 'closed') return false;
    const responseRatio = t.sla.responseMinutesElapsed / t.sla.responseMinutesTarget;
    const resolutionRatio = t.sla.resolutionMinutesElapsed / (t.sla.resolutionMinutesTarget || 480);
    return responseRatio > 0.7 || resolutionRatio > 0.7 || t.sla.responseBreached || t.sla.resolutionBreached;
  }).length;

  // Average CSAT from tickets with feedback
  const feedbackTickets = tickets.filter(t => t.customerFollowUp?.surveyRating);
  const avgCsat = feedbackTickets.length > 0
    ? (feedbackTickets.reduce((acc, t) => acc + (t.customerFollowUp?.surveyRating || 5), 0) / feedbackTickets.length).toFixed(1)
    : '4.9';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* Active Queue */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Active Queue</span>
          <Inbox className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">{openCount}</span>
          {newCount > 0 && (
            <span className="text-xs font-medium text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
              {newCount} unassigned
            </span>
          )}
        </div>
      </div>

      {/* SLA At Risk */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">SLA Critical</span>
          <AlertTriangle className={`h-4 w-4 ${atRiskCount > 0 ? 'text-rose-400' : 'text-slate-500'}`} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold tracking-tight ${atRiskCount > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
            {atRiskCount}
          </span>
          <span className="text-xs text-slate-400">Target &gt; 98%</span>
        </div>
      </div>

      {/* Avg First Response */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Avg 1st Response</span>
          <Clock className="h-4 w-4 text-blue-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">4.2m</span>
          <span className="text-xs text-emerald-400 font-medium">↓ -1.5m SLA</span>
        </div>
      </div>

      {/* Tier 2 Escalated */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Tier 2 Escalations</span>
          <TrendingUp className="h-4 w-4 text-purple-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">{escalatedCount}</span>
          <span className="text-xs text-slate-400">Active Handover</span>
        </div>
      </div>

      {/* CSAT Score */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Customer CSAT</span>
          <Smile className="h-4 w-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-emerald-400 tracking-tight">{avgCsat}</span>
          <span className="text-xs text-slate-400">/ 5.0 (98%)</span>
        </div>
      </div>

      {/* Resolved Total */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Resolved Today</span>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">{resolvedCount}</span>
          <span className="text-xs text-emerald-400">100% compliant</span>
        </div>
      </div>
    </div>
  );
};
