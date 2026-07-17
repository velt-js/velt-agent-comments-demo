// [Velt] Shared permission policy.
//
// Pure, framework-agnostic evaluation of a single Velt permission query. The
// request/response shapes are byte-identical whether the check is resolved:
//   - in the browser via the dev resolver (permissionProvider.resolvePermissions
//     in app/page.tsx) — used for local development, OR
//   - server-to-server via the Real-Time Permission Provider endpoint at
//     app/api/velt/check-permissions/route.ts — used in production.
// Keeping the policy here means both paths stay in lockstep.

import type {
  PermissionQuery,
  PermissionResult,
  UserPermissionAccessRole,
} from "@veltdev/types";
import { users } from "./users";

const ALLOWED_DOCUMENT_IDS = new Set(["altana-doc-7"]);

// @veltdev/types ships types only (no runtime JS), so enum members can't be
// referenced as values — cast string literals to the enum type instead.
const EDITOR = "editor" as UserPermissionAccessRole;

// Per-user access policy. Each entry says "for this user, in this org, what
// resource types are reachable". `organization: true` means the user has
// access to the org itself; the document entry gates access to the specific
// resources (still pinned to ALLOWED_DOCUMENT_IDS).
//
// User 1 and User 3 are full members of owner-org-1 with document access.
// User 2 belongs to customer-org-1 and is a guest on the documents inside
// owner-org-1. User 4 also belongs to customer-org-1 but has no document
// access on owner-org-1.
interface OrgPolicy {
  organization?: boolean;
  document?: boolean;
}

const accessPolicy: Record<string, Record<string, OrgPolicy>> = {
  user1: {
    "owner-org-1": { organization: true, document: true },
  },
  user2: {
    "customer-org-1": { organization: true },
    "owner-org-1": { organization: false, document: true },
  },
  user3: {
    "owner-org-1": { organization: true, document: true },
  },
  user4: {
    "customer-org-1": { organization: true },
    "owner-org-1": { organization: true, document: true },
  },
};

export function evaluatePermission(query: PermissionQuery): PermissionResult {
  const { userId, resource } = query;

  const deny: PermissionResult = {
    userId,
    resourceId: resource.id,
    type: resource.type,
    organizationId: resource.organizationId,
    hasAccess: false,
  };

  if (!users[userId]) return deny;

  const policy = accessPolicy[userId]?.[resource.organizationId];
  if (!policy) return deny;

  switch (resource.type as string) {
    case "organization":
      return policy.organization ? { ...deny, hasAccess: true } : deny;

    case "document":
      if (!policy.document) return deny;
      if (!ALLOWED_DOCUMENT_IDS.has(resource.id)) return deny;
      return { ...deny, hasAccess: true, accessRole: EDITOR };

    case "context":
      // Access Context isn't enabled in the frontend yet
      // (permissionProvider.isContextEnabled === false). If you flip it on,
      // inspect resource.context here to allow/deny per field.
      return { ...deny, hasAccess: true };

    default:
      return deny;
  }
}
