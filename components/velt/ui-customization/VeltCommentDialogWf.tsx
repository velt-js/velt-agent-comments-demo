"use client";

import {
    VeltData,
    VeltButtonWireframe,
    VeltCommentDialogActionsWireframe,
    VeltCommentDialogWireframe,
    VeltIf,
} from "@veltdev/react";
import { VcCommentActions, VcEditComposer, VcReactions } from "./VcCommentActions";
import { VcAgentCard } from "./VcAgentCard";
import { VcAssigneeBanner } from "./VcAssigneeBanner";
import { VcArrowBendDownRightIcon, VcSidebarSimpleIcon } from "./VcIcons";
import { VcOptionsMenu } from "./VcOptionsMenu";
import { VcDialogComposer } from "./VeltComposerWf";

// ═══ fam-comment-dialog-states / surface-dialog ═══════════════════════════════
//
//   figma 872:21857 — the 358x248 floating popover, expanded + selected
//   mock:  .velt-customize/phases/WYAWuEm8DrIk-872-20766-A/mocks/fam-comment-dialog-states.html
//
// This is the BASE (no-variant) registration, and per the SDK's variant fallback rule
// ("if no wireframe matches the active variant, Velt falls back to the base wireframe")
// it is what the FLOATING dialog renders — exactly the pattern wireframes.md §3c
// documents ("base look (used for the floating dialog)" + `variant="sidebar"` for the
// list rows). The sidebar's collapsed rows are served by VeltSidebarCardWf, selected by
// the host's `<VeltCommentsSidebar dialogVariant="sidebar">`.
//
// DI-1: the design's two frames disagree on width (368 flat card vs 358 bordered popover
// with a header, a shadow and a composer) because they are two SURFACES, not two states.
//
// ── The dialog has TWO mutually exclusive layouts, switched by the SDK itself
// (comment-dialog isSuggestionComment() → shouldShowSuggestion; since the 2026-07 SDK
// rename+gate change the card renders for ANY suggestion-typed annotation, agent-authored
// or human-authored — annotation.agent is no longer required):
//
//   annotation.type === 'suggestion' || annotation.commentType === 'suggestion'
//
// TRUE  → only the <Suggestion> subtree renders (suggestion card).
// FALSE → only the normal layout renders (thread cards + composer).
//
// No VeltIf is needed — the gate is native, and LIVE-VERIFIED to fire in both this
// surface and the sidebar rows. DI-4 keeps the full accept/reject suggestion card HERE
// (the demo's core agent surface) while the sidebar variant draws agent rows as the
// ordinary cards the design shows.

