"use client";

import type { VeltAuthProvider } from "@veltdev/types";
import { useMemo } from "react";
import { users } from "./users";

const VELT_TOKEN_ENDPOINT = "/api/velt/token";

// Fetch a Velt JWT for the given userId from our backend route, which holds
// the secret VELT_AUTH_TOKEN and calls Velt's generate_token API.
// See app/api/velt/token/route.ts.
async function fetchVeltToken(userId: string): Promise<string> {
  const res = await fetch(VELT_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    throw new Error(
      `Velt token endpoint returned ${res.status} ${res.statusText}`,
    );
  }
  const { token } = (await res.json()) as { token?: string };
  if (!token) throw new Error("Velt token endpoint returned empty token");
  return token;
}

// [Velt] User authentication hook.
// Pass the current userId (or null when signed out) and the hook builds the
// matching VeltAuthProvider. `generateToken` is invoked by the SDK on initial
// sign-in and again whenever the JWT expires (every ~48h), so token refresh
// is fully automatic. Returning `undefined` keeps Velt in a signed-out state.
export function useVeltAuthProvider(userId: string | null) {
  const user = userId ? users[userId] : undefined;

  const authProvider: VeltAuthProvider | undefined = useMemo(() => {
    if (!user) return undefined;
    return {
      user,
      retryConfig: { retryCount: 3, retryDelay: 1000 },
      generateToken: () => fetchVeltToken(user.userId),
    };
  }, [user]);

  return { authProvider, user };
}
