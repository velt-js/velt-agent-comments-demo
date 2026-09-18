"use client";

import {
    VeltCommentDialogProgressWireframe,
    VeltCommentDialogWireframe,
    VeltData,
    VeltIf,
} from "@veltdev/react";
import { ArrowBendDownRightIcon, SparklesIcon } from "./icons";
import { VeltAssigneeBannerWf } from "./VeltAssigneeBannerWf";
import { VeltAuthorAvatarWf, VeltAuthorNameWf } from "./VeltAuthorWf";
import { VeltCommentActionsWf, VeltEditComposerWf, VeltReactionsWf } from "./VeltCommentActionsWf";
import { VeltComposerWf } from "./VeltComposerWf";

function ContextLine() {
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
            <VeltCommentDialogWireframe.Suggestion>
                <div className="vc-card vc-agent">
                    <VeltCommentDialogWireframe.Body className="vc-card-inner">
                        <div className="vc-card-body">
                            <div className="vc-card-head">
                                <VeltCommentDialogWireframe.Suggestion.Header className="vc-card-headrow">
                                    <VeltCommentDialogWireframe.Suggestion.Header.Agent>
                                        <VeltCommentDialogWireframe.Suggestion.Header.Agent.Avatar className="vc-avatar">
                                            <span className="vc-avatar-glyph">
                                                <SparklesIcon />
                                            </span>
                                        </VeltCommentDialogWireframe.Suggestion.Header.Agent.Avatar>
                                        <VeltCommentDialogWireframe.Suggestion.Header.Agent.Name className="vc-name" />
                                    </VeltCommentDialogWireframe.Suggestion.Header.Agent>
                                    <span className="vc-meta">
                                        <VeltCommentDialogWireframe.Suggestion.Header.Timestamp className="vc-time" />
                                    </span>
                                </VeltCommentDialogWireframe.Suggestion.Header>
                                <ContextLine />
                                <VeltCommentDialogWireframe.Suggestion.Body className="vc-message" />
                            </div>
                        </div>
                        <VeltCommentDialogProgressWireframe />
                    </VeltCommentDialogWireframe.Body>
                </div>
            </VeltCommentDialogWireframe.Suggestion>

            <VeltIf className="vc-card-normal" condition="{annotation.type} !== 'suggestion'">
                <div className="vc-card">
                    <VeltCommentDialogWireframe.VisibilityBanner />
                    <VeltAssigneeBannerWf />
                    <VeltCommentDialogWireframe.Body
                        className="vc-card-inner"
                        veltClass="'vc-unread': {annotation.isUnread}, 'vc-has-replies': {annotation.comments.length} > 1, 'vc-assigned': {annotation.assignedTo}"
                    >
                        <VeltCommentDialogWireframe.Threads className="vc-card-body">
                            <VeltCommentDialogWireframe.ThreadCard className="vc-card-head">
                                <div className="vc-card-headrow">
                                    <VeltAuthorAvatarWf />
                                    <VeltAuthorNameWf />
                                    <span className="vc-meta">
                                        <VeltCommentDialogWireframe.ThreadCard.Unread>
                                            <span className="vc-unread-dot" />
                                        </VeltCommentDialogWireframe.ThreadCard.Unread>
                                        <VeltCommentDialogWireframe.ThreadCard.Time className="vc-time" />
                                    </span>
                                </div>
                                <VeltCommentActionsWf />
                                <VeltIf condition="{i} === 0">
                                    <ContextLine />
                                </VeltIf>
                                <VeltCommentDialogWireframe.ThreadCard.Message className="vc-message" />
                                <VeltEditComposerWf />
                                <VeltReactionsWf />
                            </VeltCommentDialogWireframe.ThreadCard>
                        </VeltCommentDialogWireframe.Threads>

                        <VeltCommentDialogWireframe.ToggleReply
                            className="vc-toggle-reply"
                            veltIf="{annotation.comments.length} > 1"
                        >
                            <VeltCommentDialogWireframe.ToggleReply.Icon className="vc-reply-icon">
                                <ArrowBendDownRightIcon />
                            </VeltCommentDialogWireframe.ToggleReply.Icon>
                            <span className="vc-reply-label">
                                <VeltCommentDialogWireframe.ToggleReply.Count className="vc-reply-count" />
                                <VeltCommentDialogWireframe.ToggleReply.Text className="vc-reply-text" />
                            </span>
                        </VeltCommentDialogWireframe.ToggleReply>
                    </VeltCommentDialogWireframe.Body>

                    <VeltComposerWf />
                </div>
            </VeltIf>
        </VeltCommentDialogWireframe>
    );
}

export default VeltSidebarCardWf;
