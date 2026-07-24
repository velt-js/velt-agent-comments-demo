// [Velt] Access model — the single source of truth for this demo.
//
// The customer's stack layers many Velt access-control features together:
//   • Real-Time Permission Provider with `isContextEnabled: true`
//   • Access Context (`context.access.catalogId`) filtering comments + notifications
//   • viewer / editor roles
//   • `defaultDocumentAccessType: organizationPrivate` (a Console setting)
//   • Folders (JWT folder resources + `setDocuments({ folderId })`)
//   • Private comments (beta)
//
// To keep every layer consistent, this file is the ONE place that describes,
// per user:
//   1. `jwtResources`  → the exact `permissions.resources[]` we mint into the JWT
//      (app/api/velt/token/route.ts). This is where viewer/editor roles are assigned.
//   2. `orgRoles` / `folderRoles` / `documentRoles` → what the Permission Provider
//      (components/velt/permissions.ts) answers for organization/folder/document checks.
//   3. `catalogAccess` → which Access Context (`catalogId`) values the user may see;
//      the Permission Provider uses this to answer `type: "context"` checks.
//   4. `setDocuments` → the documents, folder, org, and catalogs we subscribe to
//      (components/velt/VeltInitializeDocument.tsx).
//
// The JWT (identity + resource roles) and the Permission Provider (real-time
// resource + context checks) are DELIBERATELY kept in lockstep here so the demo
// behaves like the customer's app, where the same backend is the source of truth
// for both.

// ---------------------------------------------------------------------------
// Resource hierarchy: Organization → Folder → Document
// ---------------------------------------------------------------------------

export const ORGS = {
  /** Altana's own tenant — documents live here. */
  OWNER: "owner-org-1",
  /** External customer org — used for cross-org / guest access. */
  CUSTOMER: "customer-org-1",
} as const;

export const FOLDERS = {
  /** Holds the Side Letter document rendered by the demo viewer. */
  MANUFACTURING: "folder-manufacturing",
  /** A second folder used to demonstrate folder-scoped grants. */
  LEGAL: "folder-legal",
} as const;

export interface DemoDocument {
  id: string;
  name: string;
  folderId: string;
}

// The demo viewer renders one page (altana-doc-7). The second document is a
// logical Velt document used to exercise folder scoping; it does not need its
// own visible page for the access-control demo.
export const DOCUMENTS = {
  SIDE_LETTER: {
    id: "altana-doc-7",
    name: "Commercial Manufacturing & Supply Agreement",
    folderId: FOLDERS.MANUFACTURING,
  },
  LEGAL_MEMO: {
    id: "altana-doc-legal",
    name: "Indemnification Provisions Memo",
    folderId: FOLDERS.LEGAL,
  },
} as const satisfies Record<string, DemoDocument>;

// ---------------------------------------------------------------------------
// Access Context dimension: multi-catalog tenants.
//
// The customer tags every comment with `context.access.catalogId` and relies on
// `isContextEnabled: true` so Velt asks the Permission Provider whether the user
// may see each catalog's feature data (comments AND notifications). We model two
// catalogs so we can show a user seeing one but not the other.
// ---------------------------------------------------------------------------

export const CATALOG_ACCESS_FIELD = "catalogId" as const;

export interface Catalog {
  id: string;
  name: string;
}

export const CATALOGS: Catalog[] = [
  { id: "catalog-apac", name: "APAC catalog" },
  { id: "catalog-emea", name: "EMEA catalog" },
];

export const DEFAULT_CATALOG_ID = CATALOGS[0].id;

// ---------------------------------------------------------------------------
// Roles + JWT resource shapes
// ---------------------------------------------------------------------------

export type AccessRole = "viewer" | "editor";

/**
 * A single entry in the JWT's `permissions.resources[]` array.
 * `organizationId` is required by the Velt API for `folder`/`document` resources.
 * `accessRole` defaults to `editor` on the Velt side when omitted.
 */
export interface VeltJwtResource {
  type: "organization" | "folder" | "document";
  id: string;
  organizationId?: string;
  accessRole?: AccessRole;
}

