"use client";

// [Velt] Annotation CONTEXT for product-table comments (Figma 872:21775 — the
// "Product Name" line on a sidebar card).
//
// Velt lets the host attach arbitrary data to a comment annotation at CREATION
// time through the comment context provider:
//
//   useSetContextProvider() -> setContextProvider((documentId, location) => ({ ... }))
//
// Whatever object the provider returns is merged into `annotation.context`, and
// the wireframes read it back with <VeltData field="annotation.context.<key>" />.
// Before this component existed, `annotation.context` carried only Velt's own
// access bookkeeping ({ access, accessFields }), so the design's Product Name row
// had no data to render and always collapsed.
//
// WHY A CAPTURE-PHASE LISTENER RATHER THAN A PROP ON THE TABLE
// The provider signature is (documentId, location) — it is NOT told which element
// the pending comment is being pinned to, so the host has to remember that itself.
// A capture-phase pointerdown listener records the last product cell the user
// aimed at (the cell the <VeltCommentTool targetElementId> lives in, and the cell
// Velt pins the annotation to). That keeps this entirely inside the Velt
// integration: the product table's own markup, state and behaviour are untouched,
// and the product NAME is read from the cell that is already on screen rather than
// duplicated into a second source of truth.
//
// The pending target is consumed once and expires, so a comment typed somewhere
// else later (a text comment in the document, say) gets no product context and its
// Product Name row degrades to nothing — which is what the design's other frames
// draw.

import { useEffect } from "react";
import { useSetContextProvider } from "@veltdev/react";

/** The cell wrapper the product table puts around each commentable Name cell. */
const CELL_SELECTOR = ".hv-cell-commentable";
/** The product name element inside that cell. */
const NAME_SELECTOR = ".hv-table-name";
/** A remembered target older than this is stale — drop it rather than mislabel. */
const PENDING_TTL_MS = 5 * 60 * 1000;

interface PendingTarget {
  targetElementId: string;
  productName: string;
  at: number;
}

let pending: PendingTarget | null = null;

/** Exported for tests/diagnostics — the live value the provider would consume. */
export function peekPendingCommentTarget(): PendingTarget | null {
  if (!pending) return null;
  return Date.now() - pending.at > PENDING_TTL_MS ? null : pending;
}

export function VeltCommentContext() {
  const { setContextProvider } = useSetContextProvider();

  // Remember which product cell the user aimed at. Capture phase so it runs
  // before Velt's own handlers can move or detach the event target.
  useEffect(() => {
    const onPointerDown = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const cell = target?.closest?.(CELL_SELECTOR) as HTMLElement | null;
      if (!cell?.id) return;
      const productName = cell
        .querySelector<HTMLElement>(NAME_SELECTOR)
        ?.textContent?.trim();
      if (!productName) return;
      pending = { targetElementId: cell.id, productName, at: Date.now() };
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  useEffect(() => {
    setContextProvider(() => {
      const target = peekPendingCommentTarget();
      pending = null; // one shot — never label a later comment with a stale cell
      if (!target) return null;
      return {
        productName: target.productName,
        targetElementId: target.targetElementId,
      };
    });
  }, [setContextProvider]);

  return null;
}

export default VeltCommentContext;
