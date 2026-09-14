"use client";

import { VeltCommentDialogWireframe, VeltIf } from "@veltdev/react";
import { DotsThreeIcon } from "./icons";

export function VeltCommentActionsWf() {
    return (
        <div className="vc-comment-actions">
            <VeltCommentDialogWireframe.ThreadCard.Options
                className="vc-comment-options"
                veltIf="{commentObj.from.userId} === {user.userId}"
            >
                <VeltCommentDialogWireframe.ThreadCard.Options.Trigger className="vc-comment-options-trigger">
                    <DotsThreeIcon />
                </VeltCommentDialogWireframe.ThreadCard.Options.Trigger>
                <VeltCommentDialogWireframe.ThreadCard.Options.Content className="vc-options-menu">
                    <VeltCommentDialogWireframe.ThreadCard.Options.Content.Edit className="vc-menu-item-edit">
                        <span className="vc-menu-label">Edit</span>
                    </VeltCommentDialogWireframe.ThreadCard.Options.Content.Edit>
                    <VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete className="vc-menu-item-delete">
                        <VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete.Comment>
                            <span className="vc-menu-label">Delete</span>
                        </VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete.Comment>
                        <VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete.Thread>
                            <span className="vc-menu-label">Delete</span>
                        </VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete.Thread>
                    </VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete>
                </VeltCommentDialogWireframe.ThreadCard.Options.Content>
            </VeltCommentDialogWireframe.ThreadCard.Options>

            <VeltIf condition="{commentObj.from.userId} !== {user.userId}">
                <VeltCommentDialogWireframe.ThreadCard.ReactionTool className="vc-reaction-tool" />
            </VeltIf>
        </div>
    );
}

export function VeltReactionsWf() {
    return (
        <VeltCommentDialogWireframe.ThreadCard.Reactions className="vc-reactions" />
    );
}

export function VeltEditComposerWf() {
    return (
        <VeltCommentDialogWireframe.ThreadCard.EditComposer className="vc-edit-composer" />
    );
}

export default VeltCommentActionsWf;
