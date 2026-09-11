"use client";

import {
    VeltData,
    VeltCommentDialogActionsWireframe,
    VeltCommentDialogWireframe,
    VeltIf,
} from "@veltdev/react";
import { VcAgentCard } from "./VcAgentCard";
import { VcAssigneeBanner } from "./VcAssigneeBanner";
import { VcCommentActions, VcEditComposer, VcReactions } from "./VcCommentActions";
import {
    VcArrowCounterClockwiseIcon,
    VcCheckCircleIcon,
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
/**
 * The drawer's 48px header band, shared by BOTH branches.
 *
 * It must be declared with OUR OWN children on every branch. Declared childless
 * (which the suggestion branch did at first) the `Header` container falls back to
 * Velt's defaults and the band filled with an unstyled `(  ) Open v` status
 * dropdown and an open-in-new arrow — measured, and nothing in the design draws
 * either. A container slot owns its whole child tree; supplying it is what keeps
 * the defaults out.
 */
function FocusHeader() {
    return (
        <VeltCommentDialogWireframe.Header className="vc-focus-header-row">
            <div className="vc-focus-actions">
                <VcOptionsMenu />
                {/* GATED ON STATUS. The Resolve/Unresolve pair does NOT
                    self-gate — measured, both rendered 24x24 at once, so the
                    header showed `... / check / undo` where 872:21603 draws a
                    single check. `{resolved}` picks one. The ATTRIBUTE form
                    (`veltIf=` on the slot) was tried first and did nothing, so
                    this uses the `<VeltIf>` WRAPPER form, which does gate. The
                    wrappers clone in as `app-if` elements, so the stylesheet
                    gives them `display: contents` to keep this a flex row. */}
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
    );
}

export function VeltFocusedThreadWf() {
    return (
        <VeltCommentDialogWireframe variant="focusedThread">
            {/* ── Agent / suggestion annotations keep the accept-reject card, the
                   same way the floating dialog does: the SDK's native
                   isSuggestionComment() gate renders exactly one of the two
                   branches, so no VeltIf is needed. ── */}
            <VcAgentCard header={<FocusHeader />} />

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
                <FocusHeader />

                {/* ── REPOSITIONED (8:28601 · 8:28660) ─────────────────────────────
                    This is the frame the whole reposition is drawn from: the drawer
                    puts a full-bleed 400x44 `Assigned to you` strip DIRECTLY under
                    the 48px header band and above the body, not at the bottom. The
                    band used to be this drawer's last child, under the Reply pill.
                    Self-gating, so an unassigned thread keeps today's geometry. */}
                <VcAssigneeBanner />

                <VeltCommentDialogWireframe.VisibilityBanner />

                <VeltCommentDialogWireframe.Body className="vc-focus-body">
                    <VeltCommentDialogWireframe.Threads className="vc-focus-thread">
                        <VeltCommentDialogWireframe.ThreadCard className="vc-focus-comment">
                            <div className="vc-focus-rail">
                                {/* `veltClass` marks an AGENT-authored row so the stylesheet can give
                                    it the design's purple sparkle disc. Without it the same
                                    agent got the generic initial avatar here and the sparkle
                                    on its suggestion cards — two looks for one author. The
                                    glyph has to come from CSS: putting a child in
                                    `ThreadCard.Avatar` would replace the avatar for EVERY
                                    comment, not just the agent's. */}
                                <VeltCommentDialogWireframe.ThreadCard.Avatar
                                    className="vc-avatar"
                                    veltClass="'vc-avatar--agent': {commentObj.agent}"
                                />
                            </div>
                            <div className="vc-focus-main">
                                <div className="vc-focus-head">
                                    <div className="vc-comment-headrow">
                                        {/* FULL name, via `VeltData`, not `ThreadCard.Name`.
                                    `ThreadCard.Name` ABBREVIATES the last word —
                                    measured, it rendered "Altana Review Agent" as
                                    "Altana Review A." and "User 1" as "User 1." — while
                                    the V2 design writes names out in full ("Jordan Lee",
                                    "Naomi Williams", "Altana AI"). It also made the SAME
                                    agent read differently on its two card types, because
                                    the suggestion path's `Header.Agent.Name` does not
                                    abbreviate. `commentObj.from.name` is the per-comment
                                    author, so replies keep their own author too. */}
                                <span className="vc-name">
                                    {/* TWO SOURCES, because an agent-authored comment has no
                                        `from`: measured, `commentObj.from.name` rendered EMPTY on
                                        the agent's conversation card while working on every human
                                        row — Velt carries the agent identity separately. Same
                                        `{commentObj.agent}` gate the avatar's veltClass uses. */}
                                    <VeltIf condition="!{commentObj.agent}">
                                        <VeltData field="commentObj.from.name" />
                                    </VeltIf>
                                    <VeltIf condition="{commentObj.agent}">
                                        <VeltData field="commentObj.agent.agentName" />
                                    </VeltIf>
                                </span>
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
                                {/* The reactions row, under the message — frame 4:28071.
                                    Self-gating: Velt marks the card
                                    `velt-reactions="0"` when there are none, and the
                                    stylesheet collapses it, so an un-reacted comment
                                    keeps the geometry it has today. */}
                                <VcReactions />
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

            </div>
            </VeltIf>
        </VeltCommentDialogWireframe>
    );
}

export default VeltFocusedThreadWf;
