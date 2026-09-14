"use client";

import { VeltCommentDialogWireframe } from "@veltdev/react";

function SendButton() {
    return (
        <div className="vc-send-slot">
            <VeltCommentDialogWireframe.Composer.ActionButton type="submit" className="vc-send" />
        </div>
    );
}

function MentionButton() {
    return (
        <VeltCommentDialogWireframe.Composer.ActionButton
            type="userMentions"
            className="vc-mention-btn"
        />
    );
}

function AssignUser() {
    return <VeltCommentDialogWireframe.Composer.AssignUser className="vc-assign-user" />;
}

// The pill's interior, shared by the dialog composer and the page-mode one
export function ComposerFieldContents({ inputClass, placeholder }: { inputClass: string; placeholder?: string }) {
    return (
        <>
            <VeltCommentDialogWireframe.Composer.Input className={inputClass} placeholder={placeholder} />
            <div className="vc-composer-actions">
                <AssignUser />
                <div className="vc-composer-tools">
                    <MentionButton />
                    <SendButton />
                </div>
            </div>
        </>
    );
}

export function VeltComposerWf() {
    return (
        <VeltCommentDialogWireframe.Composer className="vc-composer">
            <div className="vc-composer-field">
                <ComposerFieldContents inputClass="vc-composer-input" />
            </div>
        </VeltCommentDialogWireframe.Composer>
    );
}

export default VeltComposerWf;
