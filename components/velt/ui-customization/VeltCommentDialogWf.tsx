"use client";

import {
    VeltButtonWireframe,
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
                        <VeltCommentDialogWireframe.Suggestion.Footer>
                            <div className="hw-agent-footer">
                                <VeltCommentDialogWireframe.Suggestion.Footer.OpenComment />
                                <VeltCommentDialogWireframe.Suggestion.Actions>
                                    <div className="hw-suggestion-actions">
                                        <VeltButtonWireframe id="custom-button" type="button">
                                            <div className="custom-button">Log</div>
                                        </VeltButtonWireframe>
                                        <VeltCommentDialogWireframe.Suggestion.Actions.Accept />
                                        <VeltCommentDialogWireframe.Suggestion.Actions.Reject />
                                    </div>
                                </VeltCommentDialogWireframe.Suggestion.Actions>
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
