// [Velt] In-memory Permission Provider log (debugging aid).
//
// Because this demo resolves permissions in the browser via the dev resolver
// (permissionProvider.resolvePermissions in app/page.tsx), we own the exact
// request/result pairs the Permission Provider produces. We record each decision
// here so the Debug Panel (components/velt/DebugPanel.tsx) can render them live.
//
// This is a tiny external store designed for React's `useSyncExternalStore`.
// It is a DEBUGGING aid only — it has no effect on permission decisions.

import type { PermissionQuery, PermissionResult } from "@veltdev/types";

export interface PermissionLogEntry {
  id: number;
  timestamp: number;
  userId: string;
  type: string;
  resourceId: string;
  organizationId?: string;
  /** Access Context payload for `type: "context"` requests, if any. */
  context?: Record<string, unknown>;
  source?: string;
  hasAccess: boolean;
  accessRole?: string;
}

const MAX_ENTRIES = 200;

let entries: PermissionLogEntry[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/** Record a resolved permission request/result pair. Newest first. */
export function recordPermission(
  query: PermissionQuery,
  result: PermissionResult,
): void {
  const entry: PermissionLogEntry = {
    id: nextId++,
    timestamp: Date.now(),
    userId: result.userId ?? query.userId,
    type: String(result.type ?? query.resource.type),
    resourceId: String(result.resourceId ?? query.resource.id),
    organizationId: result.organizationId ?? query.resource.organizationId,
    context: (query.resource as { context?: Record<string, unknown> }).context,
    source: (query.resource as { source?: string }).source,
    hasAccess: result.hasAccess,
    accessRole: result.accessRole as string | undefined,
  };
  // Prepend + cap. Replace the array reference so getSnapshot stays cheap/stable.
  entries = [entry, ...entries].slice(0, MAX_ENTRIES);
  emit();
}

export function clearPermissionLog(): void {
  entries = [];
  emit();
}

export function subscribePermissionLog(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPermissionLogSnapshot(): PermissionLogEntry[] {
  return entries;
}
