"use client";

import {
    VeltButtonWireframe,
    VeltCommentDialogProgressWireframe,
    VeltCommentDialogWireframe,
    VeltData,
    VeltIf,
} from "@veltdev/react";
import { ReplyArrowIcon } from "@/components/icons";
import { ThreadCardWf } from "./ThreadCardWf";

// Comment dialog wireframe — the card chrome shared by the floating dialog and
// the sidebar threads.
//
// The dialog has TWO mutually exclusive layouts, switched by the SDK itself
// (comment-dialog isSuggestionComment() → shouldShowSuggestion; since the
// 2026-07 SDK rename+gate change the card renders for ANY suggestion-typed
// annotation, agent-authored or human-authored — annotation.agent is no
// longer required):
//
//   annotation.type === 'suggestion' || annotation.commentType === 'suggestion'
//
// TRUE  → only the <Suggestion> subtree renders (suggestion card).
// FALSE → only the normal layout renders (thread cards + composer).
//
// No VeltIf is needed — the gate is native. If a manual condition were ever
// needed on another slot, the equivalent VeltIf string is:
//   "{annotation.type} == 'suggestion' || {annotation.commentType} == 'suggestion'"
// ({annotation} resolves to componentConfigSignal.data.annotation).
export function VeltCommentDialogWf() {
    return (
        <VeltCommentDialogWireframe>
            <VeltIf className="hw-agent-suggestion" condition="{annotation.type} === 'suggestion'">
                {/* ── Agent comment: suggestion card ── */}
                <VeltCommentDialogWireframe.Suggestion>
                    <div className="hw-agent-card">
                        {/* Resolution banner — SDK shows it only once accepted/rejected */}
                        <VeltCommentDialogWireframe.Suggestion.Banner />
                        <VeltCommentDialogWireframe.Suggestion.Header />
                        <VeltCommentDialogWireframe.Suggestion.Body />
                        {/* Live agent run ON this card (SDK AC-061).
                            REQUIRED HERE. The SDK mounts the progress row inside the
                            suggestion card's DEFAULT template, and this wireframe replaces
                            that template wholesale — so without this line a run writes
                            correctly to the server and simply never appears, with nothing
                            logged. Exactly the same trap as the actions row in ThreadCardWf.
                            Placed between body and footer so the row sits where the answer
                            will land: when the run completes the body fills in above it and
                            the row disappears in the same frame. */}
                        <VeltCommentDialogProgressWireframe />
                        <VeltCommentDialogWireframe.Suggestion.Footer>
                            <div className="hw-agent-footer">
                                {/* Actions FIRST, then the link: the footer stacks vertically
                                    (see .hw-agent-footer), so source order is visual order —
                                    chips on top, "Open Comment" underneath. */}
                                <VeltCommentDialogWireframe.Suggestion.Actions>
                                    <div className="hw-suggestion-actions">
                                        {/* The old `VeltButtonWireframe id="custom-button"` "Log" button
                                            lived here. It is gone on purpose: it was a TEMPLATE-embedded
                                            button, and this demo now shows the DATA-driven equivalent —
                                            chips declared in `comment.actions` and dispatched through
                                            `commentActionClicked` (see AgentRunController). A customer
                                            would use one mechanism or the other, not both.

                                            NOTE: chips cannot be mounted on THIS card. The SDK renders
                                            `velt-comment-dialog-actions-internal` in exactly two
                                            templates — the thread card and the progress row — and the
                                            suggestion footer renders only the built-in accept/reject.
                                            The chip demo therefore lives on the third seeded finding,
                                            which is a normal comment thread rather than a suggestion. */}
                                        <VeltCommentDialogWireframe.Suggestion.Actions.Accept />
                                        <VeltCommentDialogWireframe.Suggestion.Actions.Reject />
                                    </div>
                                </VeltCommentDialogWireframe.Suggestion.Actions>
                                <VeltCommentDialogWireframe.Suggestion.Footer.OpenComment />
                            </div>
                        </VeltCommentDialogWireframe.Suggestion.Footer>
                    </div>
                </VeltCommentDialogWireframe.Suggestion>
            </VeltIf>
            <VeltIf className="hw-normal-comment" condition="{annotation.type} !== 'suggestion'">
                {/* ── Normal comment: thread cards + composer ── */}
                <div className="hw-card">
                    <VeltCommentDialogWireframe.Suggestion.Banner />
                    <VeltCommentDialogWireframe.VisibilityBanner />
                    <VeltCommentDialogWireframe.Body>
                        <VeltCommentDialogWireframe.Threads>
                            <ThreadCardWf />
                        </VeltCommentDialogWireframe.Threads>
                        <VeltCommentDialogWireframe.MoreReply>
                            <span className="hw-more-reply">
                                Show <VeltCommentDialogWireframe.MoreReply.Count />{" "}
                                <VeltCommentDialogWireframe.MoreReply.Text />
                            </span>
                        </VeltCommentDialogWireframe.MoreReply>
                        <VeltCommentDialogWireframe.ToggleReply>
                            <div className="hw-reply">
                                <ReplyArrowIcon />
                                <span>Reply</span>
                            </div>
                        </VeltCommentDialogWireframe.ToggleReply>
                    </VeltCommentDialogWireframe.Body>
                    <VeltCommentDialogWireframe.Composer>
                        <div className="hw-composer">
                            <div className="hw-composer-row">
                                <VeltCommentDialogWireframe.Composer.Avatar />
                                <VeltCommentDialogWireframe.Composer.Input />
                            </div>
                            <div className="hw-composer-actions">
                                <VeltButtonWireframe id="hw-cancel" type="button">
                                    <span className="hw-composer-cancel">Cancel</span>
                                </VeltButtonWireframe>
                                <VeltCommentDialogWireframe.Composer.ActionButton type="submit" />
                            </div>
                        </div>
                    </VeltCommentDialogWireframe.Composer>
                </div>
            </VeltIf>
        </VeltCommentDialogWireframe>
    );
}

export default VeltCommentDialogWf;
