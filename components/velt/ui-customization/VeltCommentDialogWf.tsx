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
// (comment-dialog isAgentComment() → shouldShowAgentSuggestion):
//
//   annotation.agent && (annotation.type === 'suggestion' ||
//                        annotation.commentType === 'suggestion')
//
// TRUE  → only the <AgentSuggestion> subtree renders (agent comment card).
// FALSE → only the normal layout renders (thread cards + composer).
//
// No VeltIf is needed — the gate is native. If a manual condition were ever
// needed on another slot, the equivalent VeltIf string is:
//   "{annotation.agent} && ({annotation.type} == 'suggestion' ||
//    {annotation.commentType} == 'suggestion')"
// ({annotation} resolves to componentConfigSignal.data.annotation).
export function VeltCommentDialogWf() {
    return (
        <VeltCommentDialogWireframe>
            <VeltIf className="hw-agent-suggestion" condition="{annotation.type} === 'suggestion'">
                {/* ── Agent comment: suggestion card ── */}
                <VeltCommentDialogWireframe.AgentSuggestion>
                    <div className="hw-agent-card">
                        {/* Resolution banner — SDK shows it only once accepted/rejected */}
                        <VeltCommentDialogWireframe.AgentSuggestion.Banner />
                        <VeltCommentDialogWireframe.AgentSuggestion.Header />
                        <VeltCommentDialogWireframe.AgentSuggestion.Body />
                        <VeltCommentDialogWireframe.AgentSuggestion.Footer>
                            <div className="hw-agent-footer">
                                <VeltCommentDialogWireframe.AgentSuggestion.Footer.OpenComment />
                                <VeltCommentDialogWireframe.AgentSuggestion.Actions>
                                    <div className="hw-suggestion-actions">
                                        <VeltButtonWireframe id="custom-button" type="button">
                                            <div className="custom-button">Log</div>
                                        </VeltButtonWireframe>
                                        <VeltCommentDialogWireframe.AgentSuggestion.Actions.Accept />
                                        <VeltCommentDialogWireframe.AgentSuggestion.Actions.Reject />
                                    </div>
                                </VeltCommentDialogWireframe.AgentSuggestion.Actions>
                            </div>
                        </VeltCommentDialogWireframe.AgentSuggestion.Footer>
                    </div>
                </VeltCommentDialogWireframe.AgentSuggestion>
            </VeltIf>
            <VeltIf className="hw-normal-comment" condition="{annotation.type} !== 'suggestion'">
                {/* ── Normal comment: thread cards + composer ── */}
                <div className="hw-card">
                    <VeltCommentDialogWireframe.AgentSuggestion.Banner />
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
