"use client";
import { VeltWireframe } from "@veltdev/react";
import "./styles.css";
import { VeltCommentDialogWf } from "./VeltCommentDialogWf";
import { VeltCommentSidebarWf } from "./VeltCommentSidebarWf";
import { ThreadCardWf } from "./ThreadCardWf";

// Exactly one <VeltWireframe> per app (global template registry).
export function VeltCustomization() {
  return (
    <VeltWireframe>
      <VeltCommentSidebarWf />
      <VeltCommentDialogWf />
      <ThreadCardWf />
    </VeltWireframe>
  );
}
