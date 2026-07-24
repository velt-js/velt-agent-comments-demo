// [Velt] Shared Permission Provider policy.
//
// Pure, framework-agnostic evaluation of a single Velt permission query. The
// request/response shapes are byte-identical whether the check is resolved:
//   - in the browser via the dev resolver (permissionProvider.resolvePermissions
//     in app/page.tsx) — used for local development, OR
//   - server-to-server via the Real-Time Permission Provider endpoint at
//     app/api/velt/check-permissions/route.ts — used in production.
// Keeping the policy here means both paths stay in lockstep.
//
// Velt asks us about four resource types (PermissionResourceType):
//   • organization → is the user in / granted this org? what role?
//   • folder       → is the user granted this folder? what role?
//   • document     → is the user granted this document? what role?
//   • context      → (only when permissionProvider.isContextEnabled === true)
//                    a FEATURE-LEVEL check. Velt sends one request per Access
//                    Context value (e.g. { catalogId: "catalog-apac" }); we answer
//                    whether the user may see that catalog's comments/notifications.
//
// All role + access data comes from components/velt/accessModel.ts so the JWT,
// this policy, and setDocuments can never drift apart.

import type {
  PermissionQuery,
  PermissionResult,
  UserPermissionAccessRole,
} from "@veltdev/types";
import { users } from "./users";
import {
  CATALOG_ACCESS_FIELD,
  getDocumentRole,
  getFolderRole,
  getOrgRole,
  hasCatalogAccess,
} from "./accessModel";

// @veltdev/types ships types only (no runtime JS), so enum members can't be
// referenced as values — cast our "viewer"/"editor" literals to the enum type.
function asAccessRole(role: "viewer" | "editor"): UserPermissionAccessRole {
  return role as UserPermissionAccessRole;
}

/**
 * Extract the Access Context field/value pairs from a context permission query.
 *
 * Velt sends the values two ways; we read whichever is present:
 *   - resource.context.access = { catalogId: "catalog-apac" }  (preferred), or
 *   - resource.id = '{"catalogId":"catalog-apac"}'             (JSON string fallback)
 */
function readContextAccess(
  query: PermissionQuery,
): Record<string, string | number> | null {
  const ctx = query.resource.context as
    | { access?: Record<string, unknown> }
    | undefined;

  if (ctx?.access && typeof ctx.access === "object") {
    const out: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(ctx.access)) {
      // setDocuments passes arrays, but each per-value context request carries a
      // single scalar. Normalize a 1-element array just in case.
      const scalar = Array.isArray(value) ? value[0] : value;
      if (typeof scalar === "string" || typeof scalar === "number") {
        out[key] = scalar;
      }
    }
    if (Object.keys(out).length > 0) return out;
  }

  // Fallback: resource.id is the JSON-encoded context object.
  try {
    const parsed = JSON.parse(query.resource.id) as Record<string, unknown>;
    const out: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" || typeof value === "number") {
        out[key] = value;
      }
    }
    return Object.keys(out).length > 0 ? out : null;
  } catch {
    return null;
  }
}

export function evaluatePermission(query: PermissionQuery): PermissionResult {
  const { userId, resource } = query;

  const deny: PermissionResult = {
    userId,
    resourceId: resource.id,
    type: resource.type,
    organizationId: resource.organizationId,
    hasAccess: false,
  };

  // Unknown user → deny everything.
  if (!users[userId]) return deny;

  switch (resource.type as string) {
    case "organization": {
      const role = getOrgRole(userId, resource.organizationId);
      if (!role) return deny;
      return { ...deny, hasAccess: true, accessRole: asAccessRole(role) };
    }

    case "folder": {
      const role = getFolderRole(userId, resource.id);
      if (!role) return deny;
      return { ...deny, hasAccess: true, accessRole: asAccessRole(role) };
    }

    case "document": {
      const role = getDocumentRole(userId, resource.id);
      if (!role) return deny;
      return { ...deny, hasAccess: true, accessRole: asAccessRole(role) };
    }

    case "context": {
      // Feature-level (Access Context) check. A user must have access to ALL
      // fields in the context to see the associated feature data. For this demo
      // the only field is `catalogId`, but we evaluate every field generically.
      const access = readContextAccess(query);
      if (!access) return deny;

      const allowed = Object.entries(access).every(([field, value]) => {
        if (field === CATALOG_ACCESS_FIELD) {
          return hasCatalogAccess(userId, String(value));
        }
        // Unknown context field → fail closed (deny) so we never over-grant.
        return false;
      });

      // Context results don't carry an accessRole — just allow/deny.
      return { ...deny, hasAccess: allowed };
    }

    default:
      return deny;
  }
}
