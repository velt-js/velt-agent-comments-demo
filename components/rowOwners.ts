// Host app state: which user owns each product row, keyed by product id.
// Filled from comment assignments by AssignmentListener (components/velt).

import { products } from "./ProductsTable";
import type { AssignmentChange } from "./velt/AssignmentListener";

export interface RowOwner {
  userId: string;
  name: string;
  // The comment thread whose assignment set this owner
  annotationId: string;
  // When it was set, so the cell can highlight each change
  at: number;
}

export type RowOwners = Record<string, RowOwner>;

// Which product row a comment belongs to. Comments carry `productId` in their
// context; older ones only have `productName`, so fall back to matching the name.
export function productIdFromContext(context: unknown): string | null {
  if (!context || typeof context !== "object") return null;
  const { productId, productName } = context as { productId?: unknown; productName?: unknown };
  if (typeof productId === "string") return productId;
  if (typeof productName === "string") {
    return products.find((product) => product.name === productName)?.id ?? null;
  }
  return null;
}

// The host app's rule. The latest assignment on any thread in a row makes that
// user the row's owner. Removing the assignee clears the owner only when it is
// the same thread that set it, so another thread's owner is never wiped.
export function applyAssignment(prev: RowOwners, change: AssignmentChange, at: number): RowOwners {
  const productId = productIdFromContext(change.context);
  // Not a comment on a table row, e.g. an agent finding on the document text
  if (!productId) return prev;

  const { assignee } = change;
  if (assignee?.userId) {
    return {
      ...prev,
      [productId]: {
        userId: assignee.userId,
        name: assignee.name || assignee.email || assignee.userId,
        annotationId: change.annotationId,
        at,
      },
    };
  }

  if (prev[productId]?.annotationId !== change.annotationId) return prev;
  const next = { ...prev };
  delete next[productId];
  return next;
}
