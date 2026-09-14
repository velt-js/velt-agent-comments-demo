"use client";

// [Velt] Annotation context for product-table comments — the card's "Product Name" row

import { useEffect } from "react";
import { useSetContextProvider } from "@veltdev/react";

/* The cell wrapper the product table puts around each commentable Name cell */
const CELL_SELECTOR = ".hv-cell-commentable";
/* The product name element inside that cell */
const NAME_SELECTOR = ".hv-table-name";
/* A remembered target older than this is stale — drop it rather than mislabel */
const PENDING_TTL_MS = 5 * 60 * 1000;

interface PendingTarget {
  targetElementId: string;
  productName: string;
  at: number;
}

let pending: PendingTarget | null = null;

/* Exported for tests/diagnostics — the live value the provider would consume */
export function peekPendingCommentTarget(): PendingTarget | null {
  if (!pending) return null;
  return Date.now() - pending.at > PENDING_TTL_MS ? null : pending;
}

export function VeltCommentContext() {
  const { setContextProvider } = useSetContextProvider();

  // Remember which product cell the user aimed at, before Velt opens its composer
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
