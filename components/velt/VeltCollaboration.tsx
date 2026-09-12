"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  VeltComments,
  VeltCommentsSidebar,
  useCommentAnnotations,
  useVeltClient,
  useVeltEventCallback,
} from "@veltdev/react";
import VeltInitializeDocument from "./VeltInitializeDocument";
import SeedAgentComments from "./SeedAgentComments";
import { AgentRunController } from "./AgentRunController";
import { ContactsRegistrar } from "./ContactsRegistrar";
import { VeltCommentContext } from "./VeltCommentContext";
import { VeltCustomization } from "./ui-customization/VeltCustomization";
import {
  DISPLAY_MARK_ALL_READ,
  DISPLAY_OPTIONS_BUTTON,
  OPEN_SIDEBAR_BUTTON,
} from "./ui-customization/vcButtonIds";

// Right-anchored drawer hosting the embedded page-mode sidebar. Sorting,
// filtering and the resolved view are all SDK-native, so what's left here is the
// glue the SDK can't own: opening/closing the host drawer, and the display menu.
function Panel({
  open,
  setSidebarOpen,
}: {
  open: boolean;
  setSidebarOpen: (updater: (open: boolean) => boolean) => void;
}) {
  const buttonEvent = useVeltEventCallback("veltButtonClick");
  const railRef = useRef<HTMLDivElement>(null);
  const { client } = useVeltClient();
  const annotations = useCommentAnnotations();

  // The comment dialog's "open in sidebar" button. It lives inside a wireframe,
  // so it can't take a React onClick — veltButtonClick is the only way across.
  // Open-only, not a toggle: pressing it twice shouldn't hide the thread.
  useEffect(() => {
    if (buttonEvent?.buttonContext?.clickedButtonId !== OPEN_SIDEBAR_BUTTON) return;
    setSidebarOpen(() => true);
  }, [buttonEvent, setSidebarOpen]);

  // The display-options menu is wireframe markup, so it can't read React state.
  // The host publishes open/closed as a class instead and the stylesheet keys off
  // it. Kept out of useState so opening the menu doesn't re-render the sidebar.
  const setDisplayMenuOpen = useCallback((open: boolean) => {
    // `.hw-rail-inner`, not `.hw-rail`: the rail's className is a React
    // expression, so a re-render would wipe a class set imperatively on it.
    railRef.current
      ?.querySelector(".hw-rail-inner")
      ?.classList.toggle("hw-display-open", open);
  }, []);

  // useVeltEventCallback holds the last event, so an effect that also depends on
  // something with an unstable identity (`client`) fires again for the same press.
  // Dedupe on the event object so one press runs the handler once.
  const handledEventRef = useRef<unknown>(null);
  const takeButtonEvent = useCallback(
    (id: string) => {
      if (buttonEvent?.buttonContext?.clickedButtonId !== id) return false;
      if (handledEventRef.current === buttonEvent) return false;
      handledEventRef.current = buttonEvent;
      return true;
    },
    [buttonEvent],
  );

  useEffect(() => {
    if (!takeButtonEvent(DISPLAY_OPTIONS_BUTTON)) return;
    railRef.current
      ?.querySelector(".hw-rail-inner")
      ?.classList.toggle("hw-display-open");
  }, [takeButtonEvent]);

  // Close on an outside press. Capture phase, so Velt's own handlers can't
  // swallow it first.
  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest?.(".hw-ctl-display")) return;
      setDisplayMenuOpen(false);
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [setDisplayMenuOpen]);

  // "Mark all as read". There's no bulk API — only markAsRead(annotationId) — so
  // walk the threads the panel already has. Safe to depend on `annotations`
  // because of the dedupe above.
  useEffect(() => {
    if (!takeButtonEvent(DISPLAY_MARK_ALL_READ)) return;
    const commentElement = client?.getCommentElement();
    if (!commentElement) return;
    for (const annotation of annotations ?? []) {
      if (annotation?.annotationId) void commentElement.markAsRead(annotation.annotationId);
    }
    setDisplayMenuOpen(false);
  }, [takeButtonEvent, client, annotations, setDisplayMenuOpen]);

  // The sidebar's ✕ has to collapse the host drawer too. Not via onSidebarClose:
  // in embedMode that reports Velt's own panel state and can fire while the
  // sidebar settles, which fights the host toggle. Keying off a real press on the
  // CloseButton slot is exact.
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

  // Clicking a pin closes the drawer: the popover and the side sheet are
  // alternatives, not companions. Practically it also matters because only the
  // selected thread's dialog gets a composer, and an open sidebar owns selection —
  // leave it open and the popover comes up with no Reply field.
  // On `document`, not the rail: pins live in the table.
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

  // "Hit C to leave a comment" — focus the page-mode composer input.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.closest('input, textarea, [contenteditable="true"]');
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        railRef.current
          ?.querySelector<HTMLElement>(
            ".velt-sidebar-page-mode-composer .velt-composer-input--message, .velt-sidebar-page-mode-composer [contenteditable]",
          )
          ?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      /* The stylesheet keys off `hw-rail--open` to hide the pin popover while the
         drawer owns the thread. It has to be the open flag rather than the
         drawer's markup, which survives inside the collapsed rail. */
      className={`hw-rail${open ? " hw-rail--open" : ""}`}
      ref={railRef}
      style={{
        width: open ? 400 : 0,
        boxShadow: open ? "-10px 0 28px rgba(0, 0, 0, 0.16)" : "none",
      }}
    >
      <div className="hw-rail-inner">
        <VeltCommentsSidebar
          embedMode={true}
          pageMode={true}
          shadowDom={false}
          defaultMinimalFilter="open"
          sortBy="createdAt"
          sortOrder="desc"
          /* Opening a row replaces the list with the thread drawer.
             `focusedThreadMode` turns the view on; `openAnnotationInFocusMode` is
             what navigates into it. */
          focusedThreadMode={true}
          /* Gated on the panel being open. This acts on SELECTING an annotation,
             and a pin click selects one — left always on, clicking a pin while the
             panel was shut also drove the focused thread behind the collapsed rail,
             giving two live composers. Velt's @ tool then targeted the wrong one.
             Row clicks only happen with the panel open, so nothing is lost. */
          openAnnotationInFocusMode={open}
          replyPlaceholder="Reply"
          commentPlaceholder="New Comment"
          /* Velt's own search, per design review. */
          searchPlaceholder="Search Comments"
          /* Every filter is off by default, so the funnel's panel needs these to
             render at all. `name` is the group heading — leave it out and the
             panel is six unlabelled All/Me blocks. `involved` covers authored +
             mentioned + assigned; `people` is the author. */
          /* a sheet rising from the bottom of the panel, rather than a card
             overlaying the list it filters. */
          filterPanelLayout="bottomSheet"
          filterConfig={{
            involved: { enable: true, name: "Involved" },
            assigned: { enable: true, name: "Assigned to" },
            people: { enable: true, name: "Created by" },
            status: { enable: true, name: "Status" },
            priority: { enable: true, name: "Priority" },
            tagged: { enable: true, name: "Tagged" },
          }}
          pageModeComposerVariant="pageModeComposer"
          /* picks the list row's dialog template; without it rows fall back to
             the base one. */
          dialogVariant="sidebar"
          /* same for the drawer; unset, it renders the popover's chrome inside
             the panel. */
          focusedThreadDialogVariant="focusedThread"
        />
      </div>
    </div>
  );
}

