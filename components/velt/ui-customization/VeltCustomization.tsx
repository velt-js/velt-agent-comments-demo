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

// One VeltWireframe per app: the global template registry. Only direct children
// register, and the registry keys on component name + variant, which is why four
// VeltCommentDialogWireframe registrations can coexist here:
//
//   VeltCommentDialogWf     base           the floating pin popover
//   VeltSidebarCardWf       sidebar        the list rows
//   VeltFocusedThreadWf     focusedThread  the thread drawer
//   VeltPageModeComposerWf  pageModeComposer
//
// The variant names have to match the host props on <VeltCommentsSidebar>. Miss
// one and it silently falls back to the base template — for the page-mode
// composer that means no input at all.
//
// ThreadCard is nested inside each variant rather than registered here: a
// root-level registration would go global and shadow the per-variant cards.
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
