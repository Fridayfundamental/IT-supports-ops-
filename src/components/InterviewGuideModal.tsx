import React from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  PhoneCall, 
  Clock, 
  Wrench, 
  ArrowUpRight, 
  ShieldCheck, 
  BookOpen, 
  MessageSquare, 
  Flame, 
  ExternalLink,
  ChevronRight,
  Headset
} from 'lucide-react';

interface InterviewGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const InterviewGuideModal: React.FC<InterviewGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const responsibilities = [
    {
      id: 'first_contact',
      title: '1. First Point of Contact (Phone & Email)',
      jobRequirement: 'Serve as the first point of contact for customers seeking technical assistance via phone or email.',
      appFeature: 'Multichannel Queue & Live Inbound Phone Simulator',
      talkingPoint: 'Demonstrates active listening, calm de-escalation under pressure, rapid caller identification, and prompt logging from phone/email into the system.',
      actionLabel: 'Test Inbound Phone Call',
      actionKey: 'simulate_call',
    },
    {
      id: 'monitoring',
      title: '2. Helpdesk Monitoring & Prompt Response',
      jobRequirement: 'Monitor the IT helpdesk and respond promptly to incoming technical support requests.',
      appFeature: 'Live KPI Dashboard & Unassigned Queue Alert',
      talkingPoint: 'Monitors real-time queue volume, average first-response times (4.2m vs 15m SLA), and flags unassigned tickets immediately to avoid customer delays.',
      actionLabel: 'View Active Queue',
      actionKey: 'view_queue',
    },
    {
      id: 'lifecycle',
      title: '3. Ticket Lifecycle Management',
      jobRequirement: 'Log, update, track, and manage helpdesk tickets accurately throughout the support lifecycle.',
      appFeature: 'Interactive 5-Stage Lifecycle Status Bar (New → In Progress → Waiting → Resolved → Closed)',
      talkingPoint: 'Strict adherence to incident management: every state transition has audit timestamps and ownership tracking to ensure accountability.',
      actionLabel: 'Inspect Ticket Lifecycle',
      actionKey: 'open_ticket',
    },
    {
      id: 'troubleshooting',
      title: '4. First-Line Troubleshooting & Runbooks',
      jobRequirement: 'Perform initial troubleshooting and provide first-line assistance for common technical issues.',
      appFeature: 'Interactive Diagnostic Runbooks with CLI commands (VPN, AD, Outlook, BSOD, Spooler)',
      talkingPoint: 'Step-by-step diagnostic workflows utilizing PowerShell & CMD commands (ipconfig /flushdns, gpupdate /force, net start spooler, DISM) to isolate root causes fast.',
      actionLabel: 'Open Diagnostic Runbook',
      actionKey: 'open_runbook',
    },
    {
      id: 'escalation',
      title: '5. Escalation to Specialized Teams',
      jobRequirement: 'Escalate complex or unresolved technical issues to the appropriate support team when necessary.',
      appFeature: 'Tier 2 Escalation Handover Matrix & Mandatory Checklist',
      talkingPoint: 'Knows when to escalate without wasting user time: bundles diagnostic logs, verifies business impact, and executes clean handover to Tier 2 Systems, Network Ops, or SecOps.',
      actionLabel: 'View Escalation Matrix',
      actionKey: 'open_escalation',
    },
    {
      id: 'sla',
      title: '6. Service Level Agreements (SLAs)',
      jobRequirement: 'Attend to and close helpdesk tickets within established Service Level Agreements (SLAs).',
      appFeature: 'Real-Time Dynamic SLA Timers (First Response & Resolution Targets)',
      talkingPoint: 'Proactive SLA management: visual warnings turn amber/red as targets approach, ensuring zero breached service agreements across P1 to P4 tiers.',
      actionLabel: 'Check SLA Timers',
      actionKey: 'view_sla',
    },
    {
      id: 'follow_up',
      title: '7. Customer Follow-up & Satisfaction (CSAT)',
      jobRequirement: 'Follow up with customers after ticket resolution to confirm that issues have been resolved satisfactorily.',
      appFeature: 'Post-Resolution Check-In Generator & CSAT Star Rating Simulator',
      talkingPoint: 'Closes the loop with the customer: sends post-fix confirmation emails, tracks 1-5 star CSAT feedback (98% satisfaction rating), and verifies satisfaction before closure.',
      actionLabel: 'Simulate CSAT Survey',
      actionKey: 'open_followup',
    },
    {
      id: 'documentation',
      title: '8. Clear & Accurate Documentation',
      jobRequirement: 'Maintain clear and accurate documentation of technical issues, troubleshooting steps, resolutions, and customer communication.',
      appFeature: 'Formal Incident Dossier & One-Click Knowledge Base SOP Generator',
      talkingPoint: 'Documents Root Cause, Actions Taken, and Preventative Advice, with one-click conversion into published Knowledge Base articles for the whole team.',
      actionLabel: 'Open Knowledge Base',
      actionKey: 'open_kb',
    },
    {
      id: 'communication',
      title: '9. Customer Progress Updates',
      jobRequirement: 'Keep customers informed about the status and progress of their support requests.',
      appFeature: 'Customer-Facing Emails vs Internal Technical Notes with Canned SOPs',
      talkingPoint: 'Translates complex technical details into friendly, transparent, and empathetic customer communication without overwhelming them with jargon.',
      actionLabel: 'View Communication Hub',
      actionKey: 'view_communication',
    },
    {
      id: 'prioritization',
      title: '10. ITIL Prioritization (Urgency × Impact)',
      jobRequirement: 'Prioritize tickets appropriately based on urgency, impact, and agreed service levels.',
      appFeature: 'Automated ITIL Matrix (Impact × Urgency = P1 to P4 Priority)',
      talkingPoint: 'Applies industry-standard ITIL frameworks: prioritizes department-wide outages and executive VIPs while maintaining predictable service for standard tickets.',
      actionLabel: 'Open Priority Calculator',
      actionKey: 'new_ticket',
    },
    {
      id: 'learning',
      title: '11. Continuous Learning & Technical Growth',
      jobRequirement: 'Continuously develop technical knowledge and troubleshooting skills through practical exposure, training, and guidance from experienced IT team members.',
      appFeature: 'Searchable IT SOP Library & AI Diagnostic Copilot',
      talkingPoint: 'Demonstrates curiosity and commitment to self-development by compiling technical cheat sheets, studying senior sysadmin SOPs, and leveraging AI to expand troubleshooting depth.',
      actionLabel: 'Browse SOP Articles',
      actionKey: 'open_kb',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/80 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Award className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Candidate Interview Showcase Guide
              </h3>
              <p className="text-xs text-indigo-200/80">
                Direct mapping of all 11 job responsibilities to live interactive features in this application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Introduction Banner */}
        <div className="px-5 py-3.5 bg-indigo-950/40 border-b border-indigo-900/40 text-xs text-indigo-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headset className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>
              <strong>How to use in your interview:</strong> Share your screen and walk the hiring manager through each responsibility. Click &quot;Test In App&quot; to demonstrate your practical technical knowledge!
            </span>
          </div>
        </div>

        {/* Responsibilities Grid */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          {responsibilities.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{item.title}</span>
                </h4>
                <button
                  onClick={() => {
                    onClose();
                    onSelectAction(item.actionKey);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm self-start sm:self-auto transition-all"
                >
                  <span>{item.actionLabel}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Job Requirement Quote */}
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                <strong className="text-slate-400 block mb-0.5">Job Requirement:</strong>
                <p className="italic text-slate-200">&quot;{item.jobRequirement}&quot;</p>
              </div>

              {/* Two columns: App Feature & Talking Point */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
                <div>
                  <span className="text-cyan-400 font-semibold block mb-0.5">Implemented Feature:</span>
                  <p className="text-slate-300">{item.appFeature}</p>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold block mb-0.5">Candidate Talking Point:</span>
                  <p className="text-slate-300 leading-relaxed">{item.talkingPoint}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Position: <strong className="text-slate-200">IT Support Specialist</strong> • 100% Responsibilities Covered
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            Ready to Present
          </button>
        </div>
      </div>
    </div>
  );
};
