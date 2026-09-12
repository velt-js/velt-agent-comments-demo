"use client";

import { VeltCommentDialogWireframe } from "@veltdev/react";

// One composer chrome, two surfaces:
//
//   • the dialog's reply composer — mounted inside VeltCommentDialogWf
//   • the sidebar's page-mode composer — its own registration, because Velt
//     renders it by cloning the comment-dialog wireframe under the variant named
//     by the host's `pageModeComposerVariant` prop
//
// The page-mode variant declares only the Composer: a root wireframe owns its
// whole child tree, and undeclared slots are dropped rather than defaulted, which
// is what the design wants — a bare pill with nothing above or below it.
//
// Not mounted, because the design draws none of them: Avatar, Attachments,
// FormatToolbar, Recordings, PrivateBadge.

/**
 * `type="submit"` is required — the slot's `type` selects which composer action
 * the button is.
 *
 * Self-closing: markup injected here covers Velt's own button and kills submit
 * (a real click on the reply composer's send did nothing). The arrow and its
 * chrome are painted on Velt's button class in CSS instead.
 */
function SendButton() {
    return (
        <div className="vc-send-slot">
            <VeltCommentDialogWireframe.Composer.ActionButton type="submit" className="vc-send" />
        </div>
    );
}

/**
 * The `@`. Velt's own mention tool, not a control of ours — `type` picks the
 * action, and the SDK's union is
 *   userMentions | autocomplete | file | audio | video | screen | submit |
 *   attachments | format
 * Self-closing for the same reason as send; the glyph comes from CSS.
 *
 * It targets whichever composer the SDK holds as open, so the host must not leave
 * a second one live — see `openAnnotationInFocusMode` in VeltCollaboration.
 */
function MentionButton() {
    return (
        <VeltCommentDialogWireframe.Composer.ActionButton
            type="userMentions"
            className="vc-mention-btn"
        />
    );
}

/**
 * `Composer.AssignUser` — Velt's native assign control, rendered as a checkbox by
 * `setAssignToType({ type: 'checkbox' })` in VeltCollaboration. Self-gating: it
 * only appears once the composer holds a mention to assign.
 */
function AssignUser() {
    return <VeltCommentDialogWireframe.Composer.AssignUser className="vc-assign-user" />;
}

/**
 * The pill's interior, shared by both surfaces.
 *
 * `Composer.Input` stays childless — it renders Velt's real contenteditable and
 * placeholder, and children would replace the editor.
 */
function ComposerFieldContents({ inputClass, placeholder }: { inputClass: string; placeholder?: string }) {
    return (
        <>
            <VeltCommentDialogWireframe.Composer.Input className={inputClass} placeholder={placeholder} />
            {/* The pill's second row: assign on the left, @ and send on the right.
                `.vc-composer-actions` is `display: contents` at rest so the resting
                pill stays one 32px row, and only becomes a real row once the
                composer is focused or has somebody to assign. */}
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

/** The dialog's reply composer. Mounted inside VeltCommentDialogWf. */
export function VcDialogComposer() {
    return (
        <VeltCommentDialogWireframe.Composer className="vc-composer">
            <div className="vc-composer-field">
                <ComposerFieldContents inputClass="vc-composer-input" />
            </div>
        </VeltCommentDialogWireframe.Composer>
    );
}

/**
 * The sidebar's page-mode composer. The variant string must match the host's
 * `pageModeComposerVariant` prop exactly, or this falls back to the base dialog
 * and renders with no input.
 *
 * Here the Composer host is itself the pill — nothing else shares its box.
 */
export function VeltPageModeComposerWf() {
    return (
        <VeltCommentDialogWireframe variant="pageModeComposer">
            <VeltCommentDialogWireframe.Composer className="vc-composer-page-field">
                {/* Placeholder on the slot, not the host prop: the sidebar's
                    `commentPlaceholder` doesn't reach this composer — it resolves
                    from <VeltComments> instead and showed the generic text. */}
                <ComposerFieldContents inputClass="vc-composer-page-input" placeholder="New Comment" />
            </VeltCommentDialogWireframe.Composer>
        </VeltCommentDialogWireframe>
    );
}

export default VeltPageModeComposerWf;
