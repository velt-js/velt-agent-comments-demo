"use client";

import type { User } from "@veltdev/types";
import { useVeltClient, VeltNotificationsTool, VeltSidebarButton } from "@veltdev/react";
import { users, setDocumentsConfigByUserId } from "./velt/users";

interface HeaderProps {
  user: User | undefined;
  setCurrentUserId: (userId: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (updater: (open: boolean) => boolean) => void;
}

// Altana-style full-width app bar. The breadcrumb + action chips are the static
// document chrome; the "Viewing as" control is wired to the existing Velt login
// flow (token-based sign-in via setCurrentUserId, logout via signOutUser), and
// the toggle drives the right-anchored comments drawer.
export function Header({
  user,
  setCurrentUserId,
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  const { client } = useVeltClient();

  // [Velt] Sign the Velt session out *before* clearing the local userId.
  // Otherwise the SDK's underlying auth session (and any open subscriptions)
  // outlives the React state change and may leak into the next sign-in.
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
        {/* [Velt] The SDK's own sidebar button, templated by
            VeltSidebarButtonWf — the design draws a bare chat-bubble glyph with
            an unread dot here, and `UnreadIcon` is a slot only this component
            has, so the host button that used to sit here could never show it.

            The click is bridged on a HOST wrapper rather than passed into the
            wireframe (R4): `VeltSidebarButton` toggles VELT's panel, and this
            app's drawer is the host-owned `.hw-rail` whose width React controls,
            so the rail has to be told as well. The wrapper is our element, so its
            onClick is ordinary React. */}
        <span
          className={`hw-sidebar-toggle${sidebarOpen ? " hw-sidebar-toggle--active" : ""}`}
          onClick={() => setSidebarOpen((o) => !o)}
        >
          <VeltSidebarButton />
        </span>
      </div>
    </header>
  );
}

export default Header;
