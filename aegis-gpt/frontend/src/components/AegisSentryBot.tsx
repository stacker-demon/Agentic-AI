'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
  MessageSquare,
  ChevronRight,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { sanitizePromptRemote, type AuditResult } from '@/lib/botLogic';

const RISK_COLORS = {
  safe: { border: 'border-emerald-500/50', bg: 'bg-emerald-950/40', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400' },
  low: { border: 'border-emerald-600/50', bg: 'bg-emerald-950/30', text: 'text-emerald-500', badge: 'bg-emerald-600/20 text-emerald-500' },
  medium: { border: 'border-amber-500/50', bg: 'bg-amber-950/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400' },
  high: { border: 'border-amber-600/50', bg: 'bg-amber-950/40', text: 'text-amber-500', badge: 'bg-amber-600/20 text-amber-500' },
  critical: { border: 'border-red-500/50', bg: 'bg-red-950/40', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400' },
};

type ChatMessage =
  | { role: 'user'; text: string }
  | { role: 'bot'; result: AuditResult };

export default function AegisSentryBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  const handleAudit = async () => {
    if (!input.trim() || isAnalyzing) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsAnalyzing(true);

    try {
      const result = await sanitizePromptRemote(userText);
      setMessages(prev => [...prev, { role: 'bot', result }]);
    } catch (error) {
      console.error('Sentry Bot Error:', error);
    } finally {
      setIsAnalyzing(false);
      if (!isOpen) setUnreadCount(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAudit();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="w-[360px] rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '75vh' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
              <div className="relative">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">AegisSentry</h3>
                <p className="text-xs text-emerald-500">Real-Time PII Auditor • Online</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Close bot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 space-y-2"
                >
                  <Zap className="w-8 h-8 text-emerald-500/50 mx-auto" />
                  <p className="text-xs text-slate-400">
                    Paste any prompt you're about to send to an AI — I'll instantly scan it for PII and security risks.
                  </p>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-slate-800 text-slate-200 text-sm rounded-2xl rounded-br-sm px-4 py-2 max-w-[85%]">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <BotMessage result={msg.result} />
                  )}
                </motion.div>
              ))}

              {isAnalyzing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 px-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-emerald-500"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-slate-900/80 border-t border-slate-800 shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  id="aegis-bot-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder="Paste your prompt here… (Enter to audit)"
                  className="flex-1 resize-none bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all"
                />
                <button
                  onClick={handleAudit}
                  disabled={!input.trim() || isAnalyzing}
                  id="aegis-bot-submit"
                  className="shrink-0 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl p-2.5 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-1.5 text-center">
                Audited locally • Zero data transmitted • Not used for training
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Toggle Button */}
      <motion.button
        id="aegis-bot-toggle"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(o => !o)}
        className="relative bg-emerald-600 hover:bg-emerald-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors pulse-glow"
        aria-label="Open AegisSentry bot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="shield" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Shield className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}

// ─── Bot Message Card ─────────────────────────────────────────────────────────
function BotMessage({ result }: { result: AuditResult }) {
  const colors = RISK_COLORS[result.riskLevel];
  const Icon = result.safe ? ShieldCheck : ShieldAlert;

  return (
    <div className={`rounded-2xl rounded-bl-sm border ${colors.border} ${colors.bg} p-3 space-y-2`}>
      {/* Score bar + level */}
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 shrink-0 ${colors.text}`} />
        <span className={`text-xs font-semibold ${colors.text}`}>{result.message}</span>
      </div>

      {/* Score bar */}
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${result.safe ? 'bg-emerald-500' : result.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
          initial={{ width: 0 }}
          animate={{ width: `${result.score}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Finding badges */}
      {result.findings.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {result.findings.map((f, i) => (
            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
              {f.type.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Advice */}
      {result.advice && (
        <div className="flex gap-1.5 pt-1 border-t border-slate-700/50">
          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-snug">{result.advice}</p>
        </div>
      )}
    </div>
  );
}
