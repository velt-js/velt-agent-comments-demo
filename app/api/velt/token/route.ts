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

  // Mint a JWT against Velt's API. We only assert identity here; resource
  // permissions are evaluated separately by the Real-Time Permission Provider
  // at /api/velt/check-permissions.
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
    // - permissions.resources[] = where roles are assigned
    //
    // We grant `editor` on the org here so the user can act inside it;
    // finer-grained per-document checks still flow through the
    // Real-Time Permission Provider at /api/velt/check-permissions.
    body: JSON.stringify({
      data: {
        userId: user.userId,
        userProperties: {
          name: user.name,
          email: user.email,
          isAdmin: false,
        },
        permissions: {
          resources: [
            {
              type: "organization",
              id: user.organizationId,
              accessRole: "editor",
            },
          ],
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