// The `For You | Everything` pills and their `setCommentSidebarFilters` bridge
// used to live here. Both are gone: the Altana V2 drawer (44:22040) hides
// `Tab Bar Secondary` and replaces that row with `Table Controls` (44:22045) —
// search plus a funnel and a sliders button, each of which opens one of Velt's
// OWN sidebar dropdowns. The `involved` filter the "For You" pill was
// reimplementing by hand is a native option inside the funnel's filter panel, so
// there is no host filter state left to keep in sync.

// [Velt] Unstyled base — the customization is authored strictly against Velt's
// unstyled DOM, so every pipeline snapshot, the style plan, and the judge all
// assume it. `keepFunctionalStyles` retains layout/positioning mechanics while
// dropping Velt's cosmetic defaults.
function VeltUnstyledBase() {
  const { client } = useVeltClient();

  useEffect(() => {
    if (!client) return;
    client.setUnstyledMode(true, { keepFunctionalStyles: true });
  }, [client]);

  // ── "Assign on Send" (Design Suggestion board, the five Composer frames) ────
  //
  // The updated design replaces the composer's inline `Assign to <user> ⌄` strip
  // with a CHECKBOX on a second row — `Composer / mention - not auto assign`
  // (7:28165) and `… - auto assign` (7:28209) are the two states, and
  // `Composer / no mention` (8:28235) shows the row is present whether or not the
  // text holds a mention.
  //
  // That is a native switch, not something to rebuild: `AssignToType` is
  // `'dropdown' | 'checkbox'` and the dropdown is what we have been rendering.
  // `Composer.AssignUser` stays declared in the wireframe — it is the slot the
  // checkbox renders into; only what Velt puts inside it changes.
  useEffect(() => {
    if (!client) return;
    client.getCommentElement().setAssignToType({ type: "checkbox" });
  }, [client]);

  return null;
}

export function VeltCollaboration({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (updater: (open: boolean) => boolean) => void;
}) {
  return (
    <>
      <VeltUnstyledBase />
      <VeltInitializeDocument />
      <SeedAgentComments />
      {/* Turns `commentActionClicked` into real backend writes (progress + actions demo). */}
      <AgentRunController />
      <ContactsRegistrar />
      {/* Attaches the product name to annotations on a product cell, so the card's
          context row has something to show. */}
      <VeltCommentContext />
      {/* Popover comments for the product table: a VeltCommentTool with a
          targetElementId pins a thread to a Name cell. Text comments in the
          document stay on (textMode defaults to true). */}
      <VeltComments
        shadowDom={false}
        popoverMode={true}
        commentPlaceholder="Comment or tag others with @"
        /* the design's literal placeholder. */
        replyPlaceholder="Reply"
        /* Deliberately no `collapsedComments` / `collapsedRepliesPreview`: those
           give you MoreReply, which reveals the replies inline. The design wants a
           toggle (`↳ 1 reply`), which is ToggleReply — mounted in the wireframes
           instead. */
        paginatedContactList={true}
        visibilityOptions={true}
      />
      <VeltCustomization />
      <Panel open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </>
  );
}

export default VeltCollaboration;
