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
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  SlidersIcon,
} from "./icons";
import { DISPLAY_OPTIONS_BUTTON } from "./buttonIds";

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
          <div className="hw-panel-header">
            <h2>Comments</h2>
            <VeltCommentsSidebarWireframe.CloseButton className="hw-panel-close" />
          </div>

          <div className="hw-panel-controls">
            <div className="hw-search-slot">
              <span className="hw-search-glyph" aria-hidden="true">
                <MagnifyingGlassIcon />
              </span>
              <VeltCommentsSidebarWireframe.Search className="hw-search" />
            </div>

            <VeltCommentsSidebarWireframe.FilterButton className="hw-ctl-btn">
              <span className="hw-icon-btn">
                <FunnelSimpleIcon />
              </span>
            </VeltCommentsSidebarWireframe.FilterButton>

            <div className="hw-ctl-display">
              <VeltButtonWireframe
                id={DISPLAY_OPTIONS_BUTTON}
                type="button"
                className="hw-ctl-btn"
              >
                <span className="hw-icon-btn">
                  <SlidersIcon />
                </span>
              </VeltButtonWireframe>
            </div>
          </div>

          <VeltCommentsSidebarWireframe.EmptyPlaceholder>
            <div className="hw-empty">
              <EmptyIllustration />
              <VeltIf condition="{noCommentsFound}">
                <h3>Be the first to comment</h3>
                <p>Use the box at the bottom of this panel to add one</p>
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

          <div className="hw-panel-composer">
            <VeltCommentsSidebarWireframe.PageModeComposer className="vc-composer-page" />
          </div>
        </VeltCommentsSidebarWireframe.Panel>

        <VeltCommentsSidebarWireframe.Filter className="hw-filter">
          <div className="hw-filter-head">
            <VeltCommentsSidebarWireframe.Filter.Title className="hw-filter-title" />
            <VeltCommentsSidebarWireframe.Filter.CloseButton className="hw-filter-close" />
          </div>
          <div className="hw-filter-body">
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

        <VeltCommentsSidebarWireframe.FocusedThread className="hw-focus">
          <div className="hw-focus-header">
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
