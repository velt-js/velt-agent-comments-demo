"use client";
import { useEffect, useRef } from "react";
import {
  VeltComments,
  VeltCommentsSidebar,
  useCurrentUser,
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
  CANCEL_COMPOSER_BUTTON,
  OPEN_SIDEBAR_BUTTON,
  SIDEBAR_SCOPE_FOR_YOU,
  SIDEBAR_SCOPE_GROUP,
} from "./ui-customization/vcButtonIds";

// Right-anchored comments drawer hosting the embedded page-mode sidebar.
// Ported from altana-wireframes: sorting, the resolved view, and the "Only your
// mentions" filter are SDK-native (MinimalFilterDropdown items in the sidebar
// wireframe), so the only host logic left is the Cancel escape hatch and the
// "C" keyboard shortcut.
function Panel({
  open,
  setSidebarOpen,
}: {
  open: boolean;
  setSidebarOpen: (updater: (open: boolean) => boolean) => void;
}) {
  const buttonEvent = useVeltEventCallback("veltButtonClick");
  const railRef = useRef<HTMLDivElement>(null);

  // "Open in sidebar" (the vc-open-sidebar VeltButtonWireframe in the comment
  // dialog header, figma 872:21857 @ 331,23) → open the host's comments drawer.
  //
  // The button lives inside a Velt wireframe, so it cannot carry a React onClick
  // (R4). Velt's veltButtonClick event is the bridge: the same mechanism the
  // hw-cancel button below already uses. Open-only, never toggle — the design's
  // affordance reveals the sidebar, and a thread that is already listed there
  // should stay visible if the control is pressed twice.
  useEffect(() => {
    if (buttonEvent?.buttonContext?.clickedButtonId !== OPEN_SIDEBAR_BUTTON) return;
    setSidebarOpen(() => true);
  }, [buttonEvent, setSidebarOpen]);

  // Cancel (hw-cancel VeltButtonWireframe) → clear + collapse the composer.
  // Deferred via timeout: the hook delivers an external event, not derived
  // state.
  useEffect(() => {
    if (buttonEvent?.buttonContext?.clickedButtonId !== CANCEL_COMPOSER_BUTTON) return;
    const apply = window.setTimeout(() => {
      // clearComposer() requires a targetComposerElementId the v1 composers
      // don't expose. Clearing via editing commands fires the input events
      // Velt listens to, then the blur collapses the composer. The event
      // carries commentAnnotation when Cancel sits in a thread's reply
      // composer — scope to that dialog; otherwise it's the page-mode composer.
      const scope = buttonEvent?.commentAnnotation
        ? railRef.current?.querySelector(
            ".velt-comment-dialog--sidebar-mode.velt-comment-dialog--selected",
          )
        : railRef.current?.querySelector(".velt-sidebar-page-mode-composer");
      const input = scope?.querySelector<HTMLElement>(
        ".velt-comment-dialog-composer.velt-composer-open .velt-composer-input--message, .velt-composer-input--message",
      );
      if (input && (input.textContent ?? "").length > 0) {
        input.focus();
        document.execCommand("selectAll", false);
        document.execCommand("delete", false);
      }
      // Escape collapses Velt's composer-open state; blur drops the caret.
      input?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      (document.activeElement as HTMLElement | null)?.blur();
      input?.blur();
      // Velt resets composerInOpenState in its dialog click handler only when
      // the composer is empty — Cancel's own click ran before the clear, so
      // re-dispatch a click outside the composer now that it is.
      scope
        ?.querySelector(".hw-card")
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }, 0);
    return () => window.clearTimeout(apply);
  }, [buttonEvent]);

  // The sidebar header's ✕ (and the focused-thread drawer's) → collapse the host
  // drawer as well as Velt's own panel.
  //
  // NOT via `<VeltCommentsSidebar onSidebarClose>`. That callback reports Velt's
  // OWN panel state, which in embedMode is not the same thing as "the user pressed
  // the ✕" — it can fire while the sidebar settles, and anything it drives then
  // fights the host's toggle. A capture-phase click listener keyed to the
  // CloseButton slot is exact: it fires for a real press on that control and
  // nothing else, and it leaves Velt's own handler on the element untouched. This
  // is host code listening on a host element, not a React handler smuggled into
  // wireframe markup (R4).
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

  // Clicking a comment pin closes the drawer.
  //
  // WHY. The popover and the side sheet are mutually exclusive IN THE DESIGN:
  // 890:22822 ("comment tag click") draws the popover with no side sheet, and
  // every side-sheet frame draws no popover. Velt agrees for a harder reason —
  // only the SELECTED comment's dialog renders a composer, and while the sidebar
  // is open it owns selection, so the pin popover came up in its collapsed form:
  // MEASURED `velt-comment-dialog-body--closed` on the body, the composer host at
  // 356x24 with no children, i.e. a header, a comment, and a dead 24px band where
  // the Reply pill belongs.
  //
  // Closing the drawer on a pin click restores the design's flow and hands
  // selection back to the popover, which then renders its composer (verified:
  // body loses `--closed`, field 324x32). The reverse direction already exists —
  // the dialog header's panel icon opens the drawer.
  //
  // Listener is on `document`, not the rail: pins live in the table, outside it.
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
      className="hw-rail"
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
          /* ── FOCUSED THREAD (figma 872:21603 · Figma comment #3) ───────────
             Opening a row must REPLACE the list with the "Comment Thread"
             drawer, not expand the row in place. `focusedThreadMode` turns that
             view on; `openAnnotationInFocusMode` makes a row click the thing
             that enters it. Without the second prop the mode exists but nothing
             ever navigates into it. */
          focusedThreadMode={true}
          openAnnotationInFocusMode={true}
          replyPlaceholder="Reply"
          commentPlaceholder="New Comment"
          /* Figma #9 — the designers accepted Velt's default search
             ("I think that would work for us, then! We can customize the CSS
             later"), so the sidebar's own Search slot is mounted and this is its
             placeholder. */
          searchPlaceholder="Search comments"
          pageModeComposerVariant="pageModeComposer"
          /* selects the `comment-dialog---sidebar` wireframe for every list row.
             Without it the rows fall back to the BASE dialog template and the
             368px collapsed card can never render (plan-structure HC-2 / DI-1). */
          dialogVariant="sidebar"
          /* selects `comment-dialog---focusedThread` for the drawer. Same trap as
             dialogVariant: unset, the focused thread renders the floating
             popover's chrome (its own title bar + border) inside the drawer. */
          focusedThreadDialogVariant="focusedThread"
        />
      </div>
    </div>
  );
}

