"use client";
import { VeltWireframe } from "@veltdev/react";
import "./styles.css";
import { VeltCommentDialogWf } from "./VeltCommentDialogWf";
import { VeltCommentSidebarWf } from "./VeltCommentSidebarWf";
import { VeltSidebarCardWf } from "./VeltSidebarCardWf";
import { VeltCommentToolWf } from "./VeltCommentToolWf";
import { VeltPageModeComposerWf } from "./VeltComposerWf";
import { VeltFocusedThreadWf } from "./VeltFocusedThreadWf";
import { VeltSidebarButtonWf } from "./VeltSidebarButtonWf";

// Exactly one VeltWireframe element per app (global template registry).
//
// Only DIRECT children of VeltWireframe become global registry keys. THREE
// VeltCommentDialogWireframe registrations sit here on purpose and do NOT collide —
// the registry keys them by component name + variant:
//
//   VeltCommentDialogWf      → `comment-dialog`                      (BASE: the floating
//                                                                     popover dialog, and
//                                                                     the fallback for any
//                                                                     other dialog context)
//   VeltSidebarCardWf        → `comment-dialog---sidebar`            (the sidebar's collapsed
//                                                                     368px list rows,
//                                                                     selected by the host's
//                                                                     dialogVariant prop)
//   VeltPageModeComposerWf   → `comment-dialog---pageModeComposer`   (the sidebar's page-mode
//                                                                     composer, selected by
//                                                                     the host's
//                                                                     pageModeComposerVariant
//                                                                     prop)
//   VeltFocusedThreadWf      → `comment-dialog---focusedThread`      (the sidebar's focused
//                                                                     thread drawer, selected
//                                                                     by the host's
//                                                                     focusedThreadDialogVariant
//                                                                     prop — 872:21603)
//
// Without a matching registration a variant falls back to the base wireframe: for the
// page-mode composer that fallback renders 368x0 with no input (knowledge trap
// `page-mode-composer-variant-unregistered`); for the sidebar it renders the floating
// dialog's layout in every list row.
//
// NOTE — ThreadCard is deliberately NOT registered here any more. It used to be BOTH a
// root-level child (a global `comment-dialog-thread-card` key) and a nested child of the
// dialog template. The registry resolves collisions first-with-content-wins and a global
// definition is never overwritten by a nested one, so a root-level ThreadCard would shadow
// the per-variant thread cards and the sidebar card and the popover could never differ
// ("nest to scope, root-level to go global; don't register the same component both ways",
// wireframes.md §3). Each variant now nests its own ThreadCard.
export function VeltCustomization() {
  return (
    <VeltWireframe>
      <VeltCommentSidebarWf />
      <VeltCommentDialogWf />
      <VeltSidebarCardWf />
      <VeltFocusedThreadWf />
      <VeltPageModeComposerWf />
      <VeltCommentToolWf />
      <VeltSidebarButtonWf />
    </VeltWireframe>
  );
}