export interface UserAccess {
  userId: string;
  /** Human-readable note shown in the UI + Debug Panel. */
  purpose: string;
  /** Exact JWT resources minted for this user (identity token). */
  jwtResources: VeltJwtResource[];
  /** Organization roles the Permission Provider should report. */
  orgRoles: Record<string, AccessRole>;
  /** Folder roles the Permission Provider should report. */
  folderRoles: Record<string, AccessRole>;
  /** Document roles the Permission Provider should report. */
  documentRoles: Record<string, AccessRole>;
  /**
   * Access Context values (catalogIds) this user is ALLOWED to see. This is the
   * Permission Provider's answer for `type: "context"` checks — the authority on
   * visibility. It is deliberately separate from what we *subscribe* to below.
   */
  catalogAccess: string[];
  /** What we subscribe to via setDocuments for this user. */
  setDocuments: {
    documents: DemoDocument[];
    /** Optional folder scope for the subscription. */
    folderId?: string;
    /** Optional org override (used for cross-org subscriptions). */
    organizationId?: string;
    /**
     * Catalog values passed as `context.access.catalogId` (arrays → 1 request
     * each). We subscribe to ALL catalogs whose comments live in the document
     * (see DOCUMENT_CATALOG_IDS) for EVERY user, then let the Permission Provider
     * authorize which the user actually sees via `catalogAccess`. This mirrors
     * the customer's model ("we tag comments with a catalogId and rely on
     * isContextEnabled so Velt calls our Permission Provider to authorize") and
     * makes per-catalog allow/deny decisions visible in the Debug Panel for every
     * user — including the no-access users (User 4 / User 5).
     */
    catalogs: string[];
  };
}

const APAC = CATALOGS[0].id; // catalog-apac
const EMEA = CATALOGS[1].id; // catalog-emea

// The catalogs whose comments live in the demo document. Every user subscribes
// to all of these; the Permission Provider (via each user's catalogAccess)
// decides which are actually visible.
export const DOCUMENT_CATALOG_IDS: string[] = [APAC, EMEA];

// ---------------------------------------------------------------------------
// The user matrix.
//
// Each user isolates a facet of the customer's configuration (and, where
// relevant, one of their two reported failures):
//
//   user1  full editor (org + both folders), both catalogs           → happy path
//   user2  cross-org editor (customer-org-1 guest), apac only         → context filtering
//   user3  VIEWER (org + folder), emea only                          → probe metadata-write
//                                                                        denials (failure #2)
//   user4  ORG-WIDE VIEWER ONLY (single org resource, no folder)     → reproduces the
//                                                                        "Invalid user token"
//                                                                        identify() failure (#1)
//   user5  editor on folder-legal, NO catalog access                 → notifications/comments
//                                                                        filtered out by context
// ---------------------------------------------------------------------------

const SIDE_LETTER = DOCUMENTS.SIDE_LETTER;
const LEGAL_MEMO = DOCUMENTS.LEGAL_MEMO;

