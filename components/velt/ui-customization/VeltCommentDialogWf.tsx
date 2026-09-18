"use client";

import {
    VeltButtonWireframe,
    VeltCommentDialogActionsWireframe,
    VeltCommentDialogWireframe,
    VeltIf,
} from "@veltdev/react";
import { VeltAuthorAvatarWf, VeltAuthorNameWf } from "./VeltAuthorWf";
import { VeltCommentActionsWf, VeltEditComposerWf, VeltReactionsWf } from "./VeltCommentActionsWf";
import { VeltAgentCardWf } from "./VeltAgentCardWf";
import { VeltAssigneeBannerWf } from "./VeltAssigneeBannerWf";
import { ArrowBendDownRightIcon, SidebarSimpleIcon } from "./icons";
import { VeltOptionsMenuWf } from "./VeltOptionsMenuWf";
import { VeltComposerWf } from "./VeltComposerWf";

export function VeltCommentDialogWf() {
    return (
        <VeltCommentDialogWireframe>
            <VeltAgentCardWf showOpenComment />

            <VeltIf condition="{annotation.type} !== 'suggestion'">
            <div className="vc-dialog">
                <VeltCommentDialogWireframe.VisibilityBanner />
                <VeltCommentDialogWireframe.Header className="vc-dialog-header">
                    <span className="vc-dialog-title">Comment</span>
                    <div className="vc-dialog-actions">
                        <VeltOptionsMenuWf />
                        <VeltButtonWireframe
                            id="vc-open-sidebar"
                            type="button"
                            className="vc-panel-toggle"
                        >
                            <SidebarSimpleIcon />
                        </VeltButtonWireframe>
                    </div>
                </VeltCommentDialogWireframe.Header>

                <VeltAssigneeBannerWf />

                <VeltCommentDialogWireframe.Body className="vc-dialog-body">
                    <VeltCommentDialogWireframe.Threads className="vc-thread">
                        <VeltCommentDialogWireframe.ThreadCard className="vc-comment">
                            <div className="vc-comment-rail">
                                <VeltAuthorAvatarWf />
                            </div>
                            <div className="vc-comment-main">
                                <div className="vc-comment-head">
                                    <div className="vc-comment-headrow">
                                    <VeltAuthorNameWf />
                                        <VeltCommentDialogWireframe.ThreadCard.Time className="vc-time" />
                                        <VeltCommentDialogWireframe.ThreadCard.Unread className="vc-unread-slot">
                                            <span className="vc-unread-dot" />
                                        </VeltCommentDialogWireframe.ThreadCard.Unread>
                                    </div>
                                    <VeltCommentActionsWf />
                                </div>
                                <VeltCommentDialogWireframe.ThreadCard.Message className="vc-message" />
                                <VeltEditComposerWf />
                                <VeltReactionsWf />
                                <VeltCommentDialogActionsWireframe />
                            </div>
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

export default VeltCommentDialogWf;
