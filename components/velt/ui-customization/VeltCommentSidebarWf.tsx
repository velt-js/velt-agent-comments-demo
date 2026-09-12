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

// The sidebar: header, control row, list, page-mode composer.
//
// The control row keeps the design's drawn controls but Velt's behaviour
// underneath — search is Velt's own Search slot, and the funnel opens its filter
// panel. Per design review, Velt's defaults here were accepted as-is.
//
// Still open: where resolved comments are seen. The frame draws no control for it.

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

          {/* Search + two 32px buttons, which replace the old For You /
              Everything pills — the V2 drawer puts this row in their place.
              Search fills the remaining width so the buttons stay square.
              Both buttons are Velt's own, which is why there's no host filter
              state: the funnel opens the filter panel (involved, assigned,
              people, status, priority, tagged). */}
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

{/* The band's second button and its menu. Drawn as the frame draws it,
                but it opens display options — "Columns" means nothing over a list
                of comments.
                VeltButtonWireframes rather than an SDK dropdown: `FilterButton`
                is the only secondary control this sidebar has. The candidates
                (`MinimalActionsDropdown`, `MinimalFilterDropdown`, `ActionButton`,
                `FullscreenButton`, `ResetFilterButton`) all render 0x0 here — the
                first two are comment-dialog slots re-exported on the sidebar
                namespace. So the ids are the bridge and VeltCollaboration owns the
                behaviour. */}
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

        {/* The focused-thread view, which Velt swaps in for the list when a row
            is opened.
            A SIBLING of Panel, not a child: entering focus mode collapses the
            panel to 0x0, and a FocusedThread nested inside it goes with it.
            The header is assembled from two owners, because FocusedThread only
            exposes BackButton and DialogContainer — `‹` and `✕` here, `⋯` and `✓`
            from the focusedThread dialog variant, lifted into this band by CSS. */}
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
