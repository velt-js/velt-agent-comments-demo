"use client";

import {
    VeltCommentDialogActionsWireframe,
    VeltCommentDialogProgressWireframe,
    VeltCommentDialogWireframe,
    VeltIf,
} from "@veltdev/react";
import { VcAssigneeBanner } from "./VcAssigneeBanner";
import { VcCommentActions, VcEditComposer } from "./VcCommentActions";
import {
    VcArrowCounterClockwiseIcon,
    VcCheckCircleIcon,
    VcSparklesIcon,
} from "./VcIcons";
import { VcOptionsMenu } from "./VcOptionsMenu";
import { VcDialogComposer } from "./VeltComposerWf";

// ═══ surface-focused-thread ═══════════════════════════════════════════════════
//
//   figma 872:21662 → 872:21603 "Comment Drawer" (448x884)
//   in app context:  890:22521 · 890:24231 · 890:24417 · 890:24599 · 890:24781
//   scope:           Figma thread #3 — "the design of this threaded comment
//                    panel is relevant."
//
// The FOURTH VeltCommentDialogWireframe registration. The comment dialog is
// re-used verbatim for the sidebar's focused-thread view, so — exactly like the
// sidebar rows and the page-mode composer — it needs its own variant, selected by
// `<VeltCommentsSidebar focusedThreadDialogVariant="focusedThread">`. Without a
// matching registration the focused thread falls back to the BASE wireframe and
// renders the 358px floating popover's chrome (its own "Comment" title bar, card
// border and shadow) inside a 448px drawer.
//
// ── How this differs from the two sibling registrations
//   BASE (VeltCommentDialogWf)      358x248 bordered popover, own "Comment" title
//   variant="sidebar"               368px flat CARD: grey box, context line,
//                                   "1 reply" toggle, assignee band
//   variant="focusedThread" (HERE)  448px drawer body: NO card box, NO context
//                                   line, NO reply toggle — every comment is
//                                   already expanded, so rows are just
//                                   avatar + name + time + message, 8px apart.
//
// ── The header split (see VeltCommentSidebarWf's FocusedThread comment)
// The frame's header is `‹  Comment Thread   ⋯  ✓  ✕`. `‹` and the title belong to
// the sidebar's FocusedThread slot; `✕` is the sidebar CloseButton. `⋯` and `✓`
// are COMMENT-DIALOG slots — they only resolve against an annotation — so they
// live here, in `.vc-focus-actions`, and the stylesheet lifts that row into the
// header band above. Mounting them in the sidebar instead would render inert.
export function VeltFocusedThreadWf() {
    return (
        <VeltCommentDialogWireframe variant="focusedThread">
            {/* ── Agent / suggestion annotations keep the accept-reject card, the
                   same way the floating dialog does: the SDK's native
                   isSuggestionComment() gate renders exactly one of the two
                   branches, so no VeltIf is needed. ── */}
            <VeltCommentDialogWireframe.Suggestion>
                <div className="hw-agent-card">
                    <VeltCommentDialogWireframe.Suggestion.Banner />
                    <VeltCommentDialogWireframe.Suggestion.Header>
                        <VeltCommentDialogWireframe.Suggestion.Header.Agent>
                            <VeltCommentDialogWireframe.Suggestion.Header.Agent.Avatar className="vc-avatar">
                                <span className="vc-avatar-glyph">
                                    <VcSparklesIcon />
                                </span>
                            </VeltCommentDialogWireframe.Suggestion.Header.Agent.Avatar>
                            <VeltCommentDialogWireframe.Suggestion.Header.Agent.Name className="vc-name" />
                        </VeltCommentDialogWireframe.Suggestion.Header.Agent>
                        <VeltCommentDialogWireframe.Suggestion.Header.Timestamp className="vc-time" />
                    </VeltCommentDialogWireframe.Suggestion.Header>
                    <VeltCommentDialogWireframe.Suggestion.Body />
                    <VeltCommentDialogProgressWireframe />
                    <VeltCommentDialogWireframe.Suggestion.Footer>
                        <div className="hw-agent-footer">
                            <VeltCommentDialogWireframe.Suggestion.Actions>
                                <div className="hw-suggestion-actions">
                                    <VeltCommentDialogWireframe.Suggestion.Actions.Accept />
                                    <VeltCommentDialogWireframe.Suggestion.Actions.Reject />
                                </div>
                            </VeltCommentDialogWireframe.Suggestion.Actions>
                        </div>
                    </VeltCommentDialogWireframe.Suggestion.Footer>
                </div>
            </VeltCommentDialogWireframe.Suggestion>

            {/* ── Ordinary threads (872:21603) ─────────────────────────────────
                GATED, unlike the base dialog. MEASURED: in this variant the SDK's
                native isSuggestionComment() gate does NOT suppress the normal
                branch — an agent annotation rendered the 400x280 suggestion card
                AND `.vc-focus` underneath it, pushing the thread 280px down the
                drawer (`.vc-focus` @y391 inside a body starting at y111). The
                sidebar card variant already carries this same guard for the same
                reason; the base popover is the only surface where the native gate
                is enough. */}
            <VeltIf condition="{annotation.type} !== 'suggestion'">
            <div className="vc-focus">
                {/* The drawer's HEADER BAND is drawn by the DIALOG, not by the
                    sidebar — and `⋯ ✓` live inside the dialog's own `Header` slot.
                    Both of those are load-bearing:

                    · `Options` DOES NOT WORK outside a dialog Header. Measured: in
                      a plain `<div>` at the dialog root the trigger rendered and
                      hit-tested fine (elementsFromPoint returned it on top), but no
                      `.mat-mdc-menu-panel` was ever created — the dropdown simply
                      cannot mount. Inside Header it opens, exactly as it does in the
                      floating popover.

                    · The previous version lifted this row into the SIDEBAR's header
                      with `position:absolute; top:-36px`. That put its box outside
                      the dialog, and the dialog's own outside-click handling then
                      treated a press on `⋯` as a click outside itself: the focused
                      thread closed on the first click and the menu never appeared
                      (measured — the first DOM mutation after the click already read
                      `focus:false menu:false`). Dropping the lift kept the thread
                      open, which isolated it.

                    So the dialog owns the 48px band, and the sidebar's `‹ Comment
                    Thread` + `✕` are positioned INTO it by the stylesheet instead.
                    That direction is safe: those are sidebar-owned controls, so
                    their clicks never pass through the dialog's hit-testing. */}
                <VeltCommentDialogWireframe.Header className="vc-focus-header-row">
                    <div className="vc-focus-actions">
                        <VcOptionsMenu />
                        {/* GATED ON STATUS. The Resolve/Unresolve pair does NOT
                            self-gate — measured, both `resolve-button-internal` and
                            `unresolve-button-internal` rendered 24x24 at once, so the
                            header showed `⋯ ✓ ↺` where 872:21603 draws a single `✓`.
                            `{resolved}` picks one. The ATTRIBUTE form (`veltIf=` on the
                            slot) was tried first and did nothing — both buttons still
                            rendered 24x24 — so this uses the `<VeltIf>` WRAPPER form,
                            which does gate. The wrappers clone in as `app-if` elements,
                            so the stylesheet gives them `display: contents` to keep this
                            a 3-across flex row. */}
                        <VeltIf condition="!{resolved}">
                            <VeltCommentDialogWireframe.ResolveButton className="vc-focus-resolve">
                                <span className="hw-icon-btn">
                                    <VcCheckCircleIcon />
                                </span>
                            </VeltCommentDialogWireframe.ResolveButton>
                        </VeltIf>
                        <VeltIf condition="{resolved}">
                            <VeltCommentDialogWireframe.UnresolveButton className="vc-focus-unresolve">
                                <span className="hw-icon-btn">
                                    <VcArrowCounterClockwiseIcon />
                                </span>
                            </VeltCommentDialogWireframe.UnresolveButton>
                        </VeltIf>
                    </div>
                </VeltCommentDialogWireframe.Header>

                <VeltCommentDialogWireframe.VisibilityBanner />

                <VeltCommentDialogWireframe.Body className="vc-focus-body">
                    <VeltCommentDialogWireframe.Threads className="vc-focus-thread">
                        <VeltCommentDialogWireframe.ThreadCard className="vc-focus-comment">
                            <div className="vc-focus-rail">
                                <VeltCommentDialogWireframe.ThreadCard.Avatar className="vc-avatar" />
                            </div>
                            <div className="vc-focus-main">
                                <div className="vc-focus-head">
                                    <div className="vc-comment-headrow">
                                        <VeltCommentDialogWireframe.ThreadCard.Name className="vc-name" />
                                        <VeltCommentDialogWireframe.ThreadCard.Time className="vc-time" />
                                    </div>
                                    {/* per-comment hover affordances (Figma #7) */}
                                    <VcCommentActions />
                                </div>
                                <VeltCommentDialogWireframe.ThreadCard.Message className="vc-message" />
                                {/* The edit field's host. REQUIRED in every dialog variant that
                                    renders thread cards: verified live that with the slot missing
                                    here, `Edit` DID put the comment into edit mode and the message
                                    row disappeared with nowhere for the editor to mount — the
                                    comment simply went blank. */}
                                <VcEditComposer />
                                <VeltCommentDialogActionsWireframe />
                            </div>
                        </VeltCommentDialogWireframe.ThreadCard>
                    </VeltCommentDialogWireframe.Threads>
                </VeltCommentDialogWireframe.Body>

                {/* No MoreReply, no ToggleReply.
                    The frame shows every comment in the thread expanded with no
                    reply control (872:21603), which is simply what the SDK does
                    once `collapsedComments` is off — so there is nothing to
                    declare and nothing to suppress. Both slots used to be mounted
                    EMPTY here purely to stop Velt's "Show N replies" default
                    falling back into this surface; with the host prop gone that
                    scaffolding, and the CSS that hid it, are gone too. */}

                {/* The drawer's "Reply" pill, pinned to the bottom of the 884px
                    frame by `.vc-focus`'s column layout. Same 32px pill as every
                    other composer (fam-composer). */}
                <VcDialogComposer />

                {/* The assignee band, last — same position it takes in the popover, so
                    the strip never splits the thread from its reply pill. Self-gating,
                    so the drawer's resting geometry is unchanged when unassigned. */}
                <VcAssigneeBanner />
            </div>
            </VeltIf>
        </VeltCommentDialogWireframe>
    );
}

export default VeltFocusedThreadWf;
