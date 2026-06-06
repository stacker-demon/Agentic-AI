'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Upload,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const STATS = [
  { label: 'PII Types Detected', value: '50+' },
  { label: 'Privacy Score', value: '0–100' },
  { label: 'Data Footprint', value: 'Zero' },
  { label: 'Supported Platforms', value: '3' },
];

const FEATURES = [
  {
    icon: Upload,
    title: 'Import & Audit Exports',
    desc: 'Upload JSON or CSV exports from OpenAI, Claude, or Gemini. Our background worker parses every conversation block.',
    color: 'emerald',
  },
  {
    icon: ShieldAlert,
    title: 'PII Risk Detection',
    desc: 'Microsoft Presidio + spaCy identify emails, credentials, SSNs, financial data, and psychological markers automatically.',
    color: 'amber',
  },
  {
    icon: BarChart3,
    title: 'Privacy Score Dashboard',
    desc: 'Receive a weighted Privacy Score (0–100) with a full breakdown of entity types, risk levels, and remediation advice.',
    color: 'emerald',
  },
  {
    icon: ShieldCheck,
    title: 'Real-Time Prompt Guard',
    desc: 'AegisSentry audits your draft prompts before you send them — catching PII before it leaves your browser.',
    color: 'emerald',
  },
];

const RISK_DEMO = [
  { level: 'SAFE', score: 98, color: 'text-emerald-400', bar: 'bg-emerald-500', w: 'w-[98%]', example: 'Help me write a Python function to sort a list.' },
  { level: 'MEDIUM', score: 62, color: 'text-amber-400', bar: 'bg-amber-500', w: 'w-[62%]', example: 'My email is jane@corp.com. Can you draft a reply to...' },
  { level: 'CRITICAL', score: 8, color: 'text-red-400', bar: 'bg-red-500', w: 'w-[8%]', example: 'My SSN is 123-45-6789, credit card 4111 1111 1111 1111...' },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 grid-bg overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Privacy-First AI Auditor
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-100 mb-6 leading-tight tracking-tight"
          >
            Audit Your AI.<br />
            <span className="gradient-text">Protect Your Privacy.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AegisGPT scans your historical ChatGPT, Claude, and Gemini exports for PII leakage, security risks, and psychological data exposure — with zero footprint.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              id="hero-cta-primary"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              Start Free Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              id="hero-cta-secondary"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 font-semibold text-base transition-all duration-200"
            >
              Learn How It Works
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold gradient-text mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Risk Demo Section ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            See the Risk Score in Action
          </h2>
          <p className="text-slate-400">Every prompt gets an instant privacy score from 0–100.</p>
        </motion.div>

        <div className="space-y-5">
          {RISK_DEMO.map((item, i) => (
            <motion.div
              key={item.level}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-3 gap-4">
                <p className="text-sm text-slate-400 font-mono flex-1 leading-relaxed">
                  &quot;{item.example}&quot;
                </p>
                <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${
                  item.level === 'SAFE' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : item.level === 'MEDIUM' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-400'
                }`}>
                  {item.level}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${item.bar}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: item.w }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    style={{ width: undefined }}
                  />
                </div>
                <span className={`text-sm font-bold ${item.color} w-12 text-right`}>{item.score}/100</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Everything You Need to <span className="gradient-text">Stay Private</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                id={`feature-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group bg-slate-900 border border-slate-800 rounded-2xl p-8 transition-all duration-300 
                  ${feature.color === 'emerald' ? 'hover:border-emerald-500/40' : 'hover:border-amber-500/40'}`}
              >
                <div className={`p-3 rounded-xl inline-flex mb-5 ${feature.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/20 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(16,185,129,0.08),transparent)]" />
          <div className="relative z-10">
            <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Start Protecting Your Privacy Today
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of privacy-conscious users who audit their AI usage with AegisGPT.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {['No account required', 'Zero data retained', 'Open audit trail'].map(point => (
                <span key={point} className="flex items-center gap-1.5 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> {point}
                </span>
              ))}
            </div>
            <Link
              href="/contact"
              id="cta-banner-link"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/20"
            >
              Get Early Access <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>© {new Date().getFullYear()} AegisGPT. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
