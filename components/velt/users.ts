import type { User } from "@veltdev/types";
import { ORGS, accessModel } from "./accessModel";

// [Velt] Identity records for the demo users.
//
// These are the plain `User` objects passed to the SDK's auth provider (identity
// only — name/email/org). All ROLE and ACCESS information lives in
// components/velt/accessModel.ts, which is the single source of truth for the
// JWT resources, the Permission Provider policy, and setDocuments.
export const users: Record<string, User> = {
  user1: {
    userId: "user1",
    name: "User 1",
    email: "user1@example.com",
    organizationId: ORGS.OWNER,
  },
  user2: {
    userId: "user2",
    name: "User 2",
    email: "user2@example.com",
    organizationId: ORGS.CUSTOMER,
  },
  user3: {
    userId: "user3",
    name: "User 3",
    email: "user3@example.com",
    organizationId: ORGS.OWNER,
  },
  user4: {
    userId: "user4",
    name: "User 4",
    email: "user4@example.com",
    organizationId: ORGS.CUSTOMER,
  },
  user5: {
    userId: "user5",
    name: "User 5",
    email: "user5@example.com",
    organizationId: ORGS.OWNER,
  },
};

// Per-user `setDocuments` config consumed by VeltInitializeDocument and
// SeedAgentComments. Derived from the access model so it can never drift from
// the JWT resources or the Permission Provider policy.
//
// `organizationId` is only set when we intentionally subscribe cross-org (e.g.
// a customer-org-1 guest viewing a document that lives in owner-org-1), which
// makes the SDK ask the Permission Provider about the document in the target org.
export interface UserDocument {
  id: string;
  name: string;
}

export interface UserSetDocumentsConfig {
  documents: UserDocument[];
  organizationId?: string;
  folderId?: string;
  catalogs: string[];
}

export const setDocumentsConfigByUserId: Record<
  string,
  UserSetDocumentsConfig
> = Object.fromEntries(
  Object.values(accessModel).map((access) => [
    access.userId,
    {
      documents: access.setDocuments.documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
      })),
      organizationId: access.setDocuments.organizationId,
      folderId: access.setDocuments.folderId,
      catalogs: access.setDocuments.catalogs,
    },
  ]),
);