export function VeltCommentDialogWf() {
    return (
        <VeltCommentDialogWireframe>
            {/* ── Agent comment: the shared suggestion card (VcAgentCard).
                   This branch used to write the card out inline with
                   `Suggestion.Header` declared CHILDLESS, so Velt fell back to its
                   default header and painted a dark squircle avatar instead of the
                   design's purple sparkle disc — the "agent pin dialogs are not
                   styled" report. Both surfaces share one definition now. ── */}
            <VcAgentCard showOpenComment />

            {/* ── Normal comment: header + thread cards + composer (872:21857) ──
                GATED. The comment above used to say the SDK's native
                isSuggestionComment() gate was enough here and was "LIVE-VERIFIED
                to fire in both this surface and the sidebar rows". It is not, and
                this surface was the one place still relying on it: MEASURED on an
                agent annotation, the floating dialog rendered a 361x636 container
                holding BOTH branches — the 361x300 suggestion card AND `.vc-dialog`
                358x336 stacked underneath it, so the popover showed the agent's
                accept/reject card with a second "Comment / Altana Review A. /
                Reply" dialog hanging off the bottom of it.
                The sidebar-card and focused-thread variants already carry this
                exact guard for this exact reason; the base dialog needed it too,
                and now all three surfaces gate the same way. */}
            <VeltIf condition="{annotation.type} !== 'suggestion'">
            <div className="vc-dialog">
                {/* Header is an appendix slot (velt-comment-dialog-header-wireframe) — a real
                    registered element the curated manifest does not cover, not an invention. */}
                <VeltCommentDialogWireframe.Header className="vc-dialog-header">
                    <span className="vc-dialog-title">Comment</span>
                    {/* `.vc-dialog-actions` — family 1 parked this class on a bare placeholder
                        div inside the old single template so its enclosure held while it built
                        alone. It is ABSORBED here, in its real home (the dialog header), and
                        exists exactly once in the codebase. */}
                    <div className="vc-dialog-actions">
                        <VcOptionsMenu />
                        {/* The "open in sidebar" affordance (figma 872:21857 @ 331,23).
                            VeltButtonWireframe supplies the structure and a stable id; the
                            BEHAVIOR is the host's — components/velt/VeltCollaboration.tsx
                            matches `vc-open-sidebar` on useVeltEventCallback('veltButtonClick')
                            and opens the existing hw-rail drawer (HC-4, now wired and
                            live-verified: rail 0px -> 354px on a real click, idempotent on a
                            second press). R4 forbids a React onClick in here, so the Velt
                            button event IS the bridge — the same one `hw-cancel` uses. */}
                        <VeltButtonWireframe
                            id="vc-open-sidebar"
                            type="button"
                            className="vc-panel-toggle"
                        >
                            <VcSidebarSimpleIcon />
                        </VeltButtonWireframe>
                    </div>
                </VeltCommentDialogWireframe.Header>

                {/* ── REPOSITIONED (8:28660) ────────────────────────────────────────
                    The band used to be this dialog's FOOTER — last child, after the
                    composer, clipped by `.vc-dialog`'s 8px radius. The Design
                    Suggestion board moves it to the top: frame 8:28601 draws the
                    44px `Assigned to you` strip full-bleed between the header and
                    the body, and the sidebar card (8:28804) does the same thing at
                    the top of the card. Directly under `Header`, therefore — above
                    `VisibilityBanner` so the two never interleave.
                    Self-gating: nothing renders on an unassigned thread. */}
                <VcAssigneeBanner />

                <VeltCommentDialogWireframe.VisibilityBanner />

                <VeltCommentDialogWireframe.Body className="vc-dialog-body">
                    <VeltCommentDialogWireframe.Threads className="vc-thread">
                        {/* ThreadCard MUST nest in Body → Threads (verified) — at the dialog
                            root it renders an EMPTY card. Repeats PER COMMENT: the frame draws
                            two rows (root + 1 reply). */}
                        <VeltCommentDialogWireframe.ThreadCard className="vc-comment">
                            <div className="vc-comment-rail">
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
                            <div className="vc-comment-main">
                                <div className="vc-comment-head">
                                    {/* name and time are INLINE here (gap 4, baseline) — unlike the
                                        sidebar card, where the timestamp is pinned to the card's
                                        right edge. */}
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
                                    <VcCommentActions />
                                </div>
                                <VeltCommentDialogWireframe.ThreadCard.Message className="vc-message" />
                                {/* The edit field's host. Declaring it is what makes the
                                    per-comment `Edit` row in VcCommentActions work: the SDK
                                    mounts the editor into this slot, and this wireframe replaces
                                    the thread card's default template wholesale. */}
                                <VcEditComposer />
                                {/* The reactions row, under the message — frame 4:28071.
                                    Self-gating: Velt marks the card
                                    `velt-reactions="0"` when there are none, and the
                                    stylesheet collapses it, so an un-reacted comment
                                    keeps the geometry it has today. */}
                                <VcReactions />
                                {/* Customer-defined action chips (`comment.actions`). REQUIRED
                                    here: the SDK renders chips from inside its own thread-card
                                    template and this wireframe replaces that template wholesale,
                                    so without this line the chips silently never appear.
                                    Self-gating: renders nothing when a row has no actions. */}
                                <VeltCommentDialogActionsWireframe />
                            </div>
                        </VeltCommentDialogWireframe.ThreadCard>
                    </VeltCommentDialogWireframe.Threads>

                    {/* ── `↳ N replies` in the POPOVER too ────────────────────────────
                        This slot used to be omitted here on the reading that the
                        expanded dialog "shows every reply inline and draws no N-reply
                        row". That reading was wrong about what the SDK actually does:
                        with `collapsedComments` off, the floating dialog still opens
                        COLLAPSED — measured, a 3-comment thread rendered its root
                        comment and nothing else — so omitting the toggle left the
                        popover with the replies hidden and no control anywhere to
                        reveal them. The sidebar card had the row and the pin dialog did
                        not, which is exactly the asymmetry that got reported.
                        Same slot, same gate and same class as the sidebar card (see
                        VeltSidebarCardWf for why the count guard is required and why
                        `veltIf` is legal as an attribute here): BODY-level, exactly one
                        per thread, and absent on a thread with no replies. */}
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
                </VeltCommentDialogWireframe.Body>

                {/* ══ fam-composer / surface-composer-dialog (figma 872:22157) ══════════
                    The reply composer is the design's single 326x32 pill — see
                    VeltComposerWf.tsx for the full class contract. */}
                <VcDialogComposer />

            </div>
            </VeltIf>

            {/* NOT MOUNTED, on purpose (R7 — omitted, never display:none):
                  · ThreadCard.Reply — frame 872:21857 draws no per-comment reply control.
                    HC-5 UPDATE: ThreadCard.Options / ResolveButton / UnresolveButton are
                    mounted again via <VcCommentActions/>; omitting them removed per-comment
                    Edit and per-thread Resolve outright. Out-of-flow + hover-only, so the
                    frame's resting geometry is unchanged.
                  · ThreadCard.Edited / .Draft / .Unread — the expanded dialog is the READ
                    state and draws none of them.
                  · MoreReply — it REVEALS every reply in place, which is not this
                    surface's affordance; ToggleReply (mounted above) keeps the thread
                    collapsed at `↳ N replies` and expands on click. */}
        </VeltCommentDialogWireframe>
    );
}

export default VeltCommentDialogWf;
