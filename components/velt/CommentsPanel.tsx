"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  VeltCommentsSidebarV2,
  useCommentAnnotations,
  useVeltClient,
} from "@veltdev/react";
import {
  DISPLAY_OPTIONS_BUTTON,
  OPEN_SIDEBAR_BUTTON,
} from "./ui-customization/buttonIds";

// The filter sheet's sections, in the order the design lists them. No priority
// section: this document's comments carry no priority, so it would only ever
// offer "Not set" (an explicit `filters` list opts out of the SDK's own gating).
const SIDEBAR_FILTERS = [
  { field: "involved", label: "Involved" },
  { field: "assigned", label: "Assigned to" },
  { field: "people", label: "Created by" },
  { field: "status", label: "Status" },
  { field: "tagged", label: "Tagged" },
];

// Right-anchored drawer hosting the embedded page-mode sidebar. The host owns
// open/close; sorting, filtering and the resolved view are all SDK-native.
export function CommentsPanel({
  open,
  setSidebarOpen,
}: {
  open: boolean;
  setSidebarOpen: (updater: (open: boolean) => boolean) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const { client } = useVeltClient();
  const annotations = useCommentAnnotations();
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);

  // Both triggers live inside wireframes, which can't take a React onClick, so
  // their `veltButtonClick` id is the only way across. Subscribing gives one
  // callback per press, unlike the last-event hook.
  useEffect(() => {
    if (!client) return;
    const subscription = client.on("veltButtonClick").subscribe((event) => {
      const id = event?.buttonContext?.clickedButtonId;
      if (id === OPEN_SIDEBAR_BUTTON) setSidebarOpen(() => true);
      if (id === DISPLAY_OPTIONS_BUTTON) setDisplayMenuOpen((open) => !open);
    });
    return () => subscription.unsubscribe();
  }, [client, setSidebarOpen]);

  // Close the menu on an outside press, in the capture phase so Velt's own
  // handlers can't swallow it first.
  useEffect(() => {
    if (!displayMenuOpen) return;
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest?.(".hw-display-menu, .hw-ctl-display")) return;
      setDisplayMenuOpen(false);
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [displayMenuOpen]);

  // No bulk API, so walk the threads the panel already has
  const markAllAsRead = useCallback(() => {
    const commentElement = client?.getCommentElement();
    for (const annotation of annotations ?? []) {
      if (annotation?.annotationId) void commentElement?.markAsRead(annotation.annotationId);
    }
    setDisplayMenuOpen(false);
  }, [client, annotations]);

  // The sidebar's ✕ has to collapse the host drawer too
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest?.(".hw-panel-close, .hw-focus-close")) return;
      setSidebarOpen(() => false);
    };
    rail.addEventListener("click", onClick, true);
    return () => rail.removeEventListener("click", onClick, true);
  }, [setSidebarOpen]);

  // Opening a thread dismisses the filter sheet, which is a sibling overlay of
  // the panel and would otherwise sit over the thread. Watching for the thread
  // rather than the press: closing mid-click swallows the press that opens it.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const observer = new MutationObserver(() => {
      const close = rail.querySelector<HTMLElement>(".hw-filter-close button");
      if (!close) return; // the sheet is shut: nothing to dismiss
      if (!rail.querySelector(".hw-focus .vc-focus, .hw-focus .vc-agent")) return;
      close.click();
    });
    observer.observe(rail, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Clicking a pin closes the drawer — the popover and side sheet are alternatives
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        !target?.closest?.(
          "velt-comment-pin-triangle-internal, .velt-comment-pin, .comment-pin-portal",
        )
      ) {
        return;
      }
      setSidebarOpen(() => false);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [setSidebarOpen]);

  return (
    <div
      /* The stylesheet keys off `hw-rail--open` to hide the pin popover */
      className={`hw-rail${open ? " hw-rail--open" : ""}`}
      ref={railRef}
      style={{
        width: open ? 400 : 0,
        boxShadow: open ? "-10px 0 28px rgba(0, 0, 0, 0.16)" : "none",
      }}
    >
      <div className="hw-rail-inner">
        <VeltCommentsSidebarV2
          embedMode="true"
          pageMode={true}
          shadowDom={false}
          defaultMinimalFilter="open"
          sortBy="createdAt"
          sortOrder="desc"
          /* Opening a row replaces the list with the thread drawer */
          focusedThreadMode={true}
          /* Gated on the panel being open. Acts on SELECTING an annotation */
          openAnnotationInFocusMode={open}
          replyPlaceholder="Reply"
          commentPlaceholder="New Comment"
          searchPlaceholder="Search Comments"
          /* a sheet rising from the bottom, rather than a card over the list */
          filterPanelLayout="bottomSheet"
          /* each section as an inline checkbox list, not a collapsed select */
          filterOptionLayout="checkbox"
          filters={SIDEBAR_FILTERS}
          pageModeComposerVariant="pageModeComposer"
          /* picks the list row's dialog template, and the drawer's */
          dialogVariant="sidebar"
          focusedThreadDialogVariant="focusedThread"
        />

        {/* Host DOM, not wireframe markup, so the menu is plain React state.
            The trigger stays in the control band, which is templated. */}
        {displayMenuOpen ? (
          <div className="hw-display-menu" role="menu">
            <button className="hw-display-row" type="button" onClick={markAllAsRead}>
              <span className="hw-display-label">Mark all as read</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CommentsPanel;
