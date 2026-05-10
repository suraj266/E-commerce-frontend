import { gql } from "@apollo/client";

export const NEWSLETTER_FIELDS = gql`
  fragment NewsletterFields on NewsletterSubscription {
    id
    email
    source
    status
    unsubscribedAt
    createdAt
    updatedAt
  }
`;

export const SUBSCRIBE_TO_NEWSLETTER = gql`
  mutation SubscribeToNewsletter($input: SubscribeNewsletterInput!) {
    subscribeToNewsletter(input: $input) {
      ok
      message
    }
  }
`;

export const GET_ADMIN_NEWSLETTER_SUBSCRIPTIONS = gql`
  ${NEWSLETTER_FIELDS}
  query GetAdminNewsletterSubscriptions(
    $status: NewsletterStatus
    $page: Int
    $pageSize: Int
    $search: String
  ) {
    adminNewsletterSubscriptions(
      status: $status
      page: $page
      pageSize: $pageSize
      search: $search
    ) {
      items {
        ...NewsletterFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const UNSUBSCRIBE_NEWSLETTER = gql`
  ${NEWSLETTER_FIELDS}
  mutation UnsubscribeNewsletter($id: ID!) {
    unsubscribeNewsletter(id: $id) {
      ...NewsletterFields
    }
  }
`;
