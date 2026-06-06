'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, Cpu, Globe, Users, Database, Zap } from 'lucide-react';

const BENTO_ITEMS = [
  { id: 'sovereignty', col: 'md:col-span-2', icon: ShieldCheck, accent: 'emerald', title: 'Data Sovereignty', body: 'Your data is your property — unconditionally. Every audit runs on ephemeral, containerized pipelines that terminate immediately after analysis. Nothing is cached. Nothing is sold.', badge: 'Core Principle' },
  { id: 'zero-footprint', col: '', icon: Eye, accent: 'emerald', title: 'Zero-Footprint Design', body: 'AegisGPT never touches model training pipelines. Your prompts are audited and discarded — not learned from.', badge: 'Privacy' },
  { id: 'encryption', col: '', icon: Lock, accent: 'amber', title: 'AES-256 Encryption', body: 'All inquiries and reports are encrypted client-side before any network transmission. Keys never leave your device.', badge: 'Security' },
  { id: 'pipeline', col: 'md:col-span-2', icon: Cpu, accent: 'emerald', title: 'Microsoft Presidio + spaCy NLP Pipeline', body: 'Enterprise-grade NLP detects 50+ PII entity types — from SSNs to API keys — with sub-second latency. Backed by spaCy industrial-strength language models.', badge: 'Technology' },
  { id: 'local-first', col: '', icon: Database, accent: 'emerald', title: 'Local-First Processing', body: 'Your export files are processed in-memory within your infrastructure. No cloud upload required.', badge: 'Architecture' },
  { id: 'realtime', col: '', icon: Zap, accent: 'amber', title: 'Real-Time Audit', body: 'Instant feedback on draft prompts before you send them to any LLM. AegisSentry catches risks as you type.', badge: 'Feature' },
  { id: 'global', col: '', icon: Globe, accent: 'emerald', title: 'Multi-Platform Support', body: 'Parses exports from OpenAI, Claude, and Gemini. Supports JSON and CSV formats natively.', badge: 'Compatibility' },
  { id: 'team', col: 'md:col-span-2', icon: Users, accent: 'amber', title: 'Built by Security Researchers', body: "AegisGPT was designed by cybersecurity researchers and ML engineers who live at the intersection of AI capability and privacy law. You shouldn't have to choose between powerful AI tooling and data sovereignty.", badge: 'About Us' },
];

const ACCENT_STYLES = {
  emerald: { badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: 'text-emerald-400', hover: 'hover:border-emerald-500/40 hover:[box-shadow:0_0_30px_rgba(16,185,129,0.08)]' },
  amber: { badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: 'text-amber-400', hover: 'hover:border-amber-500/40 hover:[box-shadow:0_0_30px_rgba(245,158,11,0.08)]' },
};

const cardVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-widest uppercase mb-4">About AegisGPT</span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">We Put <span className="gradient-text">Data Sovereignty</span> First</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">In an era where AI systems routinely extract value from user data, AegisGPT is the safeguard that puts you back in control.</p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ staggerChildren: 0.08 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {BENTO_ITEMS.map(item => {
          const Icon = item.icon;
          const styles = ACCENT_STYLES[item.accent as keyof typeof ACCENT_STYLES];
          return (
            <motion.div
              key={item.id}
              id={`about-${item.id}`}
              variants={cardVariants}
              className={`group relative ${item.col} bg-slate-900 border border-slate-800 rounded-2xl p-7 transition-all duration-300 cursor-default ${styles.hover}`}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.04)_0%,_transparent_60%)]" />
              <div className="relative z-10 h-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-slate-800 ${styles.icon}`}><Icon className="w-5 h-5" /></div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide uppercase ${styles.badge}`}>{item.badge}</span>
                </div>
                <div className="mt-auto">
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.body}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
