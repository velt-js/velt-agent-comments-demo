"use client";

import {
    VeltButtonWireframe,
    VeltCommentDialogActionsWireframe,
    VeltCommentDialogProgressWireframe,
    VeltCommentDialogWireframe,
} from "@veltdev/react";
import { VcCommentActions, VcEditComposer } from "./VcCommentActions";
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
            {/* ── Agent comment: suggestion card (unchanged from the demo's own design;
                   sub-phase A draws no frame for it, so nothing here is design-gated) ── */}
            <VeltCommentDialogWireframe.Suggestion>
                <div className="hw-agent-card">
                    {/* Resolution banner — SDK shows it only once accepted/rejected */}
                    <VeltCommentDialogWireframe.Suggestion.Banner />
                    <VeltCommentDialogWireframe.Suggestion.Header />
                    <VeltCommentDialogWireframe.Suggestion.Body />
                    {/* Live agent run ON this card (SDK AC-061). REQUIRED HERE: the SDK
                        mounts the progress row inside the suggestion card's DEFAULT
                        template, and this wireframe replaces that template wholesale — so
                        without this line a run writes correctly to the server and simply
                        never appears, with nothing logged. */}
                    <VeltCommentDialogProgressWireframe />
                    <VeltCommentDialogWireframe.Suggestion.Footer>
                        <div className="hw-agent-footer">
                            {/* Actions FIRST, then the link: the footer stacks vertically, so
                                source order is visual order — chips on top, "Open Comment"
                                underneath. */}
                            <VeltCommentDialogWireframe.Suggestion.Actions>
                                <div className="hw-suggestion-actions">
                                    <VeltCommentDialogWireframe.Suggestion.Actions.Accept />
                                    <VeltCommentDialogWireframe.Suggestion.Actions.Reject />
                                </div>
                            </VeltCommentDialogWireframe.Suggestion.Actions>
                            <VeltCommentDialogWireframe.Suggestion.Footer.OpenComment />
                        </div>
                    </VeltCommentDialogWireframe.Suggestion.Footer>
                </div>
            </VeltCommentDialogWireframe.Suggestion>

            {/* ── Normal comment: header + thread cards + composer (872:21857) ── */}
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

                <VeltCommentDialogWireframe.VisibilityBanner />

                <VeltCommentDialogWireframe.Body className="vc-dialog-body">
                    <VeltCommentDialogWireframe.Threads className="vc-thread">
                        {/* ThreadCard MUST nest in Body → Threads (verified) — at the dialog
                            root it renders an EMPTY card. Repeats PER COMMENT: the frame draws
                            two rows (root + 1 reply). */}
                        <VeltCommentDialogWireframe.ThreadCard className="vc-comment">
                            <div className="vc-comment-rail">
                                <VeltCommentDialogWireframe.ThreadCard.Avatar className="vc-avatar" />
                            </div>
                            <div className="vc-comment-main">
                                <div className="vc-comment-head">
                                    {/* name and time are INLINE here (gap 4, baseline) — unlike the
                                        sidebar card, where the timestamp is pinned to the card's
                                        right edge. */}
                                    <div className="vc-comment-headrow">
                                        <VeltCommentDialogWireframe.ThreadCard.Name className="vc-name" />
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

                {/* The assignee band (872:21791) is the dialog's FOOTER — last child,
                    after the composer. It was declared only in the sidebar variant
                    before, so the pin dialog dropped the band entirely; the first fix
                    put it back between the thread and the composer, which cut the
                    dialog in half with a pink strip mid-card. It is thread-level
                    metadata about the whole thread, so it belongs under everything
                    that acts on the thread, and `.vc-dialog`'s `overflow: hidden` +
                    8px radius clip its bottom corners to the card's own.
                    Self-gating: nothing renders on an unassigned thread. */}
                <VcAssigneeBanner />
            </div>

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
