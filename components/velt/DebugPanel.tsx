"use client";

// [Velt] Debug Panel — reproduction & inspection tool.
//
// This panel exists so the Velt team can observe the customer's exact setup in
// action. Because we resolve permissions in the browser (the dev resolver), we
// can show, live:
//   A. The signed-in user's JWT resources + catalog access (from the access model).
//   B. What Velt reports the user's effective permissions are (useCurrentUserPermissions).
//   C. Every Permission Provider decision as it happens (organization / folder /
//      document / context), captured in components/velt/permissionLog.ts.
//
// Reproduction hints (see README):
//   • user4 (org-wide viewer only) → watch identify()/POST /v2/core/a in the
//     Network tab for the reported "Invalid user token" failure.
//   • user3 (viewer) → watch the console for updateDoc organizationMetadata /
//     documentMetadata FirebaseErrors and POST /v1/sed 500 (metadata-write failure).

import { useSyncExternalStore, useState } from "react";
import { useCurrentUserPermissions } from "@veltdev/react";
import {
  clearPermissionLog,
  getPermissionLogSnapshot,
  subscribePermissionLog,
} from "./permissionLog";
import { getUserAccess } from "./accessModel";
import { useActiveCatalog } from "./CatalogContext";

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour12: false });
}

export default function DebugPanel({
  currentUserId,
}: {
  currentUserId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const log = useSyncExternalStore(
    subscribePermissionLog,
    getPermissionLogSnapshot,
    getPermissionLogSnapshot,
  );
  const permissions = useCurrentUserPermissions();
  const { activeCatalogId } = useActiveCatalog();

  const access = currentUserId ? getUserAccess(currentUserId) : undefined;

  return (
    <div className={`hw-debug${open ? " hw-debug--open" : ""}`}>
      <button
        type="button"
        className="hw-debug-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {open ? "▾" : "▸"} Velt permissions debug
        <span className="hw-debug-count">{log.length}</span>
      </button>

      {open && (
        <div className="hw-debug-body">
          <section className="hw-debug-section">
            <h4>Signed-in user</h4>
            {access ? (
              <>
                <p className="hw-debug-purpose">{access.purpose}</p>
                <div className="hw-debug-kv">
                  <span>JWT resources</span>
                  <ul>
                    {access.jwtResources.map((r, i) => (
                      <li key={i}>
                        <code>
                          {r.type}:{r.id}
                          {r.accessRole ? ` (${r.accessRole})` : ""}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hw-debug-kv">
                  <span>Catalog access</span>
                  <code>
                    {access.catalogAccess.length
                      ? access.catalogAccess.join(", ")
                      : "none"}
                  </code>
                </div>
                <div className="hw-debug-kv">
                  <span>Authoring catalog</span>
                  <code>{activeCatalogId}</code>
                </div>
              </>
            ) : (
              <p className="hw-debug-empty">No user signed in.</p>
            )}
          </section>

          <section className="hw-debug-section">
            <h4>useCurrentUserPermissions()</h4>
            <pre className="hw-debug-pre">
              {permissions
                ? JSON.stringify(permissions, null, 2)
                : "— (null until permissions resolve)"}
            </pre>
          </section>

          <section className="hw-debug-section">
            <div className="hw-debug-section-head">
              <h4>Permission Provider decisions</h4>
              <button
                type="button"
                className="hw-debug-clear"
                onClick={() => clearPermissionLog()}
              >
                Clear
              </button>
            </div>
            {log.length === 0 ? (
              <p className="hw-debug-empty">
                No checks yet. Sign in and open the document.
              </p>
            ) : (
              <table className="hw-debug-table">
                <thead>
                  <tr>
                    <th>time</th>
                    <th>type</th>
                    <th>resource</th>
                    <th>role</th>
                    <th>access</th>
                  </tr>
                </thead>
                <tbody>
                  {log.map((e) => (
                    <tr
                      key={e.id}
                      className={e.hasAccess ? "hw-allow" : "hw-deny"}
                    >
                      <td>{formatTime(e.timestamp)}</td>
                      <td>{e.type}</td>
                      <td title={e.resourceId}>{e.resourceId}</td>
                      <td>{e.accessRole ?? "—"}</td>
                      <td>{e.hasAccess ? "allow" : "deny"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
