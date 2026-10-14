import React from 'react';
import { 
  Headset, 
  PhoneCall, 
  PlusCircle, 
  BookOpen, 
  Sparkles, 
  Award,
  CircleDot
} from 'lucide-react';

interface HeaderProps {
  onNewTicket: () => void;
  onOpenKB: () => void;
  onOpenInterviewGuide: () => void;
  onOpenAiDrawer: () => void;
  onSimulateCall: () => void;
  isCallRinging: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewTicket,
  onOpenKB,
  onOpenInterviewGuide,
  onOpenAiDrawer,
  onSimulateCall,
  isCallRinging,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/30">
              <Headset className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base lg:text-lg font-bold tracking-tight text-white">
                  IT Support Specialist Hub
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Tier 1 Desk Live
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Specialist: <strong className="text-slate-200">Candidate</strong></span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <CircleDot className="h-3 w-3 text-cyan-400" />
                  SLA Active Monitoring
                </span>
              </p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onOpenInterviewGuide}
              className="p-2 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-xs"
              title="Interview Presentation Guide"
            >
              <Award className="h-4 w-4" />
            </button>
            <button
              onClick={onNewTicket}
              className="p-2 rounded-lg bg-cyan-600 text-white font-medium text-xs shadow-sm"
              title="New Ticket"
            >
              <PlusCircle className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Incoming Call Simulator */}
          <button
            onClick={onSimulateCall}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isCallRinging
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 animate-bounce'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <PhoneCall className={`h-3.5 w-3.5 ${isCallRinging ? 'animate-spin' : 'text-amber-400'}`} />
            <span>{isCallRinging ? 'Incoming Call Ringing!' : 'Simulate Inbound Call'}</span>
          </button>

          {/* SOP Knowledge Base */}
          <button
            onClick={onOpenKB}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-400" />
            <span>Knowledge Base & SOPs</span>
          </button>

          {/* AI Copilot */}
          <button
            onClick={onOpenAiDrawer}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/60 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>AI IT Copilot</span>
          </button>

          {/* Interview Portfolio Showcase (Key feature for user's interview) */}
          <button
            onClick={onOpenInterviewGuide}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-950/50 ring-1 ring-indigo-400/40 transition-all"
          >
            <Award className="h-3.5 w-3.5 text-amber-300" />
            <span>Interview Showcase Guide</span>
          </button>

          {/* Create New Ticket */}
          <button
            onClick={onNewTicket}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/60 transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>+ Log Ticket</span>
          </button>
        </div>
      </div>
    </header>
  );
};
