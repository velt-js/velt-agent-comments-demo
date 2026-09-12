"use client";

import { VeltCommentDialogWireframe } from "@veltdev/react";
import { VcDotsThreeIcon } from "./VcIcons";

// The thread-level options dropdown: Mark as Unread · Copy Link · Delete.
//
// Nested inside each comment-dialog variant that needs it rather than registered
// at the wireframe root, which would go global and shadow the nested copies.
//
// Mounted on the root-level `Options` slot, not `ThreadCard.Options` — this is the
// one kebab per thread. The per-comment kebab is a different slot, in
// VcCommentActions.
//
// No Edit row (that's per-comment) and no Assign row: assignment moved to the
// composer, per design review.

export function VcOptionsMenu() {
    return (
        <VeltCommentDialogWireframe.Options className="vc-options">
            <VeltCommentDialogWireframe.Options.Trigger className="vc-options-trigger">
                <VcDotsThreeIcon />
            </VeltCommentDialogWireframe.Options.Trigger>
            {/* Options.Content — THIS is the floating 200px menu surface that
                carries the chrome (R23/M2b): never .vc-options, never the trigger. */}
            <VeltCommentDialogWireframe.Options.Content className="vc-options-menu">
                {/* MarkAsRead is the SDK's toggle host; its label is our own text.
                    (The previous build wrapped this in a hand-written
                    `velt-comment-dialog-options-dropdown-content-mark-as-read-mark-unread-wireframe`
                    element taken from a stale slot list — that tag is NOT in the
                    6.0.11 registry, so it rendered as inert markup that happened to
                    pass the label through. Removed; the label now sits directly in
                    the real slot.) */}
                <VeltCommentDialogWireframe.Options.Content.MarkAsRead className="vc-menu-item-markasread">
                    <span className="vc-menu-label">Mark as Unread</span>
                </VeltCommentDialogWireframe.Options.Content.MarkAsRead>
                <VeltCommentDialogWireframe.CopyLink className="vc-menu-item-copylink">
                    <span className="vc-menu-label">Copy Link</span>
                </VeltCommentDialogWireframe.CopyLink>
                {/* Delete renders NOTHING unless its canonical sub-slots are declared
                    (live-verified: bare `Delete` + a child span → 0x0, empty). The SDK
                    picks Comment vs Thread per annotation, so both are declared and each
                    carries the design's single "Delete" label — only one ever renders. */}
                <VeltCommentDialogWireframe.Options.Content.Delete className="vc-menu-item-delete">
                    <VeltCommentDialogWireframe.Options.Content.Delete.Thread>
                        <span className="vc-menu-label">Delete</span>
                    </VeltCommentDialogWireframe.Options.Content.Delete.Thread>
                    <VeltCommentDialogWireframe.Options.Content.Delete.Comment>
                        <span className="vc-menu-label">Delete</span>
                    </VeltCommentDialogWireframe.Options.Content.Delete.Comment>
                </VeltCommentDialogWireframe.Options.Content.Delete>
            </VeltCommentDialogWireframe.Options.Content>
        </VeltCommentDialogWireframe.Options>
    );
}

export default VcOptionsMenu;
