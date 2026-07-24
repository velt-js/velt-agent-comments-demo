"use client";

import type { User } from "@veltdev/types";
import { useVeltClient, VeltNotificationsTool } from "@veltdev/react";
import { PanelToggleIcon } from "./icons";
import { users } from "./velt/users";
import { accessModel } from "./velt/accessModel";
import { CATALOGS, useActiveCatalog } from "./velt/CatalogContext";

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
  const { activeCatalogId, setActiveCatalogId } = useActiveCatalog();

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

        {/* Access Context authoring: choose which catalog NEW comments get tagged
            with (context.access.catalogId). Which comments a user can READ is
            governed separately by their catalogAccess + the Permission Provider. */}
        <div className="hw-catalog-picker">
          <label htmlFor="hw-catalog-select">New comments →</label>
          <select
            id="hw-catalog-select"
            value={activeCatalogId}
            onChange={(e) => setActiveCatalogId(e.target.value)}
          >
            {CATALOGS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

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
                // Surface each user's purpose (from the access model) so the
                // reproduction subjects are obvious in the picker.
                const purpose = accessModel[u.userId]?.purpose ?? "";
                return (
                  <option key={u.userId} value={u.userId}>
                    {`${u.name} — ${purpose}`}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        <VeltNotificationsTool enableCrossOrganization={true} />
        <button
          type="button"
          className={`hw-sidebar-toggle${sidebarOpen ? " hw-sidebar-toggle--active" : ""}`}
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label={sidebarOpen ? "Hide comments" : "Show comments"}
          aria-pressed={sidebarOpen}
        >
          <PanelToggleIcon />
        </button>
      </div>
    </header>
  );
}

export default Header;
