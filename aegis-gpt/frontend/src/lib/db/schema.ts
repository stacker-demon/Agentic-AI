import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Audit Reports ────────────────────────────────────────────────────────────
export const auditReports = pgTable('audit_reports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size'), // in bytes
  sourceType: text('source_type').notNull().default('openai'), // openai | claude | gemini
  privacyScore: integer('privacy_score').notNull().default(100), // 0–100 (100 = fully safe)
  status: text('status').notNull().default('pending'), // pending | processing | completed | failed
  summary: jsonb('summary'), // { totalEntities, highRiskCount, mediumRiskCount, lowRiskCount }
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// ─── Detected Entities ────────────────────────────────────────────────────────
export const detectedEntities = pgTable('detected_entities', {
  id: serial('id').primaryKey(),
  reportId: integer('report_id')
    .references(() => auditReports.id, { onDelete: 'cascade' })
    .notNull(),
  entityType: text('entity_type').notNull(), // EMAIL_ADDRESS | PHONE_NUMBER | CREDIT_CARD | etc.
  riskLevel: text('risk_level').notNull(), // low | medium | high | critical
  anonymizedText: text('anonymized_text').notNull(), // e.g. "<EMAIL_ADDRESS>"
  // IMPORTANT: Raw PII is NEVER stored. Only the anonymized form.
  // originalTextHash stores a SHA-256 hash for deduplication purposes only.
  originalTextHash: text('original_text_hash'),
  presidioScore: integer('presidio_score'), // 0–100 confidence from Presidio
  conversationIndex: integer('conversation_index'), // Which conversation block it appeared in
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Inquiries (Contact Form) ─────────────────────────────────────────────────
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  // Encrypted with AES-256 before storage — raw message never persisted
  encryptedMessage: text('encrypted_message').notNull(),
  ipHash: text('ip_hash'), // SHA-256 hash of sender IP for abuse prevention
  status: text('status').notNull().default('unread'), // unread | read | archived
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Type exports ─────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AuditReport = typeof auditReports.$inferSelect;
export type NewAuditReport = typeof auditReports.$inferInsert;
export type DetectedEntity = typeof detectedEntities.$inferSelect;
export type NewDetectedEntity = typeof detectedEntities.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
