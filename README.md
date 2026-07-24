This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Altana demo for Velt comments and agent findings integration.

This build extends the demo into a **faithful reproduction of a customer's full Velt
access-control configuration** — Real-Time Permission Provider + Access Context
(`isContextEnabled`), viewer/editor roles, folders, `organizationPrivate`, and private
comments — so the Velt team can observe (and debug) the same behavior locally.

## Getting Started

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Add your Velt API key and auth token from the [Velt Console](https://console.velt.dev),
   and **configure the Console settings listed in `.env.example`** (Require JWT Token,
   `organizationPrivate`, Real-Time Permission Provider, Private Comments beta). These
   cannot be set in code and the demo depends on them.

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and use the **"Sign in as"** picker in
the header to switch between the demo users below.

## What this demo exercises

The customer layers many Velt features together (a combination we had not exercised at
this scale). All access rules for the demo live in **one place** —
[`components/velt/accessModel.ts`](components/velt/accessModel.ts) — which drives the JWT,
the Permission Provider policy, and `setDocuments` so they can never drift apart.

| Feature | Where |
|---------|-------|
| JWT auth (per-user resources + viewer/editor roles) | `app/api/velt/token/route.ts` |
| Real-Time Permission Provider (org / folder / document / **context**) | `components/velt/permissions.ts` + `app/api/velt/check-permissions/route.ts` (browser dev resolver in `app/page.tsx`) |
| Access Context (`isContextEnabled`, catalog tagging + filtering) | `app/page.tsx`, `components/velt/CommentContextTagger.tsx`, `components/velt/VeltInitializeDocument.tsx` |
| Folders (JWT folder resources + `setDocuments({ folderId })`) | `accessModel.ts`, `VeltInitializeDocument.tsx` |
| `organizationPrivate` + cross-org guests | Console + `accessModel.ts` (User 2/4) |
| Private comments (beta) | `<VeltComments visibilityOptions />` in `VeltCollaboration.tsx` |
| Live Permission Provider inspector | `components/velt/DebugPanel.tsx` + `permissionLog.ts` |

### Resource + context model

- **Organizations:** `owner-org-1` (documents live here) and `customer-org-1` (external
  guests).
- **Folders** (in `owner-org-1`): `folder-manufacturing` (holds the Side Letter document)
  and `folder-legal`.
- **Access Context** dimension `catalogId ∈ { catalog-apac, catalog-emea }` — every comment
  is tagged with a catalog, and users only see comments/notifications for catalogs they can
  access. Choose which catalog **new** comments are tagged with using the header selector.

### Demo users

| User  | Member org      | JWT resources (roles)                                    | Catalog access | Demonstrates |
|-------|-----------------|----------------------------------------------------------|----------------|--------------|
| User 1 | owner-org-1     | org **editor** + both folders **editor**                 | APAC + EMEA    | Full editor / happy path |
| User 2 | customer-org-1  | org **editor** + folder-manufacturing **editor**          | APAC only      | Cross-org guest, context-filtered |
| User 3 | owner-org-1     | org **viewer** + folder-manufacturing **viewer**          | EMEA only      | Viewer role (probe metadata-write failure) |
| User 4 | customer-org-1  | **org-wide viewer ONLY** (single org resource, no folder) | none           | Reproduces the identify() failure |
| User 5 | owner-org-1     | org **editor** + folder-legal **editor**                  | none           | Doc access but context filters out comments + notifications |

## Reproducing the customer's reported issues

Open the **"Velt permissions debug"** panel (bottom-left) to watch every Permission
Provider decision (org / folder / document / context) live, along with the signed-in
user's JWT resources and `useCurrentUserPermissions()`.

**Issue #1 — org-wide viewer token rejected by `identify()`.**
Sign in as **User 4**. Its JWT's only `permissions.resources` entry is an `organization`
with `accessRole: viewer` — the exact shape the customer reported as *"Invalid user
token"* (`POST /v2/core/a` → 400). Watch the Network tab (`generate_token`,
`validateclient`, `/v2/core/a`) and the console. Compare with **User 3** ("viewer +
folder", reported to work) and the editor users.

**Issue #2 — SDK metadata writes fail under viewer + organizationPrivate + private
comments + context.**
Sign in as **User 3** (viewer). Watch the console/Network for
`updateDoc organizationMetadata` / `documentMetadata` → *FirebaseError: Missing or
insufficient permissions* and `POST /v1/sed` → 500 (`handleCommentEncryption`). The panel
shows the org/folder/document roles Velt is resolving for the user at the time.

> If a failure does **not** reproduce here, that is itself a useful result: it narrows the
> customer's problem (matching Velt's "token shape is fine; the real error is elsewhere"
> hypothesis), and the Debug Panel + Network capture show where to look next.

## Agent comments integration

This demo also shows how to add agent findings via the [Velt Add Comment Annotations REST
API](https://velt.dev/docs/api-reference/rest-apis/v2/comments-feature/comment-annotations/add-comment-annotations).

| File | Role |
|------|------|
| `lib/velt/agentCommentSeeds.ts` | Hard-coded demo findings (now Access-Context tagged) — replace with your agent output |
| `app/api/velt/agent-comments/route.ts` | Server-side Velt REST API call (keeps secrets off the client) |
| `components/velt/SeedAgentComments.tsx` | Triggers seeding after sign-in |

**Flow:** user signs in → document loads → `SeedAgentComments` POSTs to
`/api/velt/agent-comments` → route checks for existing agent comments → creates two
`type: "suggestion"` annotations if needed. Each finding is tagged with a catalog
(finding #1 → APAC, finding #2 → EMEA), so context filtering applies to agent comments too.

**Self-hosting note:** leave `NEXT_PUBLIC_SELF_HOSTING_BASE_URL` unset for this demo. Agent
comments seeded via the REST API are stored in Velt cloud; if comment data providers point
at the Django backend, seeded findings will not appear in the UI.

## Learn More

- [Velt — Access Control overview](https://velt.dev/docs/key-concepts/overview#c-real-time-permission-provider)
- [Velt — Access Context](https://velt.dev/docs/key-concepts/overview#d-set-feature-level-permissions-using-access-context)
- [Velt — Folders](https://velt.dev/docs/key-concepts/overview#folders)
- [Velt — Roles](https://velt.dev/docs/key-concepts/overview#3-roles)
- [Velt — Private comments (beta)](https://velt.dev/docs/async-collaboration/comments/customize-behavior#private-comments-beta)
- [Next.js Documentation](https://nextjs.org/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
