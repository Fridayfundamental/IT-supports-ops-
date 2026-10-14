import React, { useEffect, useState } from 'react';
import { PhoneCall, PhoneOff, User, Building, AlertCircle, Laptop } from 'lucide-react';
import { Ticket } from '../types';

interface PhoneCallSimulatorProps {
  isRinging: boolean;
  onAccept: (prefill: Partial<Ticket>) => void;
  onDecline: () => void;
}

export const PhoneCallSimulator: React.FC<PhoneCallSimulatorProps> = ({
  isRinging,
  onAccept,
  onDecline,
}) => {
  if (!isRinging) return null;

  // Realistic randomized caller scenario
  const callerScenarios = [
    {
      name: 'Victoria Hastings',
      dept: 'Corporate Treasury',
      phone: '+1 (555) 304-9921',
      title: 'Urgent: Wire Transfer Token Lockout - Banking Deadline in 30 Mins',
      description: 'Customer on phone: "Hello IT Support, my hardware RSA token and laptop login just froze with error \'Server unreachable\'. I have a 12:00 PM wire deadline for $1.4M to our vendor. Please help me unlock this immediately."',
      device: 'Dell Latitude 7420 (Win 11 Enterprise)',
      assetTag: 'CORP-LT-9021',
      category: 'Identity & Access' as const,
      urgency: 'critical' as const,
      impact: 'individual' as const,
      isVip: true,
    },
    {
      name: 'Robert Sterling',
      dept: 'Sales & Business Development',
      phone: '+1 (555) 489-1122',
      title: 'Conference Room 4A Display & Teams Audio Muted for Client Demo',
      description: 'Customer calling from meeting room: "We are with prospective enterprise clients in Room 4A. The HDMI connection to the wall TV is showing no signal, and Teams won\'t route through the ceiling mic."',
      device: 'Crestron Mercury / Surface Hub',
      assetTag: 'CORP-AV-104',
      category: 'Hardware & Peripherals' as const,
      urgency: 'high' as const,
      impact: 'department' as const,
      isVip: false,
    },
  ];

  const currentCaller = callerScenarios[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-200">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl p-4 shadow-2xl w-80 sm:w-96 text-xs text-slate-200 ring-4 ring-amber-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center animate-bounce">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Inbound Helpdesk Call Line #1
              </span>
              <h4 className="font-bold text-white text-sm">Incoming Call Ringing...</h4>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
            LIVE
          </span>
        </div>

        {/* Caller Dossier */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-cyan-400" />
              {currentCaller.name}
            </span>
            {currentCaller.isVip && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                VIP
              </span>
            )}
          </div>
          <p className="text-slate-400 text-[11px] flex items-center gap-1">
            <Building className="h-3 w-3 text-slate-500" />
            {currentCaller.dept} • {currentCaller.phone}
          </p>
          <p className="text-slate-300 text-[11px] italic bg-slate-900 p-2 rounded border border-slate-800">
            &quot;{currentCaller.title}&quot;
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onDecline}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 font-semibold transition-colors"
          >
            <PhoneOff className="h-3.5 w-3.5 text-rose-400" />
            <span>Send to Voicemail</span>
          </button>

          <button
            onClick={() => onAccept({
              channel: 'phone',
              title: currentCaller.title,
              description: currentCaller.description,
              category: currentCaller.category,
              urgency: currentCaller.urgency,
              impact: currentCaller.impact,
              customer: {
                name: currentCaller.name,
                email: `${currentCaller.name.toLowerCase().replace(' ', '.')}@corporate.org`,
                phone: currentCaller.phone,
                department: currentCaller.dept,
                location: 'HQ Floor 5 (Treasury)',
                assetTag: currentCaller.assetTag,
                device: currentCaller.device,
                isVip: currentCaller.isVip,
              },
            })}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-950/50 transition-all"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Answer &amp; Log Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
