"use client";

import {
    VeltCommentDialogProgressWireframe,
    VeltCommentDialogWireframe,
} from "@veltdev/react";
import type { ReactNode } from "react";
import { VcSparklesIcon } from "./VcIcons";

// ═══ the agent / suggestion card, ONE definition ═════════════════════════════
//
// Mounted by every dialog variant that can hold a suggestion annotation: the
// floating popover (VeltCommentDialogWf) and the focused-thread drawer
// (VeltFocusedThreadWf). The sidebar LIST deliberately does not use it — the V2
// design draws an agent row there as an ordinary card ("Altana AI / Product Name
// / Updated Name"), not as an accept-reject card.
//
// ── Why it is shared ────────────────────────────────────────────────────────
// It used to be written out twice, and the two copies drifted — which is the
// whole reason the agent pin dialog looked unstyled. The popover's copy declared
// `Suggestion.Header` CHILDLESS, so Velt fell back to its DEFAULT header and
// painted its own dark squircle avatar in place of the design's purple sparkle
// disc; the drawer's copy declared the Agent/Avatar/Name/Timestamp tree properly
// and looked right. Two copies of the same card is two chances to miss one, so
// there is now one.
//
// ── Every slot here is load-bearing ─────────────────────────────────────────
// `Suggestion.Banner`  — the SDK shows it only once accepted/rejected.
// `Suggestion.Header.Agent.*` — declaring the tree is what replaces Velt's
//     default header (and its avatar) with the design's.
// `VeltCommentDialogProgressWireframe` — a live agent run mounts into the
//     suggestion card's DEFAULT template, and this wireframe replaces that
//     template wholesale, so without this line a run writes to the server
//     correctly and simply never appears, with nothing logged.
// `Suggestion.Footer.OpenComment` — the popover's link into the thread.
/**
 * @param header  the drawer's 48px band, which the sidebar's own
 *   `< Comment Thread  X` is positioned into by the stylesheet. Passed in rather
 *   than baked in: the floating popover draws no title bar for a suggestion
 *   (872:21857 gives the agent card the whole surface), and a `Header` declared
 *   there would add an empty 48px strip above it.
 * @param showOpenComment  the popover's link INTO the thread. Pointless in the
 *   drawer — you are already in the thread — so the drawer leaves it off.
 */
export function VcAgentCard({
    header,
    showOpenComment = false,
}: {
    header?: ReactNode;
    showOpenComment?: boolean;
}) {
    return (
        <VeltCommentDialogWireframe.Suggestion>
            <div className="hw-agent-card">
                {header}
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
                        {/* Actions first, then the link: the footer stacks vertically,
                            so source order is visual order — chips on top, "Open
                            Comment" underneath. */}
                        <VeltCommentDialogWireframe.Suggestion.Actions>
                            <div className="hw-suggestion-actions">
                                {/* SELF-CLOSING — these two slots take neither children
                                    nor a className. Measured: `<Accept className="…">
                                    <span>Accept</span></Accept>` rendered as
                                    `div.velt-suggestion-action-accept__button` with our
                                    class absent and `textContent` empty, so both were
                                    dropped by the clone.
                                    A seed that declares its own `actions` renders labelled
                                    pills ("Approve"/"Dismiss"/"Re-analyze"); a seed that
                                    does not falls back to these two, which shipped as a
                                    green tick square and a red cross square — the same
                                    decision drawn two ways in one list. The words and the
                                    pill chrome are therefore added in CSS instead, off the
                                    `aria-label` the SDK already sets on each button. */}
                                <VeltCommentDialogWireframe.Suggestion.Actions.Accept />
                                <VeltCommentDialogWireframe.Suggestion.Actions.Reject />
                            </div>
                        </VeltCommentDialogWireframe.Suggestion.Actions>
                        {showOpenComment ? (
                            <VeltCommentDialogWireframe.Suggestion.Footer.OpenComment />
                        ) : null}
                    </div>
                </VeltCommentDialogWireframe.Suggestion.Footer>
            </div>
        </VeltCommentDialogWireframe.Suggestion>
    );
}

export default VcAgentCard;
