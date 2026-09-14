"use client";

import { VeltCommentDialogWireframe, VeltData, VeltIf } from "@veltdev/react";

// `ThreadCard.Name` abbreviates, and an agent comment has no `from`
export function VeltAuthorNameWf() {
    return (
        <span className="vc-name">
            <VeltIf condition="!{commentObj.agent}">
                <VeltData field="commentObj.from.name" />
            </VeltIf>
            <VeltIf condition="{commentObj.agent}">
                <VeltData field="commentObj.agent.agentName" />
            </VeltIf>
        </span>
    );
}

// A child here would replace the avatar for every comment, so the disc is CSS
export function VeltAuthorAvatarWf() {
    return (
        <VeltCommentDialogWireframe.ThreadCard.Avatar
            className="vc-avatar"
            veltClass="'vc-avatar--agent': {commentObj.agent}"
        />
    );
}
