"use client";

import { VeltCommentDialogWireframe, VeltIf } from "@veltdev/react";

export function VeltAssigneeBannerWf() {
    return (
        <VeltCommentDialogWireframe.AssigneeBanner className="vc-assignee-banner">
            <div className="vc-assignee-row">
                <VeltCommentDialogWireframe.AssigneeBanner.UserAvatar className="vc-assignee-avatar" />
                <VeltIf condition="{annotation.assignedTo.userId} === {user.userId}">
                    <span className="vc-assigned-label">Assigned to you</span>
                </VeltIf>
                <VeltIf condition="{annotation.assignedTo.userId} !== {user.userId}">
                    <span className="vc-assigned-label">
                        <span className="vc-assigned-prefix">Assigned to</span>
                        <VeltCommentDialogWireframe.AssigneeBanner.UserName className="vc-assignee-name" />
                    </span>
                </VeltIf>
            </div>
        </VeltCommentDialogWireframe.AssigneeBanner>
    );
}

export default VeltAssigneeBannerWf;
