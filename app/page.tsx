"use client";

import { useState } from "react";
import { VeltProvider } from "@veltdev/react";
import type {
  RevokeAccessOnType,
  VeltPermissionProvider,
} from "@veltdev/types";
import { useVeltAuthProvider } from "@/components/velt/VeltInitializeUser";
import VeltCollaboration from "@/components/velt/VeltCollaboration";
import {
  commentDataProvider,
  reactionDataProvider,
  userDataProvider,
  attachmentDataProvider,
} from "@/components/velt/VeltDataProviders";
import { evaluatePermission } from "@/components/velt/permissions";
import { recordPermission } from "@/components/velt/permissionLog";
import { CatalogProvider } from "@/components/velt/CatalogContext";
import DebugPanel from "@/components/velt/DebugPanel";
import { Header } from "@/components/Header";
import { Body } from "@/components/Body";

const VELT_API_KEY = process.env.NEXT_PUBLIC_VELT_API_KEY ?? "";
const SELF_HOSTING_BASE_URL =
  process.env.NEXT_PUBLIC_SELF_HOSTING_BASE_URL ?? "";

// Only wire data providers when self-hosting is configured. With an empty base URL
// the SDK would call relative paths like /comments/get on this app (404) instead
// of reading comments from Velt cloud — agent REST API seeds would never appear.
const dataProviders = SELF_HOSTING_BASE_URL
  ? {
      comment: commentDataProvider,
      reaction: reactionDataProvider,
      user: userDataProvider,
      attachment: attachmentDataProvider,
    }
  : undefined;

// [Velt] Real-time Permission Provider config.
//
// `dev: true` + `resolvePermissions` resolves permissions IN THE BROWSER using
// the shared policy in components/velt/permissions.ts, so no ngrok/Cloudflare
// tunnel is needed for local development — the localhost check is always
// reachable from the browser. We use the callback resolver (resolvePermissions)
// rather than the URL resolver (endpointConfig).
//
// IMPORTANT: the dev resolver only works on DEV/TEST API keys. Velt's backend
// ignores browser-resolved results for production keys and always falls back to
// the server-to-server Real-Time Permission Provider. So for production you
// must deploy app/api/velt/check-permissions/route.ts to a public HTTPS URL and
// register it in the Velt Console:
//   https://console.velt.dev/dashboard/config/permission-provider
// (The RTPP must also be enabled in the Console for permissions to be gated at
// all — the dev resolver only changes WHERE the check runs, not WHETHER it runs.)
//
// isContextEnabled: true — turns on FEATURE-LEVEL (Access Context) permission
// checks. With this on, Velt sends an extra `type: "context"` request for each
// catalog value passed to setDocuments (and for notifications), so the provider
// can gate which comments/notifications a user sees per catalog. This mirrors the
// customer's setup exactly.
const permissionProvider: VeltPermissionProvider = {
  isContextEnabled: true,
  forceRefresh: false,
  retryConfig: { retryCount: 3, retryDelay: 2000 },
  revokeAccessOn: [
    {
      // Context access is only revoked on logout (not on document unset), per the
      // Access Context docs.
      type: "user_logout" as RevokeAccessOnType,
      revokeOrganizationAccess: false,
    },
  ],
  dev: true,
  resolveTimeout: 60000,
  resolvePermissions: async ({ data: { requests } }) =>
    requests.map((request) => {
      const result = evaluatePermission(request);
      // Record every decision so the Debug Panel can show org/folder/document/
      // context checks live. This is a debugging aid only — it does not affect
      // the result returned to Velt.
      recordPermission(request, result);
      return result;
    }),
};

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authProvider, user } = useVeltAuthProvider(currentUserId);

  return (
    <VeltProvider
      apiKey={VELT_API_KEY}
      authProvider={authProvider}
      permissionProvider={permissionProvider}
      dataProviders={dataProviders}
    >
      {/* CatalogProvider holds which Access Context catalog new comments are
          tagged with (chosen in the header, applied by CommentContextTagger). */}
      <CatalogProvider>
        <div className="hw-app">
          <Header
            user={user}
            setCurrentUserId={setCurrentUserId}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <div className="hw-body">
            <Body />
            <VeltCollaboration sidebarOpen={sidebarOpen} />
          </div>
        </div>
        {/* Live view of Permission Provider decisions + the current user's grants.
            Primary tool for reproducing/inspecting the reported issues. */}
        <DebugPanel currentUserId={currentUserId} />
      </CatalogProvider>
    </VeltProvider>
  );
}
