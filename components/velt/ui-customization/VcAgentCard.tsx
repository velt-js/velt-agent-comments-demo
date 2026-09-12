"use client";

import {
    VeltCommentDialogProgressWireframe,
    VeltCommentDialogWireframe,
} from "@veltdev/react";
import type { ReactNode } from "react";
import { VcSparklesIcon } from "./VcIcons";

// The agent / suggestion card, mounted by every dialog variant that can hold a
// suggestion annotation: the floating popover and the thread drawer. The sidebar
// list deliberately doesn't use it — the design draws an agent row there as an
// ordinary card.
//
// Every slot here is load-bearing. `Suggestion.Header.Agent.*` has to be declared
// as a tree or Velt falls back to its default header, avatar included. The
// progress wireframe has to be mounted or a live agent run writes to the server
// and never appears.
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
                                {/* Self-closing: these two slots take neither children
                                    nor a className — both are dropped by the clone. Their
                                    labels and pill chrome come from CSS instead, so they
                                    match the labelled pills a seed with its own `actions`
                                    renders. */}
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