export const accessModel: Record<string, UserAccess> = {
  // Full editor in the owner org, access to every folder + catalog.
  user1: {
    userId: "user1",
    purpose: "Owner-org editor · all folders · APAC + EMEA (happy path)",
    jwtResources: [
      { type: "organization", id: ORGS.OWNER, accessRole: "editor" },
      {
        type: "folder",
        id: FOLDERS.MANUFACTURING,
        organizationId: ORGS.OWNER,
        accessRole: "editor",
      },
      {
        type: "folder",
        id: FOLDERS.LEGAL,
        organizationId: ORGS.OWNER,
        accessRole: "editor",
      },
    ],
    orgRoles: { [ORGS.OWNER]: "editor" },
    folderRoles: {
      [FOLDERS.MANUFACTURING]: "editor",
      [FOLDERS.LEGAL]: "editor",
    },
    documentRoles: {
      [SIDE_LETTER.id]: "editor",
      [LEGAL_MEMO.id]: "editor",
    },
    catalogAccess: [APAC, EMEA],
    setDocuments: {
      documents: [SIDE_LETTER],
      folderId: FOLDERS.MANUFACTURING,
      catalogs: DOCUMENT_CATALOG_IDS,
    },
  },

  // Cross-org guest: belongs to customer-org-1 but is granted editor on a folder
  // inside owner-org-1. Only sees APAC-tagged comments/notifications.
  user2: {
    userId: "user2",
    purpose: "Cross-org guest editor (customer-org-1 → owner-org-1) · APAC only",
    jwtResources: [
      { type: "organization", id: ORGS.OWNER, accessRole: "editor" },
      {
        type: "folder",
        id: FOLDERS.MANUFACTURING,
        organizationId: ORGS.OWNER,
        accessRole: "editor",
      },
    ],
    orgRoles: { [ORGS.OWNER]: "editor" },
    folderRoles: { [FOLDERS.MANUFACTURING]: "editor" },
    documentRoles: { [SIDE_LETTER.id]: "editor" },
    catalogAccess: [APAC],
    setDocuments: {
      documents: [SIDE_LETTER],
      folderId: FOLDERS.MANUFACTURING,
      organizationId: ORGS.OWNER,
      catalogs: DOCUMENT_CATALOG_IDS,
    },
  },

  // Viewer (read-only) on the org + folder, EMEA only. This is the "viewer +
  // folder" shape the customer said identify()s fine — the right subject to probe
  // failure #2 (SDK metadata writes denied) under organizationPrivate + private
  // comments + context.
  user3: {
    userId: "user3",
    purpose: "Owner-org VIEWER (read-only) · folder-manufacturing · EMEA only",
    jwtResources: [
      { type: "organization", id: ORGS.OWNER, accessRole: "viewer" },
      {
        type: "folder",
        id: FOLDERS.MANUFACTURING,
        organizationId: ORGS.OWNER,
        accessRole: "viewer",
      },
    ],
    orgRoles: { [ORGS.OWNER]: "viewer" },
    folderRoles: { [FOLDERS.MANUFACTURING]: "viewer" },
    documentRoles: { [SIDE_LETTER.id]: "viewer" },
    catalogAccess: [EMEA],
    setDocuments: {
      documents: [SIDE_LETTER],
      folderId: FOLDERS.MANUFACTURING,
      catalogs: DOCUMENT_CATALOG_IDS,
    },
  },

  // Org-wide viewer ONLY: the token's single permissions.resources entry is an
  // organization with accessRole: viewer, and nothing else. This is the exact
  // shape the customer reported as rejected by identify() ("Invalid user token",
  // POST /v2/core/a → 400). Kept verbatim so the team can observe it here.
  user4: {
    userId: "user4",
    purpose: "ORG-WIDE VIEWER ONLY (no folder) · reproduces identify() failure #1",
    jwtResources: [
      { type: "organization", id: ORGS.OWNER, accessRole: "viewer" },
    ],
    orgRoles: { [ORGS.OWNER]: "viewer" },
    folderRoles: {},
    documentRoles: { [SIDE_LETTER.id]: "viewer" },
    // No catalog access granted — an org-wide viewer with no feature-level grants.
    // We still SUBSCRIBE to both catalogs so the Permission Provider is asked and
    // the deny decisions are visible in the Debug Panel.
    catalogAccess: [],
    setDocuments: {
      documents: [SIDE_LETTER],
      organizationId: ORGS.OWNER,
      catalogs: DOCUMENT_CATALOG_IDS,
    },
  },

  // Editor on a DIFFERENT folder (folder-legal) with NO catalog access. Has
  // document access but, because isContextEnabled filters feature data by catalog,
  // should NOT see catalog-tagged comments or receive their notifications.
  user5: {
    userId: "user5",
    purpose: "Owner-org editor · folder-legal · NO catalog access (context-filtered out)",
    jwtResources: [
      { type: "organization", id: ORGS.OWNER, accessRole: "editor" },
      {
        type: "folder",
        id: FOLDERS.LEGAL,
        organizationId: ORGS.OWNER,
        accessRole: "editor",
      },
    ],
    orgRoles: { [ORGS.OWNER]: "editor" },
    folderRoles: { [FOLDERS.LEGAL]: "editor" },
    documentRoles: {
      [SIDE_LETTER.id]: "editor",
      [LEGAL_MEMO.id]: "editor",
    },
    // Subscribes to both catalogs, but the Permission Provider denies both
    // (empty catalogAccess) → sees no catalog-tagged comments/notifications.
    catalogAccess: [],
    setDocuments: {
      documents: [SIDE_LETTER],
      folderId: FOLDERS.MANUFACTURING,
      catalogs: DOCUMENT_CATALOG_IDS,
    },
  },
};

// ---------------------------------------------------------------------------
// Selectors — used by the token route, permission policy, and UI.
// ---------------------------------------------------------------------------

export function getUserAccess(userId: string): UserAccess | undefined {
  return accessModel[userId];
}

/** JWT `permissions.resources[]` for a user (empty if unknown). */
export function getJwtResources(userId: string): VeltJwtResource[] {
  return accessModel[userId]?.jwtResources ?? [];
}

/** Organization role the Permission Provider should report, if any. */
export function getOrgRole(
  userId: string,
  organizationId: string,
): AccessRole | undefined {
  return accessModel[userId]?.orgRoles[organizationId];
}

/** Folder role the Permission Provider should report, if any. */
export function getFolderRole(
  userId: string,
  folderId: string,
): AccessRole | undefined {
  return accessModel[userId]?.folderRoles[folderId];
}

/** Document role the Permission Provider should report, if any. */
export function getDocumentRole(
  userId: string,
  documentId: string,
): AccessRole | undefined {
  return accessModel[userId]?.documentRoles[documentId];
}

/** Whether the user may see the given Access Context catalog value. */
export function hasCatalogAccess(userId: string, catalogId: string): boolean {
  return accessModel[userId]?.catalogAccess.includes(catalogId) ?? false;
}
