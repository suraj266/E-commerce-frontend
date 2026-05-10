/**
 * Email module types — mirror backend GraphQL.
 */

export const EMAIL_MAILERS = ["SMTP"] as const;
export type EmailMailer = (typeof EMAIL_MAILERS)[number];

export const EMAIL_ENCRYPTIONS = ["NONE", "TLS", "SSL"] as const;
export type EmailEncryption = (typeof EMAIL_ENCRYPTIONS)[number];

export const EMAIL_TEMPLATE_CATEGORIES = [
  "SYSTEM",
  "AUTH",
  "ORDER",
  "SELLER",
  "ADMIN",
  "NEWSLETTER",
  "PARTIAL",
] as const;
export type EmailTemplateCategory = (typeof EMAIL_TEMPLATE_CATEGORIES)[number];

export const CATEGORY_LABEL: Record<EmailTemplateCategory, string> = {
  SYSTEM: "System",
  AUTH: "Auth",
  ORDER: "Order",
  SELLER: "Seller",
  ADMIN: "Admin",
  NEWSLETTER: "Newsletter",
  PARTIAL: "Partials",
};

export interface EmailSetting {
  id: string;
  mailer: EmailMailer;
  host: string;
  port: number;
  username: string;
  encryption: EmailEncryption;
  senderName: string;
  senderEmail: string;
  localDomain: string | null;
  isConfigured: boolean;
  hasPassword: boolean;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  description: string;
  category: EmailTemplateCategory;
  subject: string;
  htmlBody: string;
  textBody: string | null;
  variables: string[];
  isEnabled: boolean;
  isSystem: boolean;
  updatedAt: string;
}

export interface SendTestResult {
  success: boolean;
  message: string | null;
}

// ---- Inputs ----
export interface UpdateEmailSettingInput {
  mailer?: EmailMailer;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  encryption?: EmailEncryption;
  senderName?: string;
  senderEmail?: string;
  localDomain?: string;
}

export interface UpdateEmailTemplateInput {
  id: string;
  name?: string;
  description?: string;
  subject?: string;
  htmlBody?: string;
  textBody?: string;
  isEnabled?: boolean;
}

export interface SendTestEmailInput {
  to: string;
  templateKey?: string;
}

// ---- Apollo response shapes ----
export interface GetEmailSettingData {
  emailSetting: EmailSetting;
}
export interface UpdateEmailSettingData {
  updateEmailSetting: EmailSetting;
}
export interface GetEmailTemplatesData {
  emailTemplates: EmailTemplate[];
}
export interface GetEmailTemplateData {
  emailTemplate: EmailTemplate;
}
export interface UpdateEmailTemplateData {
  updateEmailTemplate: EmailTemplate;
}
export interface SendTestEmailData {
  sendTestEmail: SendTestResult;
}
