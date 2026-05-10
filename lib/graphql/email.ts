/**
 * Email module GraphQL ops — admin only.
 * Resolver lives at backend/src/modules/admin/email/email.resolver.ts.
 */

import { gql } from "@apollo/client";

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const GET_EMAIL_SETTING = gql`
  query GetEmailSetting {
    emailSetting {
      id
      mailer
      host
      port
      username
      encryption
      senderName
      senderEmail
      localDomain
      isConfigured
      hasPassword
      updatedAt
    }
  }
`;

export const UPDATE_EMAIL_SETTING = gql`
  mutation UpdateEmailSetting($input: UpdateEmailSettingInput!) {
    updateEmailSetting(input: $input) {
      id
      mailer
      host
      port
      username
      encryption
      senderName
      senderEmail
      localDomain
      isConfigured
      hasPassword
      updatedAt
    }
  }
`;

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export const GET_EMAIL_TEMPLATES = gql`
  query GetEmailTemplates {
    emailTemplates {
      id
      key
      name
      description
      category
      subject
      variables
      isEnabled
      isSystem
      updatedAt
    }
  }
`;

export const GET_EMAIL_TEMPLATE = gql`
  query GetEmailTemplate($id: ID!) {
    emailTemplate(id: $id) {
      id
      key
      name
      description
      category
      subject
      htmlBody
      textBody
      variables
      isEnabled
      isSystem
      updatedAt
    }
  }
`;

export const UPDATE_EMAIL_TEMPLATE = gql`
  mutation UpdateEmailTemplate($input: UpdateEmailTemplateInput!) {
    updateEmailTemplate(input: $input) {
      id
      key
      name
      description
      category
      subject
      htmlBody
      textBody
      variables
      isEnabled
      isSystem
      updatedAt
    }
  }
`;

// ---------------------------------------------------------------------------
// Send test
// ---------------------------------------------------------------------------

export const SEND_TEST_EMAIL = gql`
  mutation SendTestEmail($input: SendTestEmailInput!) {
    sendTestEmail(input: $input) {
      success
      message
    }
  }
`;
