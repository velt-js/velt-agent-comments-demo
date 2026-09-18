"use client";

import { useCallback, useEffect, useState } from "react";
import {
  VeltCommentsSidebarV2,
  useCommentAnnotations,
  useVeltClient,
} from "@veltdev/react";
import {
  CLOSE_SIDEBAR_BUTTON,
  DISPLAY_OPTIONS_BUTTON,
  OPEN_SIDEBAR_BUTTON,
} from "./ui-customization/buttonIds";

// The filter panel's sections, in order. V2 lists only what is passed here.
// No Priority: priorities are off in this demo, and V2 would show an empty section.
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
  const { client } = useVeltClient();
  const annotations = useCommentAnnotations();
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  // The thread a dialog's sidebar button asked to open, until its row is focused
  const [focusRequest, setFocusRequest] = useState<string | null>(null);

  // These triggers live inside wireframes, which can't take a React onClick, so
  // their `veltButtonClick` id is the only way across. Subscribing gives one
  // callback per press, unlike the last-event hook.
  useEffect(() => {
    if (!client) return;
    const subscription = client.on("veltButtonClick").subscribe((event) => {
      const id = event?.buttonContext?.clickedButtonId;
      // The drawer changes only on these two buttons and the toolbar button
      if (id === OPEN_SIDEBAR_BUTTON) {
        setSidebarOpen(() => true);
        setFocusRequest(event?.commentAnnotation?.annotationId ?? null);
        // The pin dialog gives way to the drawer, found or not
        client.getCommentElement()?.selectCommentByAnnotationId();
      }
      if (id === CLOSE_SIDEBAR_BUTTON) {
        setSidebarOpen(() => false);
        // A request still pending must not fire on the next open
        setFocusRequest(null);
      }
      if (id === DISPLAY_OPTIONS_BUTTON) setDisplayMenuOpen((open) => !open);
    });
    return () => subscription.unsubscribe();
  }, [client, setSidebarOpen]);

  // Open the requested thread in the drawer's focused view. V2 (6.0.11) enters it
  // only from a click on the thread's list row, so leave any open thread for the
  // list, then click that row. The pin dialog is closed once the thread shows.
  useEffect(() => {
    if (!open || !focusRequest) return;
    let timer: number | undefined;
    let tries = 0;
    const attempt = () => {
      const rail = document.querySelector(".hw-rail");
      const focused = rail?.querySelector(".hw-focus .vc-annotation-id");
      // Already open on this thread: nothing to do
      if (focused?.textContent?.trim() === focusRequest) {
        setFocusRequest(null);
        return;
      }
      const back = rail?.querySelector<HTMLElement>(
        ".hw-focus .velt-comments-sidebar-focused-thread-back-button-container",
      );
      const row = [...(rail?.querySelectorAll(".hw-panel-body .vc-annotation-id") ?? [])]
        .find((node) => node.textContent?.trim() === focusRequest)
        ?.closest<HTMLElement>(".velt-sidebar-list-item");
      if (row) {
        row.click();
        // The row click selects the thread; keep the pin dialog closed
        client?.getCommentElement()?.selectCommentByAnnotationId();
        setFocusRequest(null);
        return;
      }
      if (back) back.click();
      // Filtered out of the list (e.g. resolved): the drawer still opens
      if (++tries < 30) timer = window.setTimeout(attempt, 100);
      else setFocusRequest(null);
    };
    attempt();
    return () => window.clearTimeout(timer);
  }, [open, focusRequest, client]);

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

  return (
    <div
      className={`hw-rail${open ? " hw-rail--open" : ""}`}
      style={{
        width: open ? 400 : 0,
        boxShadow: open ? "-10px 0 28px rgba(0, 0, 0, 0.16)" : "none",
      }}
    >
      <div className="hw-rail-inner">
        <VeltCommentsSidebarV2
          embedMode={true}
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
          pageModePlaceholder="New Comment"
          searchPlaceholder="Search Comments"
          /* a sheet rising from the bottom, rather than a card over the list */
          filterPanelLayout="bottomSheet"
          /* a flat checkbox list per section, not a collapsed dropdown */
          filterOptionLayout="checkbox"
          filters={SIDEBAR_FILTERS}
          /* one flat list, no per-location group headers */
          groupConfig={{ enable: false }}
          /* Render every row, as V1 did. V2's virtual list forgets its measured row
             heights after a data refresh (SDK 6.0.11), leaving a blank tail */
          minBufferPx={100000}
          maxBufferPx={200000}
          pageModeComposerVariant="pageModeComposer"
          /* picks the list row's dialog template, and the drawer's */
          dialogVariant="sidebar"
          focusedThreadDialogVariant="focusedThread"
        />

        {/* Host DOM, not wireframe markup, so the menu is plain React state. The
            trigger stays in the control band, which is templated. */}
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
