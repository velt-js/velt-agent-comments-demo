"use client";

import { VeltCommentDialogWireframe, VeltIf } from "@veltdev/react";
import { VcDotsThreeIcon } from "./VcIcons";

// Per-comment hover affordances, pinned to the top-right of a ThreadCard.
//
// The two are complements, and the design says so: on your own comment you get
// the kebab (Edit / Delete), on someone else's you get the reaction smiley. So
// neither is ever a dead control.
//
// Classes stay `vc-comment-*` rather than `vc-options-*`, which the dialog's
// thread-level options menu uses.

/**
 * Gated on authorship. Both rows the menu offers are owner-only and Velt's Edit
 * and Delete slots self-gate to nothing on someone else's comment — so without
 * the gate the kebab still rendered and opened an empty panel.
 *
 * `{commentObj}` is the per-comment context, so this resolves per row: a reply of
 * mine under someone else's comment keeps its kebab.
 */
export function VcCommentActions() {
    return (
        <div className="vc-comment-actions">
            <VeltCommentDialogWireframe.ThreadCard.Options
                className="vc-comment-options"
                veltIf="{commentObj.from.userId} === {user.userId}"
            >
                <VeltCommentDialogWireframe.ThreadCard.Options.Trigger className="vc-comment-options-trigger">
                    <VcDotsThreeIcon />
                </VeltCommentDialogWireframe.ThreadCard.Options.Trigger>
                <VeltCommentDialogWireframe.ThreadCard.Options.Content className="vc-options-menu">
                    <VeltCommentDialogWireframe.ThreadCard.Options.Content.Edit className="vc-menu-item-edit">
                        <span className="vc-menu-label">Edit</span>
                    </VeltCommentDialogWireframe.ThreadCard.Options.Content.Edit>
                    {/* Delete renders nothing unless its sub-slots are declared.
                        This menu is per-comment, so `.Comment` is the one that
                        normally paints; `.Thread` covers a single-comment thread. */}
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

            {/* The add-reaction smiley, on other people's comments only.
                Self-closing: the slot renders Velt's own picker trigger, and a
                child would cover it. Glyph comes from CSS.
                The `<VeltIf>` wrapper rather than the `veltIf` attribute the kebab
                uses — the attribute honours `===` but ignores `!==`. It clones in
                as an `app-if`, which the stylesheet gives `display: contents`. */}
            <VeltIf condition="{commentObj.from.userId} !== {user.userId}">
                <VeltCommentDialogWireframe.ThreadCard.ReactionTool className="vc-reaction-tool" />
            </VeltIf>
        </div>
    );
}

/**
 * The reaction chips, under the message.
 *
 * Not gated on authorship, unlike the tool above — other people react to my
 * comments too. Self-gates on emptiness: Velt marks the card
 * `velt-reactions="0"` when there are none and the stylesheet collapses it.
 */
export function VcReactions() {
    return (
        <VeltCommentDialogWireframe.ThreadCard.Reactions className="vc-reactions" />
    );
}

/**
 * The edit field's host. A sibling of the message row, not part of the hover
 * group, so the editor takes the message's place in flow. Declaring it is what
 * makes Edit do anything — without it the SDK enters edit mode and the message
 * simply disappears.
 */
export function VcEditComposer() {
    return (
        <VeltCommentDialogWireframe.ThreadCard.EditComposer className="vc-edit-composer" />
    );
}

export default VcCommentActions;
