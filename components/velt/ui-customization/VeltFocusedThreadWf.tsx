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

// The sidebar's focused-thread drawer. Needs its own variant, selected by
// `focusedThreadDialogVariant` — without a matching registration it falls back to
// the base wireframe and renders the floating popover's chrome (title bar, border,
// shadow) inside the drawer.
//
// How the three dialog variants differ:
//   base            bordered popover with its own "Comment" title
//   sidebar         flat list card: grey box, context line, reply toggle
//   focusedThread   drawer body: no card box, no context line, no reply toggle —
//                   every comment is already expanded
//
// The drawer's header is assembled from two owners. `‹` and the title belong to
// the sidebar's FocusedThread slot and `✕` to its CloseButton; `⋯` and `✓` are
// comment-dialog slots that only resolve against an annotation, so they live here
// and the stylesheet lifts that row into the header band.

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
                {/* The dialog owns the 48px header band, and `⋯ ✓` have to sit
                    inside its own Header slot — `Options` can't mount its dropdown
                    anywhere else. The sidebar's `‹ Comment Thread` and `✕` are
                    positioned into this band by the stylesheet instead; that
                    direction is safe because their clicks never pass through the
                    dialog's own outside-click handling. */}
                <FocusHeader />

                {/* ── REPOSITIONED (8:28601 · 8:28660) ─────────────────────────────
                    This is the frame the whole reposition is drawn from: the drawer
                    puts a full-bleed 400x44 `Assigned to you` strip DIRECTLY under
                    the 48px header band and above the body, not at the bottom. The
                    band used to be this drawer's last child, under the Reply pill.
                    Self-gating, so an unassigned thread keeps today's geometry. */}
                <VcAssigneeBanner />

                {/* VisibilityBanner is deliberately not mounted. No Altana frame draws
                    one, and it only paints when the SDK resolves an annotation's
                    audience as restricted — which the browser-side permission
                    resolver we use locally never does, but the server-side one the
                    deployed app uses does. That made it appear on preview only.
                    Its chrome is still in styles.css if it's ever wanted. */}

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
