"use client";
import { VeltWireframe } from "@veltdev/react";
import "./styles.css";
import { VeltCommentDialogWf } from "./VeltCommentDialogWf";
import { VeltCommentSidebarWf } from "./VeltCommentSidebarWf";
import { VeltSidebarCardWf } from "./VeltSidebarCardWf";
import { VeltCommentToolWf } from "./VeltCommentToolWf";
import { VeltPageModeComposerWf } from "./VeltPageModeComposerWf";
import { VeltFocusedThreadWf } from "./VeltFocusedThreadWf";

export function VeltCustomization() {
  return (
    <VeltWireframe>
      <VeltCommentSidebarWf />
      <VeltCommentDialogWf />
      <VeltSidebarCardWf />
      <VeltFocusedThreadWf />
      <VeltPageModeComposerWf />
      <VeltCommentToolWf />
    </VeltWireframe>
  );
}
