"use client";

import { VeltCommentDialogWireframe, VeltIf } from "@veltdev/react";

// The assignee strip, shared by the list card, the pin dialog and the thread
// drawer — it has to be declared on each, since a root wireframe owns its whole
// child tree and an undeclared slot isn't defaulted back in.
//
// Self-gating: the SDK renders it only when `annotation.assignedTo` is set, so it
// costs nothing on an unassigned thread.
//
// Two label branches, because the design's wording ("Assigned to you") is written
// from the assignee's point of view and is wrong for everyone else. The name comes
// from Velt's own UserName slot so it tracks reassignment.
export function VcAssigneeBanner() {
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

export default VcAssigneeBanner;
