"use client";

import {
    VeltCommentDialogActionsWireframe,
    VeltCommentDialogWireframe,
    VeltData,
    VeltIf,
} from "@veltdev/react";
import { VeltAgentCardWf } from "./VeltAgentCardWf";
import { VeltAssigneeBannerWf } from "./VeltAssigneeBannerWf";
import { VeltAuthorAvatarWf, VeltAuthorNameWf } from "./VeltAuthorWf";
import { VeltCommentActionsWf, VeltEditComposerWf, VeltReactionsWf } from "./VeltCommentActionsWf";
import {
    ArrowCounterClockwiseIcon,
    CheckCircleIcon,
} from "./icons";
import { VeltOptionsMenuWf } from "./VeltOptionsMenuWf";
import { VeltComposerWf } from "./VeltComposerWf";

function FocusHeader() {
    return (
        <VeltCommentDialogWireframe.Header className="vc-focus-header-row">
            <div className="vc-focus-actions">
                <VeltOptionsMenuWf />
                <VeltIf condition="!{resolved}">
                    <VeltCommentDialogWireframe.ResolveButton className="vc-focus-resolve">
                        <span className="hw-icon-btn">
                            <CheckCircleIcon />
                        </span>
                    </VeltCommentDialogWireframe.ResolveButton>
                </VeltIf>
                <VeltIf condition="{resolved}">
                    <VeltCommentDialogWireframe.UnresolveButton className="vc-focus-unresolve">
                        <span className="hw-icon-btn">
                            <ArrowCounterClockwiseIcon />
                        </span>
                    </VeltCommentDialogWireframe.UnresolveButton>
                </VeltIf>
            </div>
        </VeltCommentDialogWireframe.Header>
    );
}

export function VeltFocusedThreadWf() {
    return (
        <VeltCommentDialogWireframe variant="focusedThread">
            {/* Which thread is open, read by CommentsPanel (see VeltSidebarCardWf) */}
            <span className="vc-annotation-id" hidden>
                <VeltData field="annotation.annotationId" />
            </span>
            <VeltAgentCardWf header={<FocusHeader />} />

            <VeltIf condition="{annotation.type} !== 'suggestion'">
            <div className="vc-focus">
                <FocusHeader />

                {/* Under the header band, which the drawer's own header shares */}
                <VeltCommentDialogWireframe.VisibilityBanner />

                <VeltAssigneeBannerWf />

                <VeltCommentDialogWireframe.Body className="vc-focus-body">
                    <VeltCommentDialogWireframe.Threads className="vc-focus-thread">
                        <VeltCommentDialogWireframe.ThreadCard className="vc-focus-comment">
                            <div className="vc-focus-rail">
                                <VeltAuthorAvatarWf />
                            </div>
                            <div className="vc-focus-main">
                                <div className="vc-focus-head">
                                    <div className="vc-comment-headrow">
                                    <VeltAuthorNameWf />
                                        <VeltCommentDialogWireframe.ThreadCard.Time className="vc-time" />
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
                </VeltCommentDialogWireframe.Body>

                <VeltComposerWf />
            </div>
            </VeltIf>
        </VeltCommentDialogWireframe>
    );
}

export default VeltFocusedThreadWf;