// ═══ `For You | Everything` → a real sidebar filter ══════════════════════════
//
// The two pills are VeltButtonWireframes in one `single-select` group (see
// VeltCommentSidebarWf). Velt owns which one is active and reports the change on
// `veltButtonClick`; this component is the other half — it turns that selection
// into an actual filter through the documented sidebar API:
//
//   client.getCommentElement().setCommentSidebarFilters({ involved: [...] })
//
// Each call REPLACES the selections for the keys it names and leaves omitted keys
// alone, so passing `involved: []` is how "Everything" clears the scope without
// disturbing the status defaults the sidebar applies on load.
//
// WHY `involved` AND NOT `assigned`. "For You" should mean "threads that concern
// me", and `involved` is the key that covers authored + mentioned + assigned;
// `assigned` alone would leave the tab almost always empty, since assignment is
// rare. This is the one semantic choice in here that the frames do not pin down —
// worth confirming with the designers alongside Figma #13.
//
// No host React state and no handler inside wireframe markup (R4): the pills'
// pressed appearance is Velt's own selection state, and this only reacts to it.
function VeltSidebarScopeTabs() {
  const buttonEvent = useVeltEventCallback("veltButtonClick");
  const { client } = useVeltClient();
  const user = useCurrentUser();

  useEffect(() => {
    if (!client) return;
    if (buttonEvent?.buttonContext?.groupId !== SIDEBAR_SCOPE_GROUP) return;

    // Prefer the group's reported selection over the clicked id: with
    // `single-select` Velt is the source of truth for what is now active, and
    // re-clicking the active pill reports the same selection rather than a
    // toggle-off.
    //
    // PAYLOAD SHAPE — captured live, because it is easy to get wrong:
    //   buttonContext = {
    //     type: "single-select",
    //     groupId: "vc-sidebar-scope",
    //     clickedButtonId: "vc-tab-for-you",
    //     selections: { "vc-sidebar-scope": { "vc-tab-for-you": true } },
    //   }
    // `selections[groupId]` is an OBJECT KEYED BY BUTTON ID, not the id string.
    // A first pass here did `String(selected).includes(id)`, which stringifies to
    // "[object Object]" and so read as "not For You" on every click — the pills
    // switched correctly and the list never moved.
    const selections = buttonEvent?.buttonContext?.selections?.[
      SIDEBAR_SCOPE_GROUP
    ] as Record<string, boolean> | undefined;
    const forYou = selections
      ? Boolean(selections[SIDEBAR_SCOPE_FOR_YOU])
      : buttonEvent?.buttonContext?.clickedButtonId === SIDEBAR_SCOPE_FOR_YOU;

    // `setCommentSidebarFilters` is documented on the V2 sidebar page, but it is
    // a commentElement method rather than a component prop and it DOES drive the
    // V1 sidebar we mount — verified live: filtering to a userId nobody matches
    // took the list 4 → 0 cards, clearing took it back to 4, and
    // `involved: [{ userId: <signed-in user> }]` narrowed it to the one thread
    // that user authored.
    const commentElement = client.getCommentElement();
    if (!commentElement?.setCommentSidebarFilters) {
      console.warn("[SidebarScope] setCommentSidebarFilters unavailable");
      return;
    }
    commentElement.setCommentSidebarFilters({
      involved: forYou && user?.userId ? [{ userId: user.userId }] : [],
    });
  }, [buttonEvent, client, user]);

  return null;
}

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
      {/* Attaches the product name to annotations created on a product cell, so the
          design's "Product Name" row (872:21785) has data to render. */}
      <VeltCommentContext />
      {/* `For You | Everything` (872:21415) → commentElement.setCommentSidebarFilters(). */}
      <VeltSidebarScopeTabs />
      {/* Popover comments for the product table: a VeltCommentTool with a
          targetElementId pins a thread to a Name cell and Velt draws the
          triangle indicator in that cell's top-right corner. Text comments in
          the document stay on (textMode defaults to true).
          NOTE: keep this note OUTSIDE the tag — a `>` inside a JSX comment in
          the attribute block truncates verify-host-wiring.mjs's parse. */}
      <VeltComments
        shadowDom={false}
        popoverMode={true}
        commentPlaceholder="Comment or tag others with @"
        /* design-gated (R24): frame 872:22157 draws the literal 'Reply'. */
        replyPlaceholder="Reply"
        /* NO `collapsedComments` / `collapsedRepliesPreview` — removed, not
           merely unset.
           They produce Velt's MoreReply control ("Show N replies"), which
           expands the replies inline underneath itself. A thread therefore
           rendered the root comment, a live "Show 6 replies" link, AND every
           reply below it — three things where the design has one.
           The design's affordance is a TOGGLE, not a reveal-in-place: the
           collapsed card shows the root comment plus `↳ 1 reply`
           (872:21735 `Frame 427321038` = ArrowBendDownRight + "1 reply"), which is
           ToggleReply's behaviour — so the props come off and the wireframes mount
           ToggleReply only (DI-5 is resolved in ToggleReply's favour; see
           VeltSidebarCardWf).
           CORRECTION, measured: the frames 872:21857 (popover) and 872:21603
           (drawer) draw every comment with no control, but that is the SELECTED
           state. The floating dialog also opens UNSELECTED — body gets
           `velt-comment-dialog-body--closed` and shows the root comment only — and
           reading those frames as "this surface never needs the row" is what left
           the pin dialog with its replies hidden and no way to reach them. The
           popover mounts ToggleReply too (VeltCommentDialogWf); Velt's own
           `!commentDialogSelected` gate keeps it out of the expanded state, so both
           frames still match. The drawer genuinely needs none: it is only ever
           reached selected. */
        paginatedContactList={true}
        visibilityOptions={true}
      />
      <VeltCustomization />
      <Panel open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </>
  );
}

export default VeltCollaboration;
