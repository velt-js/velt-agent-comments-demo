"use client";

import {
  VeltButtonWireframe,
  VeltCommentsSidebarV2Wireframe,
  VeltIf,
} from "@veltdev/react";
import { EmptyIllustration } from "@/components/icons";
import {
  ArrowClockwiseIcon,
  CheckIcon,
  FiltersTitleIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  SlidersIcon,
} from "./icons";
import { DISPLAY_OPTIONS_BUTTON } from "./buttonIds";

const Filter = VeltCommentsSidebarV2Wireframe.FilterContainer;
const Section = Filter.SectionList.Section;

export function VeltCommentSidebarWf() {
  return (
    <VeltCommentsSidebarV2Wireframe>
      <div className="hw-panel">
        <VeltCommentsSidebarV2Wireframe.Skeleton>
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
        </VeltCommentsSidebarV2Wireframe.Skeleton>

        <VeltCommentsSidebarV2Wireframe.Panel>
          <div className="hw-panel-header">
            <h2>Comments</h2>
            <VeltCommentsSidebarV2Wireframe.CloseButton className="hw-panel-close" />
          </div>

          <div className="hw-panel-controls">
            <div className="hw-search-slot">
              <span className="hw-search-glyph" aria-hidden="true">
                <MagnifyingGlassIcon />
              </span>
              <VeltCommentsSidebarV2Wireframe.Search className="hw-search">
                <VeltCommentsSidebarV2Wireframe.Search.Input className="hw-search-input" />
              </VeltCommentsSidebarV2Wireframe.Search>
            </div>

            <VeltCommentsSidebarV2Wireframe.FilterButton className="hw-ctl-btn">
              <span className="hw-icon-btn">
                <FunnelSimpleIcon />
              </span>
            </VeltCommentsSidebarV2Wireframe.FilterButton>

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

          <VeltCommentsSidebarV2Wireframe.EmptyPlaceholder>
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
          </VeltCommentsSidebarV2Wireframe.EmptyPlaceholder>

          <div className="hw-panel-body">
            <VeltCommentsSidebarV2Wireframe.List />
          </div>

          <div className="hw-panel-composer">
            <VeltCommentsSidebarV2Wireframe.PageModeComposer className="vc-composer-page" />
          </div>
        </VeltCommentsSidebarV2Wireframe.Panel>

        <Filter className="hw-filter">
          <div className="hw-filter-head">
            <Filter.Title className="hw-filter-title">
              <span className="hw-filter-title-row" role="heading" aria-level={2}>
                <FiltersTitleIcon />
                Filters
              </span>
            </Filter.Title>
            <Filter.CloseButton className="hw-filter-close" />
          </div>
          <div className="hw-filter-body">
            <Filter.SectionList>
              <Section className="hw-filter-group">
                <Section.Label className="hw-filter-group-name" />
                <Section.Field>
                  <Section.Field.OptionList>
                    <Section.Field.OptionList.Option className="hw-filter-item">
                      <Section.Field.OptionList.Option.Checkbox className="hw-filter-check" />
                      <Section.Field.OptionList.Option.Name className="hw-filter-item-name" />
                      <Section.Field.OptionList.Option.Count className="hw-filter-item-count" />
                    </Section.Field.OptionList.Option>
                  </Section.Field.OptionList>
                </Section.Field>
              </Section>
            </Filter.SectionList>
          </div>
          <div className="hw-filter-foot">
            <Filter.ResetButton className="hw-filter-reset">
              <span className="hw-filter-btn-label">
                <ArrowClockwiseIcon />
                Reset
              </span>
            </Filter.ResetButton>
            <Filter.ApplyButton className="hw-filter-done">
              <span className="hw-filter-btn-label">
                <CheckIcon />
                Apply
              </span>
            </Filter.ApplyButton>
          </div>
        </Filter>

        <VeltCommentsSidebarV2Wireframe.FocusedThread className="hw-focus">
          <div className="hw-focus-header">
            <VeltCommentsSidebarV2Wireframe.FocusedThread.BackButton className="hw-focus-back" />
            <h2>Comment Thread</h2>
            <VeltCommentsSidebarV2Wireframe.CloseButton className="hw-focus-close" />
          </div>
          <VeltCommentsSidebarV2Wireframe.FocusedThread.DialogContainer className="hw-focus-body" />
        </VeltCommentsSidebarV2Wireframe.FocusedThread>
      </div>
    </VeltCommentsSidebarV2Wireframe>
  );
}

export default VeltCommentSidebarWf;
