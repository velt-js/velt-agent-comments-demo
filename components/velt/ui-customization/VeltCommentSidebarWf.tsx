"use client";

import {
  VeltButtonWireframe,
  VeltCommentsSidebarWireframe,
  VeltIf,
} from "@veltdev/react";
import type { ReactNode } from "react";
import React from "react";
import { EmptyIllustration } from "@/components/icons";
import {
  VcFunnelSimpleIcon,
  VcMagnifyingGlassIcon,
  VcSlidersIcon,
} from "./VcIcons";
import {
  DISPLAY_MARK_ALL_READ,
  DISPLAY_OPTIONS_BUTTON,
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
/**
 * One filter group — heading + its repeated checkbox rows.
 *
 * The six groups (`Involved`, `Assigned`, `People`, `Status`, `Priority`,
 * `Tagged`) are separate components with identical shapes, so they are passed in
 * rather than written out six times. `Item` is a REPEATER: Velt clones this one
 * declaration once per option, so `Checkbox`, `Name` and `Count` here describe
 * every row in the group.
 *
 * `Item.Checkbox` stays CHILDLESS deliberately — it owns `Checked`/`Unchecked`
 * and Velt swaps the right one in; supplying children would freeze the row on one
 * state. `Search` is not mounted: it is the type-ahead for very long option lists
 * and 44:22045 draws none.
 */
type FilterGroupSlot = React.FC<{ className?: string; children?: ReactNode }> & {
  Name: React.FC<{ className?: string }>;
  Item: React.FC<{ className?: string; children?: ReactNode }> & {
    Checkbox: React.FC<{ className?: string }>;
    Name: React.FC<{ className?: string }>;
    Count: React.FC<{ className?: string }>;
  };
};

function FilterGroup({ group: Group }: { group: FilterGroupSlot }) {
  return (
    <Group className="hw-filter-group">
      <Group.Name className="hw-filter-group-name" />
      <Group.Item className="hw-filter-item">
        <Group.Item.Checkbox className="hw-filter-check" />
        <Group.Item.Name className="hw-filter-item-name" />
        <Group.Item.Count className="hw-filter-item-count" />
      </Group.Item>
    </Group>
  );
}

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

          {/* ── band 2: search + filters (44:22045 `Table Controls`) ────────
              REPLACES the `For You | Everything` tab pills. The Altana V2 drawer
              (44:22040) hides `Tab Bar Secondary` outright and puts this row in
              its place, so the pills — and the host-side
              `setCommentSidebarFilters` bridge that drove them — are gone.

              Spec, read off 44:22045:
                Table Controls  400 Fill x 56 Hug, padding 12/16, gap 8, row
                  Search    288 Fill x 32, leading Icon/MagnifyingGlass,
                            placeholder "Search Comments"
                  Filters   32x32 Secondary, Icon/FunnelSimple
                  Columns   32x32 Secondary, Icon/Sliders
                (Row Count, Groups, Highlights and Pill/Smart Groups are hidden.)
              288 + 8 + 32 + 8 + 32 = 368 = 400 - 16 - 16, so the search fills
              whatever is left and the two buttons stay square.

              BEHAVIOUR IS VELT'S. The two buttons are not custom host state —
              each is a native sidebar dropdown, which is why the custom filter
              logic is no longer needed:
                Filters (funnel)  -> the full filter panel: involved, assigned,
                                     people, status, priority, tagged, location.
                                     "involved" is what the old `For You` pill
                                     was reimplementing by hand.
                Columns (sliders) -> the minimal filter/sort dropdown: sort by
                                     date or unread, filter all/open/resolved/
                                     read/unread/assigned-to-me. */}
          <div className="hw-panel-controls">
            {/* Search: childless so Velt renders its real input. The magnifier is
                our own leading glyph; the placeholder comes from
                <VeltCommentsSidebar searchPlaceholder="Search Comments">. */}
            <div className="hw-search-slot">
              <span className="hw-search-glyph" aria-hidden="true">
                <VcMagnifyingGlassIcon />
              </span>
              <VeltCommentsSidebarWireframe.Search className="hw-search" />
            </div>

            <VeltCommentsSidebarWireframe.FilterButton className="hw-ctl-btn">
              <span className="hw-icon-btn">
                <VcFunnelSimpleIcon />
              </span>
            </VeltCommentsSidebarWireframe.FilterButton>

{/* ── the band's SECOND 32x32 Secondary button (44:21925 `Columns`,
                   Icon/Sliders) and the menu it opens ─────────────────────────
                Drawn exactly as the frame draws it; what it OPENS is this
                surface's display options, because "Columns" is meaningless over
                a list of comments — Table Controls is Altana's own TABLE
                component reused in the drawer, and the frame already switches off
                Row Count, Groups, Highlights and Smart Groups for that reason.

                Built from VeltButtonWireframes, not an SDK dropdown: probed live,
                every candidate slot clones into the registry twin and never into
                the panel, staying 0x0 — `MinimalActionsDropdown` and
                `MinimalFilterDropdown` are multi-thread COMMENT DIALOG slots
                (constants.d.ts: VELT_MULTI_THREAD_COMMENT_DIALOG_MINIMAL_*)
                merely re-exported on the sidebar namespace, and `ActionButton`,
                `FullscreenButton` and `ResetFilterButton` never render here
                either. `FilterButton` is the only secondary control this sidebar
                has. So the ids below are the bridge and VeltCollaboration owns
                the behaviour, the same contract `vc-open-sidebar` uses (R4). */}
            <div className="hw-ctl-display">
              <VeltButtonWireframe
                id={DISPLAY_OPTIONS_BUTTON}
                type="button"
                className="hw-ctl-btn"
              >
                <span className="hw-icon-btn">
                  <VcSlidersIcon />
                </span>
              </VeltButtonWireframe>

              {/* The menu. Hidden until the host puts `hw-display-open` on the
                  rail — it cannot gate on React state, since this is wireframe
                  markup, and Velt's own toggle-active class is not part of the
                  documented contract. Same chrome as the comment kebab menu. */}
              <div className="hw-display-menu" role="menu">
                <VeltButtonWireframe
                  id={DISPLAY_MARK_ALL_READ}
                  type="button"
                  className="hw-display-row"
                >
                  <span className="hw-display-label">Mark all as read</span>
                </VeltButtonWireframe>
              </div>
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

        {/* ── the filter panel the funnel opens (44:22045 `Filters`) ─────────
            A TOP-LEVEL slot and a SIBLING of Panel, the same way FocusedThread
            is. It was never declared, which is why `FilterButton` looked inert:
            the trigger had nothing to open. Declaring it is also what makes the
            old `For You | Everything` bridge unnecessary — `Involved` below is
            the native version of the filter that pill was reimplementing with
            `setCommentSidebarFilters`, and it comes with People, Assigned,
            Status, Priority and Tagged alongside it for free. */}
        <VeltCommentsSidebarWireframe.Filter className="hw-filter">
          <div className="hw-filter-head">
            <VeltCommentsSidebarWireframe.Filter.Title className="hw-filter-title" />
            <VeltCommentsSidebarWireframe.Filter.CloseButton className="hw-filter-close" />
          </div>
          <div className="hw-filter-body">
{/* Each group owns its heading and its rows. The heading was missing
                because these six were declared CHILDLESS, which hands the whole
                group to Velt's default template — and that template draws the
                checkbox rows but no `Name`, so the panel read as six identical
                `All / Me / User 2 / ...` blocks with nothing saying which was
                which.
                The earlier attempt at fixing it declared `Name` + a CHILDLESS
                `Item` and collapsed the panel to nothing. That was the container
                rule biting, not a repeater quirk: `Item` is itself a container
                (Checkbox / Name / Count), so declaring it childless left every
                repeated row with no content to draw. Declaring the full row tree
                is what makes it work — verified live: 6 headings, 20 rows. */}
            <FilterGroup group={VeltCommentsSidebarWireframe.Filter.Involved} />
            <FilterGroup group={VeltCommentsSidebarWireframe.Filter.Assigned} />
            <FilterGroup group={VeltCommentsSidebarWireframe.Filter.People} />
            <FilterGroup group={VeltCommentsSidebarWireframe.Filter.Status} />
            <FilterGroup group={VeltCommentsSidebarWireframe.Filter.Priority} />
            <FilterGroup group={VeltCommentsSidebarWireframe.Filter.Tagged} />
          </div>
          <div className="hw-filter-foot">
            <VeltCommentsSidebarWireframe.Filter.ResetButton className="hw-filter-reset" />
            <VeltCommentsSidebarWireframe.Filter.DoneButton className="hw-filter-done" />
          </div>
        </VeltCommentsSidebarWireframe.Filter>

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
