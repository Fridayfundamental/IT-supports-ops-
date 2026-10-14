import React, { useState } from 'react';
import { 
  X, 
  Smile, 
  Send, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Mail 
} from 'lucide-react';
import { Ticket, FollowUpRecord } from '../types';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onSaveFollowUp: (ticketId: string, record: FollowUpRecord) => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onSaveFollowUp,
}) => {
  if (!isOpen) return null;

  const [emailText, setEmailText] = useState(
    `Hi ${ticket.customer.name},\n\nWe recently resolved ticket ${ticket.id} regarding "${ticket.title}".\n\nCould you please reply to confirm that everything is functioning properly on your workstation? Your feedback helps us maintain the highest standard of IT support.\n\nThank you for your time,\nCandidate (IT Support Specialist)`
  );
  const [rating, setRating] = useState<number>(ticket.customerFollowUp?.surveyRating || 5);
  const [feedback, setFeedback] = useState<string>(
    ticket.customerFollowUp?.customerFeedback ||
    'Everything is working great now! Appreciate the fast response and clear troubleshooting instructions.'
  );
  const [confirmed, setConfirmed] = useState<boolean>(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const record: FollowUpRecord = {
      sentAt: new Date().toISOString(),
      surveyRating: rating,
      customerFeedback: feedback.trim() || undefined,
      confirmedResolved: confirmed,
      notes: `Follow-up verification completed with ${ticket.customer.name}. Customer gave ${rating}-star CSAT rating.`,
    };

    onSaveFollowUp(ticket.id, record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Smile className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Customer Follow-Up &amp; CSAT Verification</h3>
              <p className="text-[11px] text-slate-400">
                Ticket <span className="font-mono text-cyan-400">{ticket.id}</span> • {ticket.customer.name}
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
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Email Check-in Preview */}
          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-blue-400" />
              Follow-Up Check-in Message to Employee
            </label>
            <textarea
              rows={4}
              value={emailText}
              onChange={e => setEmailText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 resize-none font-sans"
            />
          </div>

          {/* Interactive CSAT Survey Simulator */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Simulate Customer Survey Response (CSAT)
              </span>
              <span className="text-xs font-semibold text-amber-400">
                {rating} of 5 Stars
              </span>
            </div>

            {/* Star selector */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Star
                    className={`h-6 w-6 transition-all ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Customer verbatim feedback */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">
                Customer Verbatim Comments:
              </label>
              <input
                type="text"
                placeholder="User comments on resolution quality and communication speed..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="accent-emerald-500 h-4 w-4 rounded"
              />
              <span className="text-slate-200 text-xs">
                Customer confirmed issue is 100% resolved satisfactorily (Close Ticket)
              </span>
            </label>
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
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-amber-950/50 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Log Confirmation &amp; Close Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
