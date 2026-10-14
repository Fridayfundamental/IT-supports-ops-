import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  AlertCircle, 
  Laptop, 
  User, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { 
  Ticket, 
  TicketChannel, 
  TicketCategory, 
  TicketImpact, 
  TicketUrgency, 
  TicketPriority 
} from '../types';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTicket: (ticket: Ticket) => void;
  prefill?: Partial<Ticket>;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  onSaveTicket,
  prefill,
}) => {
  if (!isOpen) return null;

  const [channel, setChannel] = useState<TicketChannel>(prefill?.channel || 'phone');
  const [title, setTitle] = useState(prefill?.title || '');
  const [description, setDescription] = useState(prefill?.description || '');
  const [category, setCategory] = useState<TicketCategory>(prefill?.category || 'Network & VPN');
  const [customerName, setCustomerName] = useState(prefill?.customer?.name || '');
  const [customerEmail, setCustomerEmail] = useState(prefill?.customer?.email || '');
  const [customerPhone, setCustomerPhone] = useState(prefill?.customer?.phone || '');
  const [department, setDepartment] = useState(prefill?.customer?.department || 'Operations');
  const [assetTag, setAssetTag] = useState(prefill?.customer?.assetTag || 'CORP-LT-' + Math.floor(1000 + Math.random() * 9000));
  const [device, setDevice] = useState(prefill?.customer?.device || 'Lenovo ThinkPad T14 (Win 11)');
  const [isVip, setIsVip] = useState(prefill?.customer?.isVip || false);
  const [impact, setImpact] = useState<TicketImpact>(prefill?.impact || 'individual');
  const [urgency, setUrgency] = useState<TicketUrgency>(prefill?.urgency || 'medium');

  // ITIL Matrix calculation: Impact x Urgency = Priority
  const calculatePriority = (imp: TicketImpact, urg: TicketUrgency): { priority: TicketPriority; responseTarget: number; resolutionTarget: number } => {
    if (imp === 'organization' || urg === 'critical' || (isVip && urg === 'high')) {
      return { priority: 'P1', responseTarget: 15, resolutionTarget: 120 }; // 15m response, 2h resolution
    }
    if (imp === 'department' || urg === 'high' || isVip) {
      return { priority: 'P2', responseTarget: 30, resolutionTarget: 240 }; // 30m response, 4h resolution
    }
    if (urg === 'medium') {
      return { priority: 'P3', responseTarget: 60, resolutionTarget: 480 }; // 1h response, 8h resolution
    }
    return { priority: 'P4', responseTarget: 120, resolutionTarget: 1440 }; // 2h response, 24h resolution
  };

  const { priority, responseTarget, resolutionTarget } = calculatePriority(impact, urgency);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !customerName.trim()) return;

    const newTicketId = `INC-${Math.floor(4100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const createdTicket: Ticket = {
      id: newTicketId,
      title: title.trim(),
      description: description.trim(),
      channel,
      status: 'new',
      priority,
      impact,
      urgency,
      category,
      customer: {
        name: customerName.trim(),
        email: customerEmail.trim() || `${customerName.toLowerCase().replace(/\s+/g, '.')}@corporate.org`,
        phone: customerPhone.trim() || '+1 (555) 019-2831',
        department,
        location: 'HQ Campus',
        assetTag: assetTag.trim(),
        device: device.trim(),
        isVip,
      },
      sla: {
        responseMinutesTarget: responseTarget,
        responseMinutesElapsed: 0,
        responseBreached: false,
        resolutionMinutesTarget: resolutionTarget,
        resolutionMinutesElapsed: 0,
        resolutionBreached: false,
      },
      assignedTo: 'Candidate (IT Support Specialist)',
      createdAt: now,
      updatedAt: now,
      activityLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: now,
          author: 'Candidate (IT Support Specialist)',
          type: channel === 'phone' ? 'phone_log' : 'status_change',
          content: `Initial intake logged via ${channel.toUpperCase()} support channel. Impact: ${impact}, Urgency: ${urgency}, Priority assigned: ${priority}.`,
        },
      ],
      troubleshootingSteps: [],
    };

    onSaveTicket(createdTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Laptop className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Log Technical Support Ticket</h3>
              <p className="text-[11px] text-slate-400">First contact intake (Phone / Email / Self-Service)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Intake Channel Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Inbound Support Channel (First Point of Contact)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'phone', label: 'Phone Call', icon: Phone },
                { id: 'email', label: 'Email Intake', icon: Mail },
                { id: 'portal', label: 'Web Portal', icon: Globe },
                { id: 'chat', label: 'Slack / Chat', icon: MessageSquare },
              ].map(ch => {
                const Icon = ch.icon;
                const isSelected = channel === ch.id;
                return (
                  <button
                    type="button"
                    key={ch.id}
                    onClick={() => setChannel(ch.id as TicketChannel)}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Dossier */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-cyan-400" />
                Customer & Machine Information
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVip}
                  onChange={e => setIsVip(e.target.checked)}
                  className="accent-amber-500 rounded"
                />
                <span className="text-amber-400 font-semibold text-[11px]">VIP / Executive Escalation</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Employee Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Jennifer Aniston"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g., Finance, Marketing, Executive"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Corporate Asset Tag</label>
                <input
                  type="text"
                  placeholder="CORP-LT-XXXX"
                  value={assetTag}
                  onChange={e => setAssetTag(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Device Model & OS</label>
                <input
                  type="text"
                  placeholder="Lenovo ThinkPad / MacBook Pro"
                  value={device}
                  onChange={e => setDevice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Issue Summary & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Ticket Summary / Issue Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g., Outlook cannot connect to Exchange after password change"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-medium focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Technical Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as TicketCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Identity & Access">Identity & Access (AD / Okta / MFA)</option>
                  <option value="Network & VPN">Network & VPN (AnyConnect / Wi-Fi)</option>
                  <option value="Hardware & Peripherals">Hardware & Peripherals (Dock / Monitor)</option>
                  <option value="Software & M365">Software & M365 (Teams / Outlook / Excel)</option>
                  <option value="Operating System">Operating System (BSOD / Windows Update)</option>
                  <option value="Security & Compliance">Security & Compliance (Phishing / Antivirus)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Customer Callback Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Detailed Symptoms & User Observations</label>
              <textarea
                rows={3}
                placeholder="Enter verbatim user quotes, exact error codes, and symptoms..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>

          {/* ITIL Prioritization Engine: Impact x Urgency = Priority */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                ITIL Priority Matrix & SLA Calculator
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                priority === 'P1'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : priority === 'P2'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : priority === 'P3'
                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                Assigned: {priority} Priority
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Business Impact Scope</label>
                <select
                  value={impact}
                  onChange={e => setImpact(e.target.value as TicketImpact)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="individual">Single Employee Affected</option>
                  <option value="department">Entire Team / Department Blocked</option>
                  <option value="organization">Organization-wide / Critical Service Down</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Time Urgency</label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value as TicketUrgency)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="low">Low - Workaround Available / Inquiry</option>
                  <option value="medium">Medium - Normal Business Operations</option>
                  <option value="high">High - Deadlines Approaching Soon</option>
                  <option value="critical">Critical - Business Paralyzed Immediately</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-cyan-400" />
                First Response SLA: <strong className="text-slate-200">{responseTarget} mins</strong>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-blue-400" />
                Target Resolution SLA: <strong className="text-slate-200">{resolutionTarget / 60} hours</strong>
              </span>
            </div>
          </div>

          {/* Form Actions */}
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
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-950/50 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Create &amp; Assign Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
