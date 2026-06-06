import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import AegisSentryBot from '@/components/AegisSentryBot';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'AegisGPT | AI Privacy Auditor & PII Detection',
  description:
    'Audit historical GPT data exports, detect PII leakage, and get real-time prompt sanitation advice. Zero-footprint. Privacy-first.',
  keywords: ['AI privacy', 'PII detection', 'GPT audit', 'data privacy', 'cybersecurity'],
  openGraph: {
    title: 'AegisGPT | AI Privacy Auditor',
    description: 'Audit your AI chat exports for PII leakage. Zero-footprint. Privacy-first.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-slate-950 text-slate-100 min-h-screen antialiased`}>
        {/* Ambient scan line effect */}
        <div className="scan-line" aria-hidden="true" />

        {/* Global Navbar */}
        <Navbar />

        {/* Page content — padded for fixed navbar */}
        <main className="pt-16">{children}</main>

        {/* Persistent AegisSentry bot — active on all pages */}
        <AegisSentryBot />
      </body>
    </html>
  );
}
