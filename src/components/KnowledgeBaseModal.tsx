import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  Terminal, 
  Copy, 
  Check, 
  ThumbsUp, 
  Eye, 
  Calendar, 
  User, 
  PlusCircle 
} from 'lucide-react';
import { KnowledgeBaseArticle, TicketCategory } from '../types';

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: KnowledgeBaseArticle[];
  onAddArticle?: (article: KnowledgeBaseArticle) => void;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
  articles,
  onAddArticle,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticleId, setSelectedArticleId] = useState<string>(articles[0]?.id || '');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const filteredArticles = articles.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const selectedArticle = articles.find(a => a.id === selectedArticleId) || filteredArticles[0];

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedSnippet(cmd);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">IT Standard Operating Procedures (SOP) &amp; Knowledge Base</h3>
              <p className="text-[11px] text-slate-400">Technical runbooks, CLI cheat-sheets, and continuous skills development</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Layout: Sidebar List + Article Body */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Column: Search & Article Selector */}
          <div className="w-full md:w-80 flex flex-col bg-slate-950/60 p-3 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search SOPs, commands, symptoms..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories ({articles.length})</option>
              <option value="Identity & Access">Identity &amp; Access</option>
              <option value="Network & VPN">Network &amp; VPN</option>
              <option value="Hardware & Peripherals">Hardware &amp; Peripherals</option>
              <option value="Software & M365">Software &amp; M365</option>
              <option value="Security & Compliance">Security &amp; Compliance</option>
            </select>

            {/* Articles List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredArticles.map(article => {
                const isSelected = article.id === selectedArticle?.id;
                return (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticleId(article.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-600 text-white'
                        : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-mono text-cyan-400 font-bold">{article.id}</span>
                      <span>{article.category}</span>
                    </div>
                    <h4 className="font-semibold line-clamp-2 leading-snug">{article.title}</h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Article Details */}
          <div className="flex-1 overflow-y-auto p-5 text-xs space-y-4">
            {selectedArticle ? (
              <>
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                    <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-bold">
                      {selectedArticle.id}
                    </span>
                    <span>{selectedArticle.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Updated {selectedArticle.updatedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {selectedArticle.views} views
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white tracking-tight leading-snug">
                    {selectedArticle.title}
                  </h2>
                </div>

                {/* Symptoms */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Observed Symptoms / Employee Reports:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedArticle.symptoms}</p>
                </div>

                {/* Root Cause */}
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Technical Root Cause Analysis:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedArticle.rootCause}</p>
                </div>

                {/* Resolution Steps */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Standard Resolution Protocol:
                  </span>
                  <ol className="space-y-2 list-decimal list-inside text-slate-300 leading-relaxed">
                    {selectedArticle.resolutionSteps.map((step, idx) => (
                      <li key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Command Snippets */}
                {selectedArticle.commandSnippets && selectedArticle.commandSnippets.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                      PowerShell &amp; Command Line Snippets:
                    </span>
                    <div className="space-y-1.5">
                      {selectedArticle.commandSnippets.map((cmd, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-xs"
                        >
                          <code className="truncate mr-2">{cmd}</code>
                          <button
                            onClick={() => copyCommand(cmd)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 shrink-0"
                          >
                            {copiedSnippet === cmd ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                <p>Select an article from the left to view details.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Author: <strong className="text-slate-200">{selectedArticle?.author || 'IT Helpdesk Lead'}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Close Knowledge Base
          </button>
        </div>
      </div>
    </div>
  );
};
