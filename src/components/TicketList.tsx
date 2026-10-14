import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Laptop, 
  User, 
  ShieldAlert,
  ChevronRight,
  Flame
} from 'lucide-react';
import { Ticket, TicketPriority, TicketStatus, TicketChannel } from '../types';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticket: Ticket) => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTickets = tickets.filter(ticket => {
    // Search filter
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'open' && (ticket.status === 'resolved' || ticket.status === 'closed')) return false;
      if (statusFilter !== 'open' && ticket.status !== statusFilter) return false;
    }

    // Channel filter
    if (channelFilter !== 'all' && ticket.channel !== channelFilter) return false;

    // Priority filter
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;

    return true;
  });

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'P1':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
            <Flame className="h-3 w-3 text-rose-400 animate-pulse" />
            P1 Critical
          </span>
        );
      case 'P2':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800">
            <AlertCircle className="h-3 w-3 text-amber-400" />
            P2 High
          </span>
        );
      case 'P3':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-950/80 text-blue-300 border border-blue-800">
            P3 Medium
          </span>
        );
      case 'P4':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            P4 Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800 uppercase tracking-wider">
            New Ticket
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-950/80 text-blue-300 border border-blue-800">
            In Progress
          </span>
        );
      case 'waiting_customer':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800">
            Waiting on User
          </span>
        );
      case 'escalated':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800 uppercase tracking-wider">
            Tier 2 Escalated
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
            Closed
          </span>
        );
    }
  };

  const getChannelIcon = (channel: TicketChannel) => {
    switch (channel) {
      case 'phone':
        return <span title="Phone Support Request"><Phone className="h-3.5 w-3.5 text-amber-400" /></span>;
      case 'email':
        return <span title="Email Ticket"><Mail className="h-3.5 w-3.5 text-blue-400" /></span>;
      case 'portal':
        return <span title="Self-Service Portal"><Globe className="h-3.5 w-3.5 text-emerald-400" /></span>;
      case 'chat':
        return <span title="IT Chat Bot / Slack"><MessageSquare className="h-3.5 w-3.5 text-purple-400" /></span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[750px] shadow-sm">
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Helpdesk Queue
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredTickets.length}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Auto-refresh: <span className="text-emerald-400 font-mono">10s</span>
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets, user, asset tag, issue..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'open', label: 'Open' },
            { id: 'new', label: 'New' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'escalated', label: 'Escalated' },
            { id: 'resolved', label: 'Resolved' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
          <select
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Channels (Phone/Email/Portal)</option>
            <option value="phone">Phone Calls Only</option>
            <option value="email">Email Intake Only</option>
            <option value="portal">Self-Service Portal Only</option>
            <option value="chat">Chat / Slack Only</option>
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Priorities (P1-P4)</option>
            <option value="P1">P1 - Critical</option>
            <option value="P2">P2 - High</option>
            <option value="P3">P3 - Medium</option>
            <option value="P4">P4 - Low</option>
          </select>
        </div>
      </div>

      {/* Ticket List Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-2 space-y-1.5">
        {filteredTickets.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Filter className="h-8 w-8 mx-auto mb-2 text-slate-600" />
            <p className="text-xs">No tickets match the selected filters.</p>
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const isSelected = ticket.id === selectedTicketId;
            const remainingMins = Math.max(0, ticket.sla.responseMinutesTarget - ticket.sla.responseMinutesElapsed);
            const isUrgent = remainingMins < 15 && ticket.status === 'new';

            return (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 ring-1 ring-cyan-500/30 shadow-md'
                    : 'bg-slate-950/60 hover:bg-slate-850 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Card Top Row: ID, Priority, Channel, Status */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {ticket.id}
                    </span>
                    <span className="p-1 rounded bg-slate-900 border border-slate-800">
                      {getChannelIcon(ticket.channel)}
                    </span>
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>

                {/* Card Title */}
                <h3 className="text-xs font-semibold text-slate-100 line-clamp-1 mb-1">
                  {ticket.title}
                </h3>

                {/* Customer Info & Asset */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="text-slate-300 font-medium truncate">{ticket.customer.name}</span>
                    {ticket.customer.isVip && (
                      <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        VIP
                      </span>
                    )}
                    <span className="text-slate-600">•</span>
                    <span className="truncate">{ticket.customer.department}</span>
                  </div>
                </div>

                {/* Bottom Row: SLA timer & Category */}
                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/60">
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                    {ticket.customer.assetTag}
                  </span>

                  <div className="flex items-center gap-1">
                    <Clock className={`h-3 w-3 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                    <span className={isUrgent ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {ticket.status === 'new'
                        ? `Response SLA: ${remainingMins}m left`
                        : `Assigned: ${ticket.assignedTo.split(' ')[0]}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
