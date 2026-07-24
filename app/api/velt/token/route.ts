// [Velt] JWT mint endpoint.
//
// The browser's authProvider.generateToken() callback POSTs here with a
// userId. We look the user up server-side and call Velt's generate_token
// API with the secret VELT_AUTH_TOKEN, which must NEVER touch the client.
//
// Docs: https://docs.velt.dev/get-started/advanced#jwt-authentication-tokens
//
// Console requirement: "Require JWT Token" must be enabled at
//   https://console.velt.dev/dashboard/config/general
//
// SECURITY NOTE: this demo trusts whatever userId the client posts because
// there is no real auth here — the UI lets you pick Michael/Jim/Pam directly.
// In production, derive the userId from your server-side session (cookies,
// headers, OAuth, etc.) and IGNORE the client-provided value, otherwise
// anyone can mint a token for any user.

import type { NextRequest } from 'next/server';
import { users } from '@/components/velt/users';
import { getJwtResources } from '@/components/velt/accessModel';

const VELT_GENERATE_TOKEN_URL = 'https://api.velt.dev/v2/auth/generate_token';

interface VeltGenerateTokenResponse {
  result?: { data?: { token?: string } };
  error?: unknown;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_VELT_API_KEY;
  const authToken = process.env.VELT_AUTH_TOKEN;
  if (!apiKey || !authToken) {
    return Response.json(
      { error: 'Server missing NEXT_PUBLIC_VELT_API_KEY or VELT_AUTH_TOKEN' },
      { status: 500 },
    );
  }

  let payload: { userId?: string };
  try {
    payload = (await request.json()) as { userId?: string };
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const userId = payload.userId;
  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 });
  }

  const user = users[userId];
  if (!user) {
    return Response.json({ error: `Unknown userId: ${userId}` }, { status: 404 });
  }

  // Per-user JWT resources come from the access model (single source of truth).
  // This is where viewer/editor roles are assigned. Each user exercises a
  // different shape of the customer's configuration — see components/velt/accessModel.ts.
  //
  // NOTE (reproduction of reported failure #1): user4's `resources` is a SINGLE
  // organization entry with accessRole "viewer" and nothing else — the exact
  // "org-wide viewer-only" token the customer said identify() rejects with
  // "Invalid user token" (POST /v2/core/a → 400). We mint it verbatim so the
  // team can observe the behavior here. user3 ("viewer + folder") is the shape
  // the customer said works; user1/user2/user5 are editors.
  const resources = getJwtResources(user.userId);

  // Mint a JWT against Velt's API. We assert identity (userProperties) plus the
  // per-resource roles above; finer-grained + feature-level (context) checks
  // still flow through the Real-Time Permission Provider at
  // /api/velt/check-permissions (and the browser dev resolver in app/page.tsx).
  const veltRes = await fetch(VELT_GENERATE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-velt-api-key': apiKey,
      'x-velt-auth-token': authToken,
    },
    // Body shape: see /api-reference/rest-apis/v2/auth/generate-token for the
    // field schema. Heads up: Velt's API actually requires the body to be
    // wrapped in `{ data: ... }` (matching the rest of their REST surface),
    // even though the public docs show an unwrapped example. Posting
    // unwrapped returns `INVALID_ARGUMENT`.
    //
    // - userProperties = identity-only (name/email/isAdmin)
    // - permissions.resources[] = where roles (viewer/editor) are assigned, per
    //   resource type (organization / folder / document). `organizationId` is
    //   required by the API for folder/document resources.
    body: JSON.stringify({
      data: {
        userId: user.userId,
        userProperties: {
          name: user.name,
          email: user.email,
          isAdmin: false,
        },
        permissions: {
          resources,
        },
      },
    }),
  });

  const json = (await veltRes
    .json()
    .catch(() => null)) as VeltGenerateTokenResponse | null;

  const token = json?.result?.data?.token;
  if (!veltRes.ok || !token) {
    console.error('[velt-token] Velt API rejected request', {
      status: veltRes.status,
      body: json,
    });
    return Response.json(
      {
        error: 'Velt token generation failed',
        upstreamStatus: veltRes.status,
        details: json,
      },
      { status: 502 },
    );
  }

  return Response.json({ token });
}
