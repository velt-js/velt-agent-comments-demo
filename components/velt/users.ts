import type { User } from "@veltdev/types";

export const users: Record<string, User> = {
  user1: {
    userId: "user1",
    name: "User 1",
    email: "user1@example.com",
    organizationId: "owner-org-1",
  },
  user2: {
    userId: "user2",
    name: "User 2",
    email: "user2@example.com",
    organizationId: "customer-org-1",
  },
  user3: {
    userId: "user3",
    name: "User 3",
    email: "user3@example.com",
    organizationId: "owner-org-1",
  },
  user4: {
    userId: "user4",
    name: "User 4",
    email: "user4@example.com",
    organizationId: "customer-org-1",
  },
};

// Per-user `setDocuments` config used by VeltInitializeDocument.
//
// User 1 and User 3 are members of owner-org-1, so they land on the document
// scoped to their own org. User 2 and User 4 belong to `customer-org-1` but we
// scope setDocuments to owner-org-1 so the SDK asks the Permission Provider
// about the document cross-org — User 2 is granted access, User 4 is denied.
// See app/api/velt/check-permissions/route.ts for the policy.
export interface UserDocument {
  id: string;
  name: string;
}

export interface UserSetDocumentsConfig {
  documents: UserDocument[];
  organizationId?: string;
}

const ALTANA_DOCUMENTS: UserDocument[] = [
  { id: "altana-doc-100", name: "Altana Doc 100" },
];

export const setDocumentsConfigByUserId: Record<
  string,
  UserSetDocumentsConfig
> = {
  user1: {
    documents: ALTANA_DOCUMENTS,
  },
  user2: {
    documents: ALTANA_DOCUMENTS,
    organizationId: "owner-org-1",
  },
  user3: {
    documents: ALTANA_DOCUMENTS,
  },
  user4: {
    documents: ALTANA_DOCUMENTS,
    organizationId: "customer-org-1",
  },
};
