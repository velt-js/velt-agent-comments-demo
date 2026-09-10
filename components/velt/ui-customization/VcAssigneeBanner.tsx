"use client";

import { VeltCommentDialogWireframe, VeltIf } from "@veltdev/react";

// ═══ the assignee band (AssigneeBanner · 872:21791) ══════════════════════════
//
//   872:21791  the card's full-bleed #fdf1fa footer strip
//   872:21792  the row inside it — 20px avatar + label, 6px apart
//   872:21794  the label — 13px/20 Inter #666666
//
// Shared by every surface that shows a thread, which is why it lives here
// instead of inline in one of them. It used to be written out only inside
// VeltSidebarCardWf, so an assigned thread showed its assignee in the sidebar
// list and NOWHERE else — the pin dialog and the focused-thread drawer simply
// dropped the band, because a root wireframe owns its whole child tree and an
// undeclared slot is not defaulted back in.
//
// It self-gates: the SDK renders it only when `annotation.assignedTo` is set
// (verified in 6.0.11 — the internal component's own `shouldShow` is
// `!!config.data.annotation.assignedTo`), so mounting it on a surface costs
// nothing on an unassigned thread and no `VeltIf` of ours is needed for that.
//
// ── "you" vs the assignee's name ────────────────────────────────────────────
// The label was a hardcoded "Assigned to you", taken from frame 872:21791 —
// which is drawn from the point of view of the person it is assigned TO, so the
// frame's words are right for that ONE case and wrong for every other. A thread
// assigned to someone else read "Assigned to you" as well.
// Two branches now, on the annotation's assignee vs the signed-in user:
//   {annotation.assignedTo.userId} === {user.userId}  → "Assigned to you"
//   otherwise                                         → "Assigned to <name>"
// The name comes from Velt's own `AssigneeBanner.UserName` slot rather than any
// data of ours, so it stays correct as the assignment changes.
// `<VeltIf>` (the wrapper form) rather than the `veltIf` attribute: the
// attribute is only read on Velt's own elements, and these branches wrap plain
// spans. The wrappers clone in as `app-if` elements, so the stylesheet gives
// them `display: contents` to keep the band a single flex row.
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
