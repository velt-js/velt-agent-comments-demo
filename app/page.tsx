"use client";

import { useCallback, useState } from "react";
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
import type { AssignmentChange } from "@/components/velt/AssignmentListener";
import { applyAssignment, type RowOwners } from "@/components/rowOwners";
import { Header } from "@/components/Header";
import { Body } from "@/components/Body";

const VELT_API_KEY = process.env.NEXT_PUBLIC_VELT_API_KEY ?? "";
const SELF_HOSTING_BASE_URL =
  process.env.NEXT_PUBLIC_SELF_HOSTING_BASE_URL ?? "";

// Only wire data providers when self-hosting is configured
const dataProviders = SELF_HOSTING_BASE_URL
  ? {
      comment: commentDataProvider,
      reaction: reactionDataProvider,
      user: userDataProvider,
      attachment: attachmentDataProvider,
    }
  : undefined;

// [Velt] Real-time Permission Provider config
const permissionProvider: VeltPermissionProvider = {
  isContextEnabled: false,
  forceRefresh: false,
  retryConfig: { retryCount: 3, retryDelay: 2000 },
  revokeAccessOn: [
    {
      type: "user_logout" as RevokeAccessOnType,
      revokeOrganizationAccess: false,
    },
  ],
  dev: true,
  resolveTimeout: 60000,
  resolvePermissions: async ({ data: { requests } }) =>
    requests.map(evaluatePermission),
};

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authProvider, user } = useVeltAuthProvider(currentUserId);

  // Host app state: which user owns each product row
  const [rowOwners, setRowOwners] = useState<RowOwners>({});

  // [Velt] A comment on a row was assigned or unassigned, so update the row's owner.
  // In a real app, also save it through your own API here so every user sees it.
  const handleAssigneeChanged = useCallback((change: AssignmentChange) => {
    const at = Date.now();
    setRowOwners((prev) => applyAssignment(prev, change, at));
  }, []);

  return (
    <VeltProvider
      apiKey={VELT_API_KEY}
      authProvider={authProvider}
      permissionProvider={permissionProvider}
      dataProviders={dataProviders}
    >
      <div className="hw-app">
        <Header
          user={user}
          setCurrentUserId={setCurrentUserId}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="hw-body">
          <Body rowOwners={rowOwners} />
          <VeltCollaboration
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onAssigneeChanged={handleAssigneeChanged}
          />
        </div>
      </div>
    </VeltProvider>
  );
}
