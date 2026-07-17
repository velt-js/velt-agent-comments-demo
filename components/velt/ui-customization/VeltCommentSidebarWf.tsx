"use client";

import { VeltCommentsSidebarWireframe, VeltIf } from "@veltdev/react";
import { CheckIcon, EmptyIllustration, FilterLinesIcon } from "@/components/icons";

function FilterRow({ label }: { label: string }) {
  return (
    <div className="hw-filter-row">
      <span className="hw-filter-label">{label}</span>
      <span className="hw-filter-check">
        <CheckIcon />
      </span>
    </div>
  );
}

// Comments sidebar wireframe — ported from altana-wireframes. A "Comments"
// header with a minimal sort/filter dropdown, the page-mode composer, an empty
// state, and the comment list. The loading skeleton mirrors the design's
// stacked cards.
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
          <div className="hw-panel-header">
            <h2>Comments</h2>
            <VeltCommentsSidebarWireframe.MinimalFilterDropdown>
              <VeltCommentsSidebarWireframe.MinimalFilterDropdown.Trigger>
                <span className="hw-icon-btn">
                  <FilterLinesIcon />
                </span>
              </VeltCommentsSidebarWireframe.MinimalFilterDropdown.Trigger>
              <VeltCommentsSidebarWireframe.MinimalFilterDropdown.Content>
                <div className="hw-filter-menu">
                  <VeltCommentsSidebarWireframe.MinimalFilterDropdown.Content.SortDate>
                    <FilterRow label="Sort by date" />
                  </VeltCommentsSidebarWireframe.MinimalFilterDropdown.Content.SortDate>
                  <VeltCommentsSidebarWireframe.MinimalFilterDropdown.Content.SortUnread>
                    <FilterRow label="Sort by unread" />
                  </VeltCommentsSidebarWireframe.MinimalFilterDropdown.Content.SortUnread>
                  <div className="hw-menu-divider" />
                  <VeltCommentsSidebarWireframe.MinimalFilterDropdown.Content.FilterResolved>
                    <FilterRow label="Show resolved comments" />
                  </VeltCommentsSidebarWireframe.MinimalFilterDropdown.Content.FilterResolved>
                  <VeltCommentsSidebarWireframe.MinimalFilterDropdown.Content.FilterAssignedToMe>
                    <FilterRow label="Only your mentions" />
                  </VeltCommentsSidebarWireframe.MinimalFilterDropdown.Content.FilterAssignedToMe>
                </div>
              </VeltCommentsSidebarWireframe.MinimalFilterDropdown.Content>
            </VeltCommentsSidebarWireframe.MinimalFilterDropdown>
          </div>

          <div className="hw-panel-composer">
            <VeltCommentsSidebarWireframe.PageModeComposer />
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

          <div className="hw-panel-body">
            <VeltCommentsSidebarWireframe.List />
          </div>
        </VeltCommentsSidebarWireframe.Panel>
      </div>
    </VeltCommentsSidebarWireframe>
  );
}

export default VeltCommentSidebarWf;
