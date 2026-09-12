"use client";

import {
    VeltCommentDialogProgressWireframe,
    VeltCommentDialogWireframe,
    VeltData,
    VeltIf,
} from "@veltdev/react";
import { VcArrowBendDownRightIcon, VcSparklesIcon } from "./VcIcons";
import { VcAssigneeBanner } from "./VcAssigneeBanner";
import { VcCommentActions, VcEditComposer, VcReactions } from "./VcCommentActions";
import { VcDialogComposer } from "./VeltComposerWf";

// The sidebar's list rows. `variant="sidebar"` plus the host's
// `dialogVariant="sidebar"` give them their own template, so the flat 368px card
// and the floating popover stop sharing a layout.
//
// Two branches, picked by the SDK's own isSuggestionComment() gate — which fires
// for list rows too, not just the floating dialog. An agent annotation renders
// through the Suggestion slots and no thread cards at all, so the design's "agent
// comment looks like an ordinary card" has to be built on Suggestion.Header.Agent.
// Mount only the normal branch and every agent row comes out blank.
//
// State modifiers ride on `Body`, not on our own `.vc-card` div: `veltClass` on a
// plain div never fires.
//
// Not mounted: ThreadCard.Reply, and the thread-level kebab and Resolve pair —
// the collapsed frames draw none of them, and opening a row switches the panel to
// the focused thread, whose header carries those. What stays is the per-comment
// hover kebab from VcCommentActions.

/** The card's own chrome, shared by both branches: `.vc-card` box → `.vc-card-inner`
 *  is the Body slot, so this helper only draws the outer box. */
function ContextLine() {
    // HC-3 — the design's "Product Name" row (872:21730 / 21746 / 21768 / 21785; all four
    // collapsed frames carry it, the expanded dialog 872:21857 does not).
    //
    // `annotation.context.productName` is written at comment-creation time by the host's
    // comment context provider (components/velt/VeltCommentContext.tsx), which attaches the
    // product name of the table cell the thread is pinned to. Annotations created anywhere
    // else carry no productName, and the VeltIf then collapses this row to nothing rather
    // than leaving an empty 20px band.
    return (
        <VeltIf condition="{annotation.context.productName}">
            <div className="vc-context">
                <VeltData field="annotation.context.productName" />
            </div>
        </VeltIf>
    );
}

