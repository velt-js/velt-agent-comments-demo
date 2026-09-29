"use client";
import { useEffect } from "react";
import { useVeltClient, VeltWireframe } from "@veltdev/react";
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
import { VeltNotificationsPanelWf } from "./VeltNotificationsPanelWf";

// [Velt] Everything about how Velt looks lives in this folder: the wireframes
// below, the two stylesheets, and the unstyled-mode switch that makes them apply.
export function VeltCustomization() {
  const { client } = useVeltClient();

  // The customization is authored against Velt's unstyled DOM.
  // `keepFunctionalStyles` keeps layout and positioning, drops the cosmetic defaults.
  useEffect(() => {
    if (!client) return;
    client.setUnstyledMode(true, { keepFunctionalStyles: true });
  }, [client]);

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
      <VeltNotificationsPanelWf />
    </VeltWireframe>
  );
}
