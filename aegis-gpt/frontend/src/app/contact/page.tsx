import type { Metadata } from 'next';
import ContactSection from '@/components/ContactSection';

export const metadata: Metadata = {
  title: 'Contact | AegisGPT — Secure Encrypted Inquiries',
  description: 'Contact the AegisGPT team securely. All messages are encrypted end-to-end before transmission.',
};

export default function ContactPage() {
  return <ContactSection />;
}
