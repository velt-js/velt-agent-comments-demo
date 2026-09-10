"use client";

import {
    VeltCommentDialogProgressWireframe,
    VeltCommentDialogWireframe,
    VeltData,
    VeltIf,
} from "@veltdev/react";
import { VcArrowBendDownRightIcon, VcSparklesIcon } from "./VcIcons";
import { VcAssigneeBanner } from "./VcAssigneeBanner";
import { VcCommentActions, VcEditComposer } from "./VcCommentActions";
import { VcDialogComposer } from "./VeltComposerWf";

// ═══ fam-comment-dialog-states / surface-sidebar-card ═════════════════════════
//
//   figma 872:21719 · 872:21735 · 872:21757 · 872:21775  — four 368x92..176 flat rows
//   mock:  .velt-customize/phases/WYAWuEm8DrIk-872-20766-A/mocks/fam-comment-dialog-states.html
//
// The SECOND VeltCommentDialogWireframe context registration (family 2 owns the third,
// `variant="pageModeComposer"`). The comment dialog is reused verbatim for every sidebar
// list row; `variant="sidebar"` + the host's `<VeltCommentsSidebar dialogVariant="sidebar">`
// give those rows their own template, so the 368px flat card and the 358px floating
// popover stop sharing one layout (DI-1).
//
// ── Two branches, ONE native gate ────────────────────────────────────────────
// The SDK's own isSuggestionComment() gate decides which subtree renders; LIVE-VERIFIED
// that it fires for SIDEBAR ROWS too, not only the floating dialog (DI-4's open question):
// a seeded agent annotation renders `velt-comment-dialog-suggestion-internal` inside the
// sidebar host and NO thread cards at all. So the design's "agent comment draws an
// ordinary card" is reachable only through the Suggestion slots — which is what the
// Suggestion branch below does: same `.vc-card…` chrome, fed by Suggestion.Header.Agent
// instead of ThreadCard. Mounting only the normal branch would have left every agent row
// blank.
//
// ── State modifiers: velt-class on Body, NOT on the own .vc-card div ─────────
// plan-structure asks for veltClass on the own root div. R28 forbids it: `velt-class` on
// a plain <div> is dead code (survives the clone, never fires). The modifiers therefore
// ride on `VeltCommentDialogWireframe.Body` — a real Velt element, and the ancestor of
// every state-dependent row in the card. Recorded as bd-13.
//
// ── What is deliberately NOT mounted (R7: omitted, never display:none) ───────
// ThreadCard.Reply (the design draws no per-comment reply affordance on a collapsed row).
// The THREAD-level kebab and the Resolve/Unresolve pair are gone from this surface: the
// four collapsed frames draw neither, and the design gives thread-level actions their own
// home — opening a row switches the panel to the FOCUSED THREAD, whose header carries
// `⋯` and `✓` (VeltFocusedThreadWf.tsx). What survives on the card is the PER-COMMENT
// hover kebab from <VcCommentActions/> — Edit · Delete, 890:23218 / 890:23222 and Figma #7.
// REACTIONS are not part of this design (0 reaction/emoji nodes in either section; the
// four `Icon / Smiley` nodes are all hidden) and were removed.
// Suggestion.Footer / .Actions / .Banner and Suggestion.Header.Menu (the design's agent
// row is an ordinary card, so accept/reject stays on the floating dialog where the frame
// actually draws it — see VeltCommentDialogWf).

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
                                    <VeltCommentDialogWireframe.ThreadCard.Avatar className="vc-avatar" />
                                    <VeltCommentDialogWireframe.ThreadCard.Name className="vc-name" />
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

                    {/* AssigneeBanner is a ROOT-LEVEL sibling of Body — the card's
                        full-bleed #fdf1fa footer band (872:21791), and LAST so it stays
                        a footer in both card states: the collapsed frames draw it as the
                        card's bottom edge with no composer at all, and on a selected
                        card the composer Velt adds slots in above it rather than
                        splitting the band off the message. Same order as the popover and
                        the drawer. See VcAssigneeBanner for the "Assigned to you" vs
                        "Assigned to <name>" split. */}
                    <VcAssigneeBanner />
                        </div>
            </VeltIf>
        </VeltCommentDialogWireframe>
    );
}

export default VeltSidebarCardWf;
