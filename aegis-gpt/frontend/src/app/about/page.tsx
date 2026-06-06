import type { Metadata } from 'next';
import AboutSection from '@/components/AboutSection';

export const metadata: Metadata = {
  title: 'About | AegisGPT — Data Sovereignty & Privacy-First AI',
  description: 'Learn how AegisGPT protects your privacy with zero-footprint AI auditing, Microsoft Presidio NLP, and local-first processing.',
};

export default function AboutPage() {
  return <AboutSection />;
}
