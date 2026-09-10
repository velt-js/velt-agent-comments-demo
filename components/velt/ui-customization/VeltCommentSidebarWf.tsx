"use client";

import {
  VeltButtonWireframe,
  VeltCommentsSidebarWireframe,
  VeltIf,
} from "@veltdev/react";
import { EmptyIllustration } from "@/components/icons";
import { VcMagnifyingGlassIcon } from "./VcIcons";
import {
  SIDEBAR_SCOPE_EVERYTHING,
  SIDEBAR_SCOPE_FOR_YOU,
  SIDEBAR_SCOPE_GROUP,
} from "./vcButtonIds";

// ═══ surface-sidebar (flows board 872:21663 "Normal Sidebar", 400x884) ════════
//
// Four stacked bands, straight off the frame:
//
//   872:21412  header            400x48   "Comments" @16,12  +  Icon/X @360,12
//   872:21415  Tab Bar Secondary 400x56   navigation + search
//   872:21416  body              400x724  368px cards, 12px gaps
//   872:21490  Input/Find Input  400x56   page-mode composer
//
// ── The control row: drawn pills, Velt behaviour ─────────────────────────────
// `For You | Everything` is built from ACTION COMPONENTS (two VeltButtonWireframes
// in one single-select group) driving the documented sidebar filter API, and
// SEARCH is Velt's own Search slot — thread #9 settled that one outright ("Does
// Velt have a default for searching?" → yes → "I think that would work for us,
// then! We can customize the CSS later").
//
// Thread #6, pinned on this row, says "the default navigation, etc. from Velt are
// good with us!". That is permission to keep Velt's BEHAVIOUR, not an instruction
// to swap the drawn pills for a dropdown — so the pills are drawn as drawn and the
// filtering underneath them is Velt's.
//
// STILL OPEN: thread #11 asked where resolved comments are seen. The dropdown that
// used to sit here answered it incidentally; these two pills do not, and the frame
// draws no third control. Flagged rather than invented.
export function VeltCommentSidebarWf() {
  return (
    <VeltCommentsSidebarWireframe>
      <div className="hw-panel">
        <VeltCommentsSidebarWireframe.Skeleton>
          <div className="hw-skeleton">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div className="hw-skeleton-card" key={i}>
                <div className="hw-skeleton-row">
                  <span className="hw-skeleton-circle" />
                  <span className="hw-skeleton-bar hw-skeleton-bar--name" />
                  <span className="hw-skeleton-bar hw-skeleton-bar--time" />
                </div>
                <span className="hw-skeleton-bar hw-skeleton-bar--line1" />
                <span className="hw-skeleton-bar hw-skeleton-bar--line2" />
              </div>
            ))}
          </div>
        </VeltCommentsSidebarWireframe.Skeleton>

        <VeltCommentsSidebarWireframe.Panel>
          {/* ── band 1: header (872:21412) ───────────────────────────────── */}
          <div className="hw-panel-header">
            <h2>Comments</h2>
            {/* The design's `Icon / X`. CloseButton is Velt's own slot, so the
                behaviour is Velt's; the host mirrors it into the drawer width via
                <VeltCommentsSidebar onSidebarClose> (see VeltCollaboration). */}
            <VeltCommentsSidebarWireframe.CloseButton className="hw-panel-close" />
          </div>

          {/* ── band 2: `For You | Everything` + search (872:21415) ─────────
              The frame draws two TAB PILLS, and that is what this is now. The
              earlier pass put Velt's MinimalFilterDropdown here instead, reading
              Figma #6 ("the default navigation, etc. from Velt are good with us!")
              as "use the default control". Re-read in context — the note is pinned
              ON this row, i.e. it is about the default NAVIGATION BEHAVIOUR being
              acceptable, not about replacing the drawn pills with a dropdown. So
              the pills are drawn as drawn, and Velt still owns the behaviour
              underneath them.

              Two action components in ONE single-select group, so Velt manages
              which pill is active and emits the change — no host state, and no
              React handler inside wireframe markup (R4):

                type="single-select" + group   → radio behaviour across the pair
                active on "Everything"        → the frame's selected pill
                id                            → what the host branches on

              The host turns the click into a real filter through the documented
              sidebar API (`commentElement.setCommentSidebarFilters`) — see
              VeltSidebarScopeTabs in components/velt/VeltCollaboration.tsx. */}
          <div className="hw-panel-controls">
            <div className="hw-tabs">
              <VeltButtonWireframe
                id={SIDEBAR_SCOPE_FOR_YOU}
                type="single-select"
                group={SIDEBAR_SCOPE_GROUP}
                className="hw-tab"
              >
                <span className="hw-tab-label">For You</span>
              </VeltButtonWireframe>
              <VeltButtonWireframe
                id={SIDEBAR_SCOPE_EVERYTHING}
                type="single-select"
                group={SIDEBAR_SCOPE_GROUP}
                active
                className="hw-tab"
              >
                <span className="hw-tab-label">Everything</span>
              </VeltButtonWireframe>
            </div>

            {/* #9 — Velt's default search, in the design's 32x32 bordered box.
                Left childless so Velt renders its real input; the collapsed
                magnifier is drawn by CSS on this class. Placeholder comes from
                <VeltCommentsSidebar searchPlaceholder>. */}
            <div className="hw-search-slot">
              <span className="hw-search-glyph" aria-hidden="true">
                <VcMagnifyingGlassIcon />
              </span>
              <VeltCommentsSidebarWireframe.Search className="hw-search" />
            </div>
          </div>

          <VeltCommentsSidebarWireframe.EmptyPlaceholder>
            <div className="hw-empty">
              <EmptyIllustration />
              <VeltIf condition="{noCommentsFound}">
                <h3>Be the first to comment</h3>
                <p>
                  Hit <kbd>C</kbd> to leave a comment or use the top of this panel
                </p>
              </VeltIf>
              <VeltIf condition="!{noCommentsFound}">
                <h3>No comments match your filters</h3>
                <p>Try adjusting or clearing the filters above</p>
              </VeltIf>
            </div>
          </VeltCommentsSidebarWireframe.EmptyPlaceholder>

          {/* ── band 3: the list (872:21416) ─────────────────────────────── */}
          <div className="hw-panel-body">
            <VeltCommentsSidebarWireframe.List />
          </div>

          {/* ══ fam-composer / surface-composer-page (figma 872:22156) ══════════════
              `.vc-composer-page` is the PageModeComposer host itself (plan-structure
              adoption row: velt-comments-sidebar-page-mode-composer-wireframe →
              .vc-composer-page). The 368x32 pill it contains is NOT drawn here: Velt
              renders it by cloning the comment-dialog wireframe registered under the
              variant the host's `pageModeComposerVariant` prop names — see
              VeltComposerWf.tsx `VeltPageModeComposerWf`. */}
          <div className="hw-panel-composer">
            <VeltCommentsSidebarWireframe.PageModeComposer className="vc-composer-page" />
          </div>
        </VeltCommentsSidebarWireframe.Panel>

        {/* ── the FOCUSED THREAD view (flows board 872:21662 → 872:21603
              "Comment Drawer", 448x884) ───────────────────────────────────────
            Velt swaps this in for the list when a row is opened — turned on by
            `focusedThreadMode` + `openAnnotationInFocusMode` on the host
            component. Figma thread #3 marks it in scope ("the design of this
            threaded comment panel is relevant").

            IT IS A SIBLING OF `Panel`, NOT A CHILD — live-verified. Entering focus
            mode collapses `app-comment-sidebar-panel` to 0x0, so a FocusedThread
            nested inside Panel's markup went to 0x0 with it and the drawer rendered
            as a blank white column. The V1 slot tree agrees: Skeleton, Panel,
            EmptyPlaceholder, List, PageModeComposer and FocusedThread are all
            top-level slots of the sidebar, and only the ones that live INSIDE the
            panel may be nested in it.

            The header the frame draws is `‹  Comment Thread   ⋯  ✓  ✕`, assembled
            from two owners because FocusedThread exposes only BackButton and
            DialogContainer:
              ‹  ✕ → this file (BackButton + a second CloseButton — Panel's own X
                     is hidden with the panel in this mode, so the drawer needs
                     its own)
              ⋯ ✓  → the comment dialog registered under variant="focusedThread"
                     (VeltFocusedThreadWf.tsx), lifted into this band by CSS.
                     They are COMMENT-DIALOG slots: they only resolve against an
                     annotation, so mounting them out here would render inert. */}
        <VeltCommentsSidebarWireframe.FocusedThread className="hw-focus">
          <div className="hw-focus-header">
            {/* BackButton and CloseButton both DROP their children (verified: the
                slot adopts the class but its subtree comes back as Angular anchors
                only), so the glyph is injected by CSS on the class instead — the
                `::before` route from the wireframe gotchas, which survives the
                clone. That is why these two are self-closing. */}
            <VeltCommentsSidebarWireframe.FocusedThread.BackButton className="hw-focus-back" />
            <h2>Comment Thread</h2>
            <VeltCommentsSidebarWireframe.CloseButton className="hw-focus-close" />
          </div>
          <VeltCommentsSidebarWireframe.FocusedThread.DialogContainer className="hw-focus-body" />
        </VeltCommentsSidebarWireframe.FocusedThread>
      </div>
    </VeltCommentsSidebarWireframe>
  );
}

export default VeltCommentSidebarWf;
