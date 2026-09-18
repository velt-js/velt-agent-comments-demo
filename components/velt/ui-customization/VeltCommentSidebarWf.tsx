"use client";

import {
  VeltButtonWireframe,
  VeltCommentsSidebarV2Wireframe,
  VeltIf,
} from "@veltdev/react";
import { EmptyIllustration } from "@/components/icons";
import {
  CaretLeftIcon,
  CheckIcon,
  CloseIcon,
  FilterTitleIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  ResetIcon,
  SlidersIcon,
} from "./icons";
import { CLOSE_SIDEBAR_BUTTON, DISPLAY_OPTIONS_BUTTON } from "./buttonIds";

const Sidebar = VeltCommentsSidebarV2Wireframe;
const Filter = VeltCommentsSidebarV2Wireframe.FilterContainer;
const Section = Filter.SectionList.Section;
const Option = Section.Field.OptionList.Option;

export function VeltCommentSidebarWf() {
  return (
    <Sidebar>
      <div className="hw-panel">
        <Sidebar.Skeleton>
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
        </Sidebar.Skeleton>

        <Sidebar.Panel>
          <div className="hw-panel-header">
            <h2>Comments</h2>
            {/* V2's CloseButton hides itself in embed mode, and the drawer is ours
                anyway, so this is our own button. The X is drawn in CSS. */}
            <VeltButtonWireframe id={CLOSE_SIDEBAR_BUTTON} type="button" className="hw-panel-close">
              <span />
            </VeltButtonWireframe>
          </div>

          <div className="hw-panel-controls">
            <div className="hw-search-slot">
              <span className="hw-search-glyph" aria-hidden="true">
                <MagnifyingGlassIcon />
              </span>
              {/* Only the input: the leading glyph is ours */}
              <Sidebar.Search className="hw-search">
                <Sidebar.Search.Input />
              </Sidebar.Search>
            </div>

            <Sidebar.FilterButton className="hw-ctl-btn">
              <span className="hw-icon-btn">
                <FunnelSimpleIcon />
              </span>
            </Sidebar.FilterButton>

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

          <Sidebar.EmptyPlaceholder>
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
          </Sidebar.EmptyPlaceholder>

          <div className="hw-panel-body">
            <Sidebar.List />
          </div>

          <div className="hw-panel-composer">
            <Sidebar.PageModeComposer className="vc-composer-page" />
          </div>
        </Sidebar.Panel>

        {/* One section per entry in the sidebar's `filters` prop */}
        <Filter className="hw-filter">
          <div className="hw-filter-head">
            <Filter.Title className="hw-filter-title">
              <div className="hw-filter-title-row">
                <FilterTitleIcon />
                Filters
              </div>
            </Filter.Title>
            <Filter.CloseButton className="hw-filter-close">
              <CloseIcon />
            </Filter.CloseButton>
          </div>
          <div className="hw-filter-body">
            <Filter.SectionList>
              <Section className="hw-filter-group">
                <Section.Label />
                <Section.Field>
                  <Section.Field.OptionList>
                    <Option className="hw-filter-item">
                      <Option.Checkbox className="hw-filter-check" />
                      <Option.Name className="hw-filter-item-name" />
                      <Option.Count className="hw-filter-item-count" />
                    </Option>
                  </Section.Field.OptionList>
                </Section.Field>
              </Section>
            </Filter.SectionList>
          </div>
          <div className="hw-filter-foot">
            <Filter.ResetButton className="hw-filter-reset">
              <span className="hw-filter-btn-glyph">
                <ResetIcon />
              </span>
              Reset
            </Filter.ResetButton>
            <Filter.ApplyButton className="hw-filter-done">
              <span className="hw-filter-btn-glyph">
                <CheckIcon />
              </span>
              Apply
            </Filter.ApplyButton>
          </div>
        </Filter>

        <Sidebar.FocusedThread className="hw-focus">
          <div className="hw-focus-header">
            <Sidebar.FocusedThread.BackButton className="hw-focus-back">
              <CaretLeftIcon />
            </Sidebar.FocusedThread.BackButton>
            <h2>Comment Thread</h2>
            <VeltButtonWireframe id={CLOSE_SIDEBAR_BUTTON} type="button" className="hw-focus-close">
              <span />
            </VeltButtonWireframe>
          </div>
          <Sidebar.FocusedThread.DialogContainer className="hw-focus-body" />
        </Sidebar.FocusedThread>
      </div>
    </Sidebar>
  );
}

export default VeltCommentSidebarWf;
