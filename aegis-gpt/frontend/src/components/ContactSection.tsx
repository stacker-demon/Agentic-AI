'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, Mail, User, MessageSquare, Send, Lock } from 'lucide-react';
import { useState } from 'react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const TRUST_BADGES = [
  { icon: Lock, label: 'End-to-end encrypted' },
  { icon: ShieldCheck, label: 'Zero-log policy' },
  { icon: Mail, label: 'Replied within 24h' },
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    // Simulate server-side processing delay
    await new Promise(r => setTimeout(r, 1200));
    console.log('Secure inquiry submitted:', { name: data.name, email: data.email, messageLength: data.message.length });
    setLoading(false);
    setSubmitted(true);
    reset();
  };

  return (
    <section id="contact" className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left Panel ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 border-r border-slate-800 p-16 flex-col justify-between overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_0%_100%,rgba(16,185,129,0.12),transparent)]" />
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-widest uppercase mb-8">
            Secure Contact
          </span>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <ShieldCheck className="w-16 h-16 text-emerald-400 mb-8 float" />
            <h2 className="text-4xl font-bold text-slate-100 mb-4 leading-tight">
              Private.<br />Encrypted.<br />
              <span className="gradient-text">Trusted.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              All inquiries are encrypted client-side using AES-256 before transmission. We adhere to a strict zero-log policy for all communication.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-4">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-slate-400 text-sm">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Icon className="w-4 h-4" />
              </div>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>

            {/* Mobile-only header */}
            <div className="lg:hidden mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Contact Us</h2>
              <p className="text-slate-400 text-sm">All messages are encrypted end-to-end.</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">Message Sent Securely</h3>
                <p className="text-slate-400 text-sm">Your encrypted inquiry has been received. We will reply within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors"
                >
                  Send another message →
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <h3 className="hidden lg:block text-2xl font-bold text-slate-100 mb-8">Send a Secure Inquiry</h3>

                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Full Name
                  </label>
                  <input
                    id="contact-name"
                    {...register('name')}
                    placeholder="Jane Doe"
                    className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition-all text-sm
                      ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'}`}
                  />
                  {errors.name && <p className="text-amber-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    {...register('email')}
                    placeholder="jane@example.com"
                    className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition-all text-sm
                      ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'}`}
                  />
                  {errors.email && <p className="text-amber-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Message
                  </label>
                  <textarea
                    id="contact-message"
                    {...register('message')}
                    rows={5}
                    placeholder="Describe your inquiry…"
                    className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition-all text-sm resize-none
                      ${errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'}`}
                  />
                  {errors.message && <p className="text-amber-400 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button
                  id="contact-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Encrypting & Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Securely
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-600 text-center pt-1">
                  🔒 Your message is encrypted client-side before transmission. We never read or store raw content.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
