/* eslint-disable @typescript-eslint/no-explicit-any */
// [Velt] Self-hosting data providers — endpoint-based config.
//
// Routes the SDK's data calls (comments, reactions, users, attachments) to our
// self-hosted Python (Django + velt-py) backend, which persists to MongoDB and
// stores attachments in AWS S3.
//
// Backend reference: sample-apps/django_velt_test (velt-py 0.1.14).
// Set NEXT_PUBLIC_SELF_HOSTING_BASE_URL to the Django origin (e.g.
// http://localhost:8000/api/velt).
//
// This file integrates two SDK v5.0.4 resolver features:
//   • Feature 1 — resolver-endpoint-auth: each resolver forwards a short-lived JWT
//     via an async `headers` function (re-evaluated on every request AND every retry,
//     so the token is always fresh) plus `credentials` for cookie/session auth.
//   • Feature 2 — additionalSaveEvents: the comment resolver opts in to the non-core
//     "status change" annotation event on the existing save endpoint.

const BACKEND_URL = process.env.NEXT_PUBLIC_SELF_HOSTING_BASE_URL ?? "";

const jsonHeaders = { "Content-Type": "application/json" } as const;
const retry = { retryCount: 3, retryDelay: 2000 } as const;

// ---------------------------------------------------------------------------
// Feature 1: resolver-endpoint-auth — short-lived bearer token forwarding.
//
// The Django resolver endpoints (comments/reactions/attachments) are gated by
// `require_velt_token`, which verifies the `Authorization: Bearer <jwt>` header via
// `sdk.selfHosting.verifyToken`. The frontend must therefore mint/forward a token.
//
// DEV-ONLY token source: we POST to the backend's `/auth/mint` endpoint, which signs
// an HS256 JWT with a shared secret and NO authentication. In production, replace
// `getFreshToken()` with a call to your real identity provider (and verify with an
// asymmetric key/JWKS on the backend). The mint endpoint must never be deployed.
// ---------------------------------------------------------------------------

const TOKEN_TTL_SECONDS = 300;
// Refresh ~30s before the token actually expires so an in-flight request (or retry)
// never carries a token that lapses mid-flight.
const TOKEN_REFRESH_SKEW_MS = 30_000;

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0; // epoch ms

// Mint (or reuse a still-valid) JWT. Called by the async `headers` functions below on
// every resolver request — including retries — so each attempt gets a fresh token.
async function getFreshToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiresAt - TOKEN_REFRESH_SKEW_MS) {
    return cachedToken;
  }
  const res = await fetch(`${BACKEND_URL}/auth/mint`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ userId: "frontend-resolver", ttl: TOKEN_TTL_SECONDS }),
  });
  if (!res.ok) {
    throw new Error(`Failed to mint Velt resolver token (HTTP ${res.status})`);
  }
  const { token } = (await res.json()) as { token: string };
  cachedToken = token;
  cachedTokenExpiresAt = now + TOKEN_TTL_SECONDS * 1000;
  return token;
}

// JSON body endpoints: Content-Type + the bearer token.
const authHeaders = async () => ({
  ...jsonHeaders,
  Authorization: `Bearer ${await getFreshToken()}`,
});

// Attachment save uses multipart/form-data — we must NOT set Content-Type (the browser
// sets it with the correct boundary). Forward only the bearer token.
const authHeadersNoContentType = async () => ({
  Authorization: `Bearer ${await getFreshToken()}`,
});

// `credentials: 'include'` lets the resolver fetches carry cookies for cross-origin
// cookie/session auth (Feature 1). The Django backend sets
// `CORS_ALLOW_CREDENTIALS = True` with explicit (non-wildcard) origins, so this is safe.
const credentials = "include" as const;

// ---------------------------------------------------------------------------
// Feature 2: additionalSaveEvents — opt in to the "status change" annotation event.
//
// By default the save endpoint receives only the 4 core PII events. Opting in here
// makes the SDK ALSO POST a save event to `saveConfig.url` whenever a comment's status
// changes (open ↔ resolved, etc.), so our backend can build activity feeds/audit
// trails. velt-py 0.1.14 parses and persists the event through the same save endpoint
// — no extra backend route is needed.
//
// Value mirrors `CommentResolverSaveEvent.STATUS_CHANGE`. We use the string literal
// because @veltdev/types ships type-only declarations (there is no runtime enum object
// to import as a value).
const STATUS_CHANGE_EVENT = "comment_annotation.status_change";

export const commentDataProvider = {
  config: {
    getConfig: { url: `${BACKEND_URL}/comments/get`, headers: authHeaders, credentials },
    saveConfig: { url: `${BACKEND_URL}/comments/save`, headers: authHeaders, credentials },
    deleteConfig: { url: `${BACKEND_URL}/comments/delete`, headers: authHeaders, credentials },
    // Feature 2: deliver the status-change event to the save endpoint above.
    additionalSaveEvents: [{ event: STATUS_CHANGE_EVENT }],
    additionalFields: ['status'],
    resolveTimeout: 15000,
    getRetryConfig: retry,
    saveRetryConfig: retry,
    deleteRetryConfig: retry,
  },
} as any;

export const reactionDataProvider = {
  config: {
    getConfig: { url: `${BACKEND_URL}/reactions/get`, headers: authHeaders, credentials },
    saveConfig: { url: `${BACKEND_URL}/reactions/save`, headers: authHeaders, credentials },
    deleteConfig: { url: `${BACKEND_URL}/reactions/delete`, headers: authHeaders, credentials },
    resolveTimeout: 15000,
    getRetryConfig: retry,
    saveRetryConfig: retry,
    deleteRetryConfig: retry,
  },
} as any;

export const recordingDataProvider = {
  config: {
    getConfig: { url: `${BACKEND_URL}/recorders/get`, headers: authHeaders, credentials },
    saveConfig: { url: `${BACKEND_URL}/recorders/save`, headers: authHeaders, credentials },
    deleteConfig: { url: `${BACKEND_URL}/recorders/delete`, headers: authHeaders, credentials },
    resolveTimeout: 15000,
    getRetryConfig: retry,
    saveRetryConfig: retry,
    deleteRetryConfig: retry,
  },
} as any;

// The user resolver (users/get) is read-only and intentionally left ungated on the
// backend, so it keeps the static JSON headers (no token round-trip on this hot path).
export const userDataProvider = {
  config: {
    getConfig: { url: `${BACKEND_URL}/users/get`, headers: jsonHeaders },
    resolveTimeout: 10000,
    getRetryConfig: retry,
  },
} as any;

// Attachments use multipart/form-data on save — do NOT set Content-Type, the browser
// must set it with the correct boundary parameter automatically. The save headers
// therefore forward only the bearer token (no Content-Type); delete uses JSON + token.
export const attachmentDataProvider = {
  config: {
    saveConfig: {
      url: `${BACKEND_URL}/attachments/save`,
      headers: authHeadersNoContentType,
      credentials,
    },
    deleteConfig: {
      url: `${BACKEND_URL}/attachments/delete`,
      headers: authHeaders,
      credentials,
    },
    resolveTimeout: 30000,
    saveRetryConfig: { retryCount: 3, retryDelay: 2000 },
    deleteRetryConfig: { retryCount: 2, retryDelay: 1000 },
  },
} as any;
