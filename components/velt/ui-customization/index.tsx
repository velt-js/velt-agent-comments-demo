"use client";
import { VeltWireframe } from "@veltdev/react";
import "./styles.css";
import "./notifications.css";
import { VeltCommentDialogWf } from "./VeltCommentDialogWf";
import { VeltCommentSidebarWf } from "./VeltCommentSidebarWf";
import { VeltSidebarCardWf } from "./VeltSidebarCardWf";
import { VeltCommentToolWf } from "./VeltCommentToolWf";
import { VeltPageModeComposerWf } from "./VeltPageModeComposerWf";
import { VeltFocusedThreadWf } from "./VeltFocusedThreadWf";
import { VeltVisibilityBannerWf } from "./VeltVisibilityBannerWf";
import { VeltNotificationsToolWf } from "./VeltNotificationsToolWf";

export function VeltCustomization() {
  return (
    <VeltWireframe>
      <VeltCommentSidebarWf />
      <VeltCommentDialogWf />
      <VeltSidebarCardWf />
      <VeltFocusedThreadWf />
      <VeltPageModeComposerWf />
      <VeltCommentToolWf />
      <VeltVisibilityBannerWf />
      <VeltNotificationsToolWf />
    </VeltWireframe>
  );
}
