"use client";

import type { User } from "@veltdev/types";
import {
  useUnreadCommentAnnotationCountOnCurrentDocument,
  useVeltClient,
  VeltNotificationsTool,
} from "@veltdev/react";
import { users, setDocumentsConfigByUserId } from "./velt/users";
import { ChatTeardropIcon, ChatTeardropOutlineIcon } from "./icons";

interface HeaderProps {
  user: User | undefined;
  setCurrentUserId: (userId: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (updater: (open: boolean) => boolean) => void;
}

// Altana-style full-width app bar
export function Header({
  user,
  setCurrentUserId,
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  const { client } = useVeltClient();
  const unread = useUnreadCommentAnnotationCountOnCurrentDocument();

  // [Velt] Sign the Velt session out *before* clearing the local userId
  const handleLogout = async () => {
    if (client) {
      try {
        await client.signOutUser();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {}
    }
    setCurrentUserId(null);
  };

  return (
    <header className="hw-topbar">
      <div className="hw-topbar-breadcrumb">
        <span className="hw-topbar-logo">A</span>
        <span className="hw-crumb">Acme Acquisition</span>
        <span className="hw-crumb-sep">/</span>
        <span className="hw-crumb hw-crumb--active">
          Indemnification provisions summary
        </span>
        <span className="hw-crumb-meta">25 files</span>
      </div>
      <div className="hw-topbar-actions">
        <button className="hw-chip" type="button">
          + Add to space
        </button>
        <button className="hw-chip hw-chip--dark" type="button">
          Export
        </button>

        {user ? (
          <div className="hw-user-switcher">
            <label>Viewing as</label>
            <span className="hw-user-name">{user.name}</span>
            <button className="hw-chip" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="hw-user-switcher">
            <label htmlFor="hw-user-select">Sign in as</label>
            <select
              id="hw-user-select"
              value=""
              onChange={(e) => {
                if (e.target.value) setCurrentUserId(e.target.value);
              }}
            >
              <option value="" disabled>
                Select user
              </option>
              {Object.values(users).map((u) => {
                const settingOrg =
                  setDocumentsConfigByUserId[u.userId]?.organizationId ??
                  u.organizationId;
                const isCrossOrg = settingOrg !== u.organizationId;
                const label = `${u.name} — member of ${u.organizationId}, viewing ${settingOrg}${
                  isCrossOrg ? " (cross-org)" : ""
                }`;
                return (
                  <option key={u.userId} value={u.userId}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        <VeltNotificationsTool enableCrossOrganization={true} />
        {/* The drawer is embedded, so the host owns open/close */}
        <button
          className="hw-sidebar-toggle"
          type="button"
          aria-label="Comments"
          aria-pressed={sidebarOpen}
          onClick={() => setSidebarOpen((o) => !o)}
        >
          <span className="hw-sb-icon">
            {sidebarOpen ? <ChatTeardropIcon /> : <ChatTeardropOutlineIcon />}
          </span>
          {unread?.count ? <span className="hw-sb-dot" aria-hidden="true" /> : null}
        </button>
      </div>
    </header>
  );
}

export default Header;