export function VeltSidebarCardWf() {
    return (
        <VeltCommentDialogWireframe variant="sidebar">
            {/* ── AGENT / suggestion annotations (872:21757) ─────────────────────
                Drawn as an ORDINARY card per the design (DI-4), using the suggestion
                slots because the SDK gate never renders ThreadCard for these. */}
            <VeltCommentDialogWireframe.Suggestion>
                {/* `vc-agent` is a STATIC class here, not a velt-class directive: this
                    subtree renders only for suggestion/agent annotations, so the modifier
                    is unconditional and needs no token. */}
                <div className="vc-card vc-agent">
                    <VeltCommentDialogWireframe.Body className="vc-card-inner">
                        <div className="vc-card-body">
                            <div className="vc-card-head">
                                <VeltCommentDialogWireframe.Suggestion.Header className="vc-card-headrow">
                                    <VeltCommentDialogWireframe.Suggestion.Header.Agent>
                                        <VeltCommentDialogWireframe.Suggestion.Header.Agent.Avatar className="vc-avatar">
                                            {/* the design replaces the SDK's default agent mark with a
                                                12px sparkles glyph inside a purple circle */}
                                            <span className="vc-avatar-glyph">
                                                <VcSparklesIcon />
                                            </span>
                                        </VeltCommentDialogWireframe.Suggestion.Header.Agent.Avatar>
                                        <VeltCommentDialogWireframe.Suggestion.Header.Agent.Name className="vc-name" />
                                    </VeltCommentDialogWireframe.Suggestion.Header.Agent>
                                    <span className="vc-meta">
                                        {/* NOTE: the suggestion header exposes no Unread slot, so the
                                            design's 8px blue dot cannot be supplied on this branch —
                                            bd-14. The normal branch below has it (ThreadCard.Unread). */}
                                        <VeltCommentDialogWireframe.Suggestion.Header.Timestamp className="vc-time" />
                                    </span>
                                </VeltCommentDialogWireframe.Suggestion.Header>
                                <ContextLine />
                                <VeltCommentDialogWireframe.Suggestion.Body className="vc-message" />
                            </div>
                        </div>
                        {/* Live agent run ON this row (SDK AC-061). Self-gating (0x0 with no
                            run in flight) and REQUIRED here: this wireframe replaces the
                            suggestion card's default template wholesale, so without the line a
                            run writes to the server and simply never appears in the sidebar. */}
                        <VeltCommentDialogProgressWireframe />
                    </VeltCommentDialogWireframe.Body>
                </div>
            </VeltCommentDialogWireframe.Suggestion>

            {/* ── Ordinary comment rows (872:21719 / 21735 / 21775) ─────────────── */}
            <VeltIf className="vc-card-normal" condition="{annotation.type} !== 'suggestion'">
                <div className="vc-card">
                    {/* ── REPOSITIONED (8:28804, frame "Repositioned Assignment") ──────
                        The band used to be the card's LAST child — a #fdf1fa footer
                        strip, which is what frame 872:21791 drew. The Design Suggestion
                        board moves it: 8:28804 puts `Frame 427321039` (the band) at
                        y=0 of the card and the comment body under it at y=36, and the
                        matching drawer (8:28660) does the same thing directly under the
                        header. So it is now the card's FIRST child.

                        Position is the ONLY thing that changed — the band is the same
                        element, self-gating on `annotation.assignedTo`, so an unassigned
                        card still renders nothing at all. See VcAssigneeBanner for the
                        "Assigned to you" vs "Assigned to <name>" split. */}
                    <VcAssigneeBanner />
                    {/* NO thread-level kebab here, deliberately (R7 — omitted, never
                        display:none). None of the four collapsed frames draws one, and the
                        design routes thread-level actions somewhere specific: a row opens the
                        FOCUSED THREAD (Figma #3), whose header carries `⋯` and `✓` — see
                        VeltFocusedThreadWf.tsx. Keeping a thread kebab here as well would put
                        TWO kebabs on one hovered card, since the per-comment kebab
                        (VcCommentActions, Figma #7) now lives in the head row. */}
                    <VeltCommentDialogWireframe.Body
                        className="vc-card-inner"
                        veltClass="'vc-unread': {annotation.isUnread}, 'vc-has-replies': {annotation.comments.length} > 1, 'vc-assigned': {annotation.assignedTo}"
                    >
                        <VeltCommentDialogWireframe.Threads className="vc-card-body">
                            {/* ThreadCard MUST nest in Body → Threads — placed at the dialog
                                root it renders an EMPTY card (verified, wireframe-components.md).
                                With collapsedComments ON the collapsed row renders the ROOT
                                comment only. */}
                            <VeltCommentDialogWireframe.ThreadCard className="vc-card-head">
                                <div className="vc-card-headrow">
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
                                    <span className="vc-meta">
                                        <VeltCommentDialogWireframe.ThreadCard.Unread>
                                            {/* Velt's DEFAULT unread marker is not verified identical to the
                                                design's 8px #0589ff circle, so the circle is supplied. The slot
                                                self-gates: it is 0x0 on a read comment. DI-3: the "Assigned"
                                                frame draws no dot; that stays a data outcome, not a rule. */}
                                            <span className="vc-unread-dot" />
                                        </VeltCommentDialogWireframe.ThreadCard.Unread>
                                        <VeltCommentDialogWireframe.ThreadCard.Time className="vc-time" />
                                    </span>
                                </div>
                                {/* HC-5 — per-comment Edit + per-thread Resolve. Out of flow and
                                    hover-only; see VcCommentActions.tsx for why it is here. */}
                                <VcCommentActions />
                                {/* context + message are the ROOT comment's rows; `{i} === 0`
                                    keeps them off any reply card the SDK may also render. */}
                                <VeltIf condition="{i} === 0">
                                    <ContextLine />
                                </VeltIf>
                                <VeltCommentDialogWireframe.ThreadCard.Message className="vc-message" />
                                <VcEditComposer />
                                {/* The reactions row, under the message — frame 4:28071.
                                    Self-gating: Velt marks the card
                                    `velt-reactions="0"` when there are none, and the
                                    stylesheet collapses it, so an un-reacted comment
                                    keeps the geometry it has today. */}
                                <VcReactions />
                            </VeltCommentDialogWireframe.ThreadCard>
                        </VeltCommentDialogWireframe.Threads>

                        {/* ToggleReply is a THREAD-level affordance: BODY-level (its
                            requiredAncestor is the body), exactly ONE per card — never one per
                            comment. DI-7 re-routes the ArrowBendDownRight glyph here from the
                            per-comment ThreadCard.Reply the raw iconAssignments picked.

                            GATED ON THE REPLY COUNT. The frames only draw this row when a
                            thread actually has replies: 872:21719 (no replies) has no row at
                            all, 872:21735 / 872:21775 (1 reply) draw `↳ 1 reply`. Ungated,
                            the slot renders its own bare "Reply" label on every single-comment
                            card — measured right after the host's collapsedComments prop came
                            off. `{annotation.comments.length}` counts the root, so > 1 means
                            "has at least one reply".

                            `veltIf` as an ATTRIBUTE is legal here because ToggleReply is a
                            Velt wireframe element — on a plain div it would be dead code
                            (R28). The stylesheet's `:has(.vc-reply-icon)` collapse cannot do
                            this job: our icon is always in the template, so the guard matched
                            whether or not the SDK had anything to show. */}
                        <VeltCommentDialogWireframe.ToggleReply
                            className="vc-toggle-reply"
                            veltIf="{annotation.comments.length} > 1"
                        >
                            <VeltCommentDialogWireframe.ToggleReply.Icon className="vc-reply-icon">
                                <VcArrowBendDownRightIcon />
                            </VeltCommentDialogWireframe.ToggleReply.Icon>
                            <span className="vc-reply-label">
                                <VeltCommentDialogWireframe.ToggleReply.Count className="vc-reply-count" />
                                <VeltCommentDialogWireframe.ToggleReply.Text className="vc-reply-text" />
                            </span>
                        </VeltCommentDialogWireframe.ToggleReply>

                        {/* DI-5 — RESOLVED in ToggleReply's favour; MoreReply is gone.
                            It used to be mounted here alongside ToggleReply because the
                            host ran `collapsedComments`, which makes the SDK render a
                            "Show N replies" MoreReply control, and the reasoning was
                            that if Velt was going to draw one it may as well carry the
                            design's words. That was the wrong end of the problem: the two
                            controls do different things. MoreReply REVEALS the replies
                            in place — so the card showed the root comment, "Show 6
                            replies", and all six replies underneath — while the frame's
                            affordance is a toggle that keeps the card collapsed at
                            `↳ 1 reply`. The host props are removed (see VeltCollaboration)
                            and ToggleReply above is now the only reply affordance on this
                            surface. */}
                    </VeltCommentDialogWireframe.Body>


                    {/* The reply composer. The four collapsed frames are all [Unselected]
                        states and draw NO composer — and Velt only renders one once the
                        thread is selected/open, so the unselected card still matches the
                        design. It is mounted because ToggleReply is the control that OPENS
                        it: LIVE-VERIFIED that with no Composer declared in this variant the
                        ToggleReply internal renders as two empty Angular anchors
                        (`<!----><!---->`, 0x0) and the design's "1 reply" row can never
                        appear — R12 says fix the DECLARATION before abandoning the slot.
                        Same 326x32 pill as the dialog (fam-composer). */}
                    <VcDialogComposer />

                        </div>
            </VeltIf>
        </VeltCommentDialogWireframe>
    );
}

export default VeltSidebarCardWf;
