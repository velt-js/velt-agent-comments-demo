"use client";

import { useState } from "react";
// import { VeltProvider } from "@veltdev/react";
// import type {
//   RevokeAccessOnType,
//   VeltPermissionProvider,
// } from "@veltdev/types";
// import { useVeltAuthProvider } from "@/components/velt/VeltInitializeUser";
// import VeltCollaboration from "@/components/velt/VeltCollaboration";
// import {
//   commentDataProvider,
//   reactionDataProvider,
//   userDataProvider,
//   attachmentDataProvider,
// } from "@/components/velt/VeltDataProviders";
// import { evaluatePermission } from "@/components/velt/permissions";
import { Header } from "@/components/Header";
import { Body } from "@/components/Body";
import { users } from "@/components/velt/users";

// const VELT_API_KEY = process.env.NEXT_PUBLIC_VELT_API_KEY ?? "";

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
// const permissionProvider: VeltPermissionProvider = {
//   isContextEnabled: false,
//   forceRefresh: false,
//   retryConfig: { retryCount: 3, retryDelay: 2000 },
//   revokeAccessOn: [
//     {
//       type: "user_logout" as RevokeAccessOnType,
//       revokeOrganizationAccess: false,
//     },
//   ],
//   dev: true,
//   resolveTimeout: 60000,
//   resolvePermissions: async ({ data: { requests } }) =>
//     requests.map(evaluatePermission),
// };

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const { authProvider, user } = useVeltAuthProvider(currentUserId);
  const user = currentUserId ? users[currentUserId] : undefined;

  return (
    // <VeltProvider
    //   apiKey={VELT_API_KEY}
    //   authProvider={authProvider}
    //   permissionProvider={permissionProvider}
    //   dataProviders={{
    //     comment: commentDataProvider,
    //     reaction: reactionDataProvider,
    //     user: userDataProvider,
    //     attachment: attachmentDataProvider,
    //   }}
    // >
      <div className="hw-app">
        <Header
          user={user}
          setCurrentUserId={setCurrentUserId}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="hw-body">
          <Body />
          {/* <VeltCollaboration sidebarOpen={sidebarOpen} /> */}
        </div>
      </div>
    // </VeltProvider>
  );
}
