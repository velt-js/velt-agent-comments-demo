"use client";

import { VeltCommentDialogWireframe } from "@veltdev/react";
import { DotsThreeIcon } from "./icons";

export function VeltOptionsMenuWf() {
    return (
        <VeltCommentDialogWireframe.Options className="vc-options">
            <VeltCommentDialogWireframe.Options.Trigger className="vc-options-trigger">
                <DotsThreeIcon />
            </VeltCommentDialogWireframe.Options.Trigger>
            <VeltCommentDialogWireframe.Options.Content className="vc-options-menu">
                <VeltCommentDialogWireframe.Options.Content.MarkAsRead className="vc-menu-item-markasread">
                    <span className="vc-menu-label">Mark as Unread</span>
                </VeltCommentDialogWireframe.Options.Content.MarkAsRead>
                <VeltCommentDialogWireframe.CopyLink className="vc-menu-item-copylink">
                    <span className="vc-menu-label">Copy Link</span>
                </VeltCommentDialogWireframe.CopyLink>
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

export default VeltOptionsMenuWf;
